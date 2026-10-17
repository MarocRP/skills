# Data

## Database

All database access runs on the server.

- Keep the SQL in one module per domain. Handlers call `db.getStock(shopId)` and contain no queries.
- Pass every value through `?` placeholders and a parameter array. Never build SQL with `..` or template strings.
- Give every list query a `LIMIT` and an `ORDER BY`.
- Fetch a set of rows with one query, using a join or an `IN` list, rather than one query per row.
- Read-then-write is a race. Two requests can both read "5 in stock" and both sell. Put the condition in the write and check the affected rows:

```lua
local TAKE_STOCK = 'UPDATE shop_stock SET quantity = quantity - ? WHERE shop = ? AND item = ? AND quantity >= ?'

function db.takeStock(shop, item, count)
    return MySQL.update.await(TAKE_STOCK, { count, shop, item, count }) == 1
end
```

- Index the columns that hot queries filter and sort on, and check the plan with `EXPLAIN`.
- Change framework data through the framework, not with raw SQL on its tables.

### Choosing the oxmysql method

Pick the method by what you need back.

- `MySQL.scalar` returns one value, the first column of the first row, such as a count or a balance.
- `MySQL.single` returns one row, or `nil`.
- `MySQL.query` returns every matching row. Use it for lists.
- `MySQL.insert` returns the new row's id.
- `MySQL.update` returns the affected-row count. Use it for `UPDATE` and `DELETE`.
- `MySQL.transaction` runs several writes that all commit or none do, and returns `true` or `false`.
- `MySQL.prepare` runs a fixed statement that executes very often, or one statement once per parameter set in a single call. It accepts only `?` placeholders, and it returns dates and `TINYINT(1)` raw instead of as date strings and booleans.
- `MySQL.rawExecute` works like `prepare` but returns the driver's result unshaped, so a `SELECT` always gives an array of rows.

Inside a thread, use the `.await` form, as in `MySQL.single.await(query, params)`. `MySQL.Sync`, `MySQL.Async` and `fetchAll` are legacy aliases.

## Config

- Every player downloads everything in `client_scripts`, `shared_scripts` and `files`. Keep payouts, loot tables and server-side locations in server-only files.
- `set` keeps a convar on the server, `setr` replicates it to clients, and `sets` publishes it in the server list. Store secrets such as keys, tokens and webhook URLs with `set` in a cfg kept out of git. Read them with `GetConvar` on the server, and never write them into a resource file.

## Logging

On the server, log the outcomes worth reconstructing later, such as money moved, items created and admin actions. Leave failed attempts and per-frame work out of the log.
