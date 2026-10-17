# Events and network

## Push, don't poll

Before writing a loop, find what pushes the change: a game or framework event, a state-bag change handler, a zone's enter and exit. When a loop has to exist, it:

- sleeps long when idle and short when active,
- checks cheap conditions before expensive ones,
- runs per-frame work (drawing, controls) only while it's needed.

Don't hand-write a distance loop. `lib.points` checks the player's distance every 300 ms and runs `nearby` every frame only while the player is in range.

```lua
lib.points.new({
    coords = shopCoords,
    distance = 10.0,
    nearby = function(self)
        drawShopMarker()
    end,
})
```

## Requests and pushes

- A request with a response is a callback from one callback library, not a pair of events.
- A one-way push is an event.
- Use `AddEventHandler` for events that stay on one side, and `RegisterNetEvent` only for events that cross the network.
- Name events `resource:action` so they don't collide.

## `source` and async

On the server, `source` holds the caller only until the handler first yields (`Wait`, an awaited query, a callback). Copy it on the first line. After any yield, check that the player and whatever the reply was for (an open menu, the same character) still exist before acting.

```lua
RegisterNetEvent('shop:buy', function(item)
    local playerId = source
    local price = db.getPrice(item)

    if not DoesPlayerExist(playerId) then return end

    charge(playerId, price)
end)
```

## Network traffic

- Send only to the players who need it. Use `TriggerClientEvent(name, -1, ...)` only when every player uses the update.
- Send the id and the fields that changed, and skip the send when nothing changed.
- Send payloads of several kilobytes with `TriggerLatentClientEvent(name, playerId, bytesPerSecond, ...)`.

## State bags

State bags hold small facts about an entity or player, such as a door's lock or a vehicle's fuel. Read and write them through ox_lib's entity wrappers: `lib.vehicle:new(handle)`, `lib.prop:new(handle)`, `lib.ped:new(handle)` and `lib.player:new(serverId)`. In TypeScript, use the `Vehicle`, `Prop`, `Ped` and `Player` classes from `@overextended/ox_lib`.

**Only the server writes replicated values.** A client that wants a value changed sends your own event or callback, and the server checks the request and writes. Client code never calls `setr` or `state:set(key, value, true)`. Depending on the server's `sv_stateBagStrictMode`, a client write is either rejected or replicated to everyone unchecked.

```lua
-- server
local vehicle = lib.vehicle:new(entity)

vehicle:setr('fuel', 42.5)
vehicle:set('lastRefuel', os.time())
```

`setr` replicates to every client with the entity in scope, `set` with no mode stays on the server, and `get(key)` reads on either side.

- Use one flat key per fact. A write replicates the whole value, and changing a field inside a table read from a bag replicates nothing.
- Write a value only when it changes.
- Keep each value to a few scalars. Send arrays, histories and per-frame coordinates through targeted events instead.
- Register one change handler per key, once:

```lua
-- client
AddStateBagChangeHandler('fuel', nil, function(bagName, key, value)
    local entity = GetEntityFromStateBagName(bagName)

    if entity == 0 then return end

    updateFuelGauge(entity, value)
end)
```

The handler runs before the bag stores the new value, so read `value`, not the bag.
