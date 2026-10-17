# Lifecycle

Resources restart and players leave mid-action. Anything that outlives the code that made it is a leak.

## Clean up what you create

When a resource stops, its script state goes with it: variables, threads, event handlers. Game state made through natives may stay, so the resource cleans it up itself.

| Created | Cleaned up with |
| --- | --- |
| Entity | `DeleteEntity`, on the client for local entities and on the server for networked ones |
| Blip | `RemoveBlip` |
| Camera | `RenderScriptCams(false, false, 0, true, false)`, `DestroyCam` |
| Loaded model, anim dict | `SetModelAsNoLongerNeeded`, `RemoveAnimDict` |
| Timer or tick | `clearTimeout`, `clearTick` (JS), or a flag that ends the thread (Lua) |
| Per-player table entry | `players[id] = nil` |

```lua
AddEventHandler('onResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end

    for _, entity in pairs(spawned) do
        if DoesEntityExist(entity) then DeleteEntity(entity) end
    end
end)
```

`onResourceStop` fires for every resource, so the handler filters to its own first.

## Players leaving

Clear per-player state on `playerDropped`, and per-character state on your framework's logout event as well, since a player can log out without disconnecting. Server ids are reused, so a stale entry ends up attached to the next player.

```lua
AddEventHandler('playerDropped', function()
    sessions[source] = nil
end)
```

## Register once

Register event handlers, commands, exports and zones at file scope. Each registration inside another handler or a loop adds a copy every time it runs, and every copy fires.

## The restart test

Use the feature, `restart` the resource twice, and use it again. Done when nothing is doubled (props, blips, handlers) and the resource's memory in `resmon` is back where it started.
