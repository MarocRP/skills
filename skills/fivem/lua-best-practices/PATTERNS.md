# Lua patterns

Code examples for each section of [SKILL.md](./SKILL.md), modelled on how ox_inventory, ox_target and ox_fuel are laid out.

## Resource layout

```
my_shops/
├── fxmanifest.lua
├── client/
│   ├── init.lua         # client entry: requires everything else
│   ├── utils.lua        # module
│   └── target.lua       # module, only required when ox_target is used
├── server/
│   ├── init.lua         # server entry
│   └── shops.lua        # module
├── data/
│   └── shops.lua        # data: returns a table, loaded with lib.load
└── locales/
    ├── en.json
    └── de.json
```

## Manifest

```lua
fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

name 'my_shops'
version '1.0.0'

dependencies {
    'ox_lib',
}

shared_script '@ox_lib/init.lua'

ox_libs {
    'locale',
}

client_script 'client/init.lua'
server_script 'server/init.lua'

files {
    'client/*.lua',
    'data/*.lua',
    'locales/*.json',
}
```

`client/*.lua` also matches `client/init.lua`. That's fine: a file in `files` is only downloaded, not run. What runs is `client_script`, and the entry script requires the rest. `server/` isn't in `files`, so its code never reaches clients.

## Entry script

```lua
-- client/init.lua
if not lib.checkDependency('ox_lib', '3.30.0', true) then return end

local utils = require 'client.utils'
local useTarget = GetConvarInt('my_shops:target', 0) == 1

for id, shop in pairs(lib.load('data.shops') or {}) do
    utils.createShopBlip(id, shop)
end

if useTarget and GetResourceState('ox_target') == 'started' then
    return require 'client.target'
end

require 'client.points'
```

## Module

```lua
-- client/utils.lua
local utils = {}

---@param id string
---@param shop { coords: vector3, label: string, blip?: { sprite: number, colour: number } }
function utils.createShopBlip(id, shop)
    if not shop.blip then return end

    local blip = AddBlipForCoord(shop.coords.x, shop.coords.y, shop.coords.z)
    SetBlipSprite(blip, shop.blip.sprite)
    SetBlipColour(blip, shop.blip.colour)
    -- ...
end

return utils
```

Every file that does `require 'client.utils'` gets this same table, so a value one module stores on it is visible to the rest.

## Data file

```lua
-- data/shops.lua
return {
    ammunation_downtown = {
        label = 'Ammu-Nation',
        coords = vec3(22.0, -1107.2, 29.8),
        blip = { sprite = 110, colour = 69 },
        items = { 'ammo-9', 'WEAPON_PISTOL' },
    },
}
```

Load it with `lib.load('data.shops')` where it's used. Each call builds a fresh table, so the client and the server can each reshape their copy without touching the other.

## require vs lib.load

```lua
-- Don't: a data file through require. Every module now shares one table, and a
-- module that adds fields to a shop changes it for all the others.
local shops = require 'data.shops'

-- Don't: lib.load in a handler. The file is read and run again on every event.
RegisterNetEvent('my_shops:open', function(id)
    local shops = lib.load('data.shops')
end)

-- Do: load once, at the top of the file that consumes it.
local shops = lib.load('data.shops')

RegisterNetEvent('my_shops:open', function(id)
    local shop = shops[id]
end)
```

```lua
-- Don't: the file is a client_script AND required, so it runs twice.
client_scripts { 'client/init.lua', 'client/utils.lua' }

-- Do: only the entry is a script; utils.lua is a module listed in files.
client_script 'client/init.lua'
files { 'client/utils.lua' }
```

Another resource's library runs inside your resource:

```lua
local Ox = require '@ox_core.lib.init' --[[@as OxClient]]
```

`Ox` here is your copy of ox_core's client library, which talks to ox_core through exports. Requiring a resource's module never gives you that resource's live tables.

## Config

```lua
-- Settings a server owner tunes: convars, set in server.cfg with
--   setr my_shops:target 1
local useTarget = GetConvarInt('my_shops:target', 0) == 1
local restockMinutes = GetConvarInt('my_shops:restockMinutes', 30)
local blockedJobs = json.decode(GetConvar('my_shops:blockedJobs', '[]'))
```

Use `setr` for a convar the client reads: it replicates to clients, `set` doesn't.

## cache and lib.onCache

```lua
-- Don't: poll for a change every frame
CreateThread(function()
    local lastVehicle

    while true do
        local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)

        if vehicle ~= lastVehicle then
            lastVehicle = vehicle
            onVehicleChanged(vehicle)
        end

        Wait(0)
    end
end)

-- Do
lib.onCache('vehicle', function(vehicle, oldVehicle)
    onVehicleChanged(vehicle)
end)
```

Until the handler first yields, `cache.vehicle` still holds the old value: ox_lib starts the handlers before it stores the new one. Use the `vehicle` argument.

## Points instead of distance loops

```lua
local shops = lib.load('data.shops')

for id, shop in pairs(shops) do
    lib.points.new({
        coords = shop.coords,
        distance = 3,
        shopId = id,
        onEnter = function(self)
            lib.showTextUI(locale('open_shop', shop.label))
        end,
        onExit = function(self)
            lib.hideTextUI()
        end,
        nearby = function(self)
            if IsControlJustReleased(0, 38) then
                TriggerServerEvent('my_shops:open', self.shopId)
            end
        end,
    })
end
```

Extra fields on the table (`shopId` here) are kept on the point and available as `self.shopId`.

## Callbacks

```lua
-- server/shops.lua
local shops = lib.load('data.shops')

lib.callback.register('my_shops:buy', function(source, shopId, itemName, count)
    local shop = type(shopId) == 'string' and shops[shopId]
    if not shop then return false end

    if type(itemName) ~= 'string' or not lib.table.contains(shop.items, itemName) then return false end
    if type(count) ~= 'number' or count < 1 or count > 100 or math.floor(count) ~= count then return false end

    local playerCoords = GetEntityCoords(GetPlayerPed(source))
    if #(playerCoords - shop.coords) > 5 then return false end

    -- charge and give the item
    return true
end)
```

```lua
-- client
local bought = lib.callback.await('my_shops:buy', 500, shopId, itemName, count)
```

`500` stops the client from sending the request more than once every 500 ms; a throttled call returns `nil`. The `math.floor` check rejects fractions and NaN without rejecting a whole number that arrives as a float (`1.0`).

## Locales

`locales/en.json`:

```json
{
  "open_shop": "[E] Open %s",
  "not_enough_money": "You need $%d"
}
```

```lua
lib.notify({ type = 'error', description = locale('not_enough_money', price) })
```

With `ox_libs { 'locale' }` in the manifest, `locale` is ready when the first script runs. `de.json` only needs the keys it translates; the rest fall back to `en.json`.

## CfxLua syntax

```lua
-- Hash a constant name at compile time; joaat only for names built at runtime.
if GetSelectedPedWeapon(cache.ped) == `WEAPON_UNARMED` then return end
local model = joaat(('prop_%s'):format(variant))

-- Safe navigation
local label = item.metadata?.label or item.label

-- Compound assignment
inventory.weight += item.weight * count

-- Preallocate and clear
local players = table.create(#ids, 0)
table.wipe(pending)
```
