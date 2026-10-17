# Entities

## Local by default

First decide whether every player must interact with the *same* instance, to drive it, loot it or fight it. If not, the entity is **local**. Each client spawns its own non-networked copy when the player comes in range and deletes it when they leave. Shop peds, props, scenery and preview vehicles are local. A local entity uses no network traffic, and no other client can move or delete it.

```lua
-- client
local prop = lib.prop.create(`prop_vend_soda_01`, coords.x, coords.y, coords.z, heading)

FreezeEntityPosition(prop.handle, true)
```

`lib.prop.create`, `lib.ped.create` and `lib.vehicle.create` load the model, create the entity non-networked and release the model. They error if the model fails to load, and they yield while it loads, so call them from a thread or an event handler. Delete the entity with `DeleteEntity(prop.handle)`.

## Networked means server-spawned

When players must share the instance, the server creates it and the server deletes it. The entity then exists once, and one side owns it.

```lua
-- server
local vehicle = lib.vehicle.create(`sultan`, 'automobile', coords.x, coords.y, coords.z, heading)
local netId = NetworkGetNetworkIdFromEntity(vehicle.handle)
```

On the server, `lib.vehicle.create(model, type, x, y, z, heading)` calls `CreateVehicleServerSetter`, and `lib.prop.create` and `lib.ped.create` create networked entities.

A client that wants a networked entity gone asks the server, which checks the request and deletes it:

```lua
-- server
RegisterNetEvent('tow:release', function(netId)
    local playerId = source
    local entity = NetworkGetEntityFromNetworkId(netId)

    if entity == 0 or not canRelease(playerId, entity) then return end

    DeleteEntity(entity)
end)
```

Only server code calls `DeleteEntity` on a networked entity. With `sv_protectServerEntities` on, the server rejects a client's attempt to delete a server-created entity anyway.

If your framework has its own vehicle spawner, spawn and remove vehicles through it. It registers them for keys, garages and persistence, which a generic spawner skips.

## Network control only through a server whitelist

Change a networked entity in this order, stopping at the first that works:

1. On the server, with a server native.
2. Through its owner: `NetworkGetEntityOwner(entity)` on the server, then a targeted event to that player.
3. Through a whitelist, when only a client can do it. The server flags that one entity for that one action and resets the flag afterwards.

```lua
-- server
RegisterNetEvent('tow:hook', function(netId)
    local playerId = source
    local entity = NetworkGetEntityFromNetworkId(netId)

    if entity == 0 or not canHook(playerId, entity) then return end

    SetEntityIgnoreRequestControlFilter(entity, true)
    TriggerClientEvent('tow:takeControl', playerId, netId)

    SetTimeout(5000, function()
        if DoesEntityExist(entity) then SetEntityIgnoreRequestControlFilter(entity, false) end
    end)
end)
```

```lua
-- client
RegisterNetEvent('tow:takeControl', function(netId)
    local entity = NetworkGetEntityFromNetworkId(netId)
    local timeout = GetGameTimer() + 2000

    NetworkRequestControlOfEntity(entity)

    while not NetworkHasControlOfEntity(entity) do
        if GetGameTimer() > timeout then return end
        Wait(0)
    end

    attachToTowTruck(entity)
end)
```

`NetworkRequestControlOfEntity` belongs only in step 3, always with a timeout. Cfx.re deprecated it, and `sv_filterRequestControl` rejects it in every other case. The default mode rejects it for occupied vehicles, and stricter modes reject it for every entity.

## Blocked networked shortcuts

Hardened servers turn off three GTA network events. Write the alternative by default, so the resource works whether they're on or off.

| Setting | What stops working | Do instead |
| --- | --- | --- |
| `sv_enableNetworkedSounds false` | Sounds played with `isNetwork` set to `true` (`PlaySoundFromEntity`, `PlaySoundFromCoord`) don't reach other players | Play with `isNetwork` set to `false`. For other players to hear it, the server sends nearby players an event and each client plays the sound locally |
| `game_sanitizeRagdollEvents true` | Ragdolling another player's ped from your client. Their client ignores the request | Send that player an event so their client ragdolls its own ped |
| `sv_enableNetworkedScriptEntityStates false` | These natives, called on an entity another client owns: `TaskSetBlockingOfNonTemporaryEvents`, `SetPedRelationshipGroupHash`, `SetDriveTaskCruiseSpeed`, `TaskLookAtEntity`, `SetPlaneMinHeightAboveTerrain`, `SetRagdollBlockingFlags`, `TaskVehicleTempAction`, `SetFacialIdleAnimOverride`, `SetVehicleDoorsLocked`, `SetVehicleExclusiveDriver` | Call them on entities you own, which includes every local entity. Otherwise the server finds the owner with `NetworkGetEntityOwner` and sends them a targeted event. The server can set vehicle locks itself with `SetVehicleDoorsLocked` |

To play a sound every nearby player hears:

```lua
-- server
local function playSoundNear(coords, audioName, audioRef)
    for _, player in ipairs(lib.getNearbyPlayers(coords, 30.0)) do
        TriggerClientEvent('alarm:playSound', player.id, coords, audioName, audioRef)
    end
end
```

```lua
-- client
RegisterNetEvent('alarm:playSound', function(coords, audioName, audioRef)
    PlaySoundFromCoord(-1, audioName, coords.x, coords.y, coords.z, audioRef, false, 30, false)
end)
```

## Handles and ids

- Send network ids across the network, because an entity handle only means something in the runtime that made it. On the other side, check the lookup result. `0` means the entity is missing or out of scope.
- Save your own durable id. Network ids and player server ids are reused.

## Attachments

To show a prop in a player's hand, the server writes `{ model, bone, offset }` to the player's state bag and each client attaches its own local prop. Networked attachments break when the entity changes owner.
