# TypeScript patterns

Code examples for each rule in [SKILL.md](./SKILL.md). None of them needs a library: FiveM resources validate with plain TypeScript.

## Branded types

Brand primitives so they can't be mixed up. A server id (`source`), a character id and an item name are all plain numbers or strings underneath, and passing one where another belongs still compiles. Validate once at the boundary; downstream code trusts the type.

```ts
type PlayerId = number & { readonly __brand: "PlayerId" };
type CharId = number & { readonly __brand: "CharId" };

function parseCharId(input: unknown): CharId {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 1) {
    throw new Error(`Invalid char id: ${String(input)}`);
  }
  return input as CharId;
}

function giveVehicle(owner: CharId, model: string): void {
  /* owner is trusted */
}
```

Match the `readonly __brand: "X"` shape. Don't invent a new convention.

## Discriminated unions

Model variants with a literal discriminant. Every variant shares the field name and each variant's value is unique, so impossible combinations can't be represented.

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type ShopState = { loading: boolean; items?: ShopItem[]; error?: string };

// Do. Only valid states exist.
type ShopState =
  | { kind: "loading" }
  | { kind: "ready"; items: ShopItem[] }
  | { kind: "error"; error: string };
```

Pick one discriminant name (`kind`, `type`, `action`) and stick to it.

## Constructive modeling

Build the type from parts that are all legal instead of restricting a loose type with runtime checks.

Non-empty, via a variadic tuple:

```ts
type NonEmpty<T> = [T, ...T[]];

// Don't: T[] plus a length check every caller must repeat
function pickSpawn(spawns: Spawn[]): Spawn {
  if (spawns.length === 0) throw new Error("no spawns");
  return spawns[Math.floor(Math.random() * spawns.length)];
}

// Do: an empty value of the type can't exist
function pickSpawn(spawns: NonEmpty<Spawn>): Spawn {
  return spawns[Math.floor(Math.random() * spawns.length)];
}
```

Where a plain `T[]` arrives, narrow once with a guard. The fact then travels in the type:

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

Even length, as pairs:

```ts
type Pairs<T> = [T, T][];
```

A cooldown, as start plus duration:

```ts
// Don't: a comment holds the invariant
type Cooldown = { start: number; end: number }; // start <= end

// Do: a negative cooldown can't be written; derive the end when needed
type Cooldown = { start: number; durationMs: number };
```

Keep `durationMs` a plain number. Brand it only if a raw number could be passed where a duration is expected, not by reflex. Pick the representation that makes the bad state unconstructable, then expose the reading you need on top (`pairs.flat()`, a `cooldownEnd()` helper).

## Simplest total type

Don't strengthen everything. Keep `T[]` when every operation on it is total:

```ts
const totalWeight = (items: Item[]) => items.reduce((sum, item) => sum + item.weight, 0); // [] is 0, fine
```

Strengthen when the loose type forces a lie at a use site. The tells are `!`, `arr[0] as T`, and a "should never happen" throw:

```ts
// Don't: partiality smuggled past the compiler
function nearestGarage(garages: Garage[]): Garage {
  return garages.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function nearestGarage(garages: NonEmpty<Garage>): Garage {
  return garages[0];
}
```

Weakening the result to `Garage | undefined` is the other total signature.

## `unknown` over `any`

Data from outside the resource is `unknown`. Narrow before use.

```ts
// Don't. onNet takes a Function, so these annotations are unchecked casts.
onNet("shop:buy", (item: string, count: number) => {
  /* a client can send anything here */
});

// Do
onNet("shop:buy", (item: unknown, count: unknown) => {
  const playerId = source;

  if (typeof item !== "string") return;
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) return;

  /* item and count are narrowed */
});
```

## Parse functions

Turn client data into a typed value with a function that takes `unknown` and returns the value or `null`. Build the result as a fresh object rather than returning the input: the compiler then checks every field against the return type, and fields the client added are dropped.

```ts
type BuyRequest = { item: string; count: number };

function toBuyRequest(value: unknown): BuyRequest | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("item" in value) || typeof value.item !== "string" || value.item.length === 0) return null;
  if (!("count" in value) || typeof value.count !== "number" || !Number.isInteger(value.count) || value.count < 1) return null;

  return { item: value.item, count: value.count };
}

onNet("shop:buy", (payload: unknown) => {
  const playerId = source;
  const request = toBuyRequest(payload);

  if (!request) return;

  buy(playerId, request);
});
```

Remove `count` from the returned object and it fails to compile. A type guard (`value is T`) is fine when the value can be used as-is, such as a coordinate tuple, as long as it checks every element.

Look for the resource's existing parsers and guards before writing one: a `toCoords` or `isValidX` usually exists. Keep shared ones in a module both the client and the server import.

## `null` means omitted

FiveM serializes event arguments with MessagePack, which can turn an omitted or `undefined` value into `null`, including nested properties and array entries. An optional parameter (`target?: number`) doesn't stop that.

```ts
// Don't. A null target slips past and reaches the business logic.
onNet("garage:share", (plate: unknown, target?: unknown) => {
  if (target !== undefined && typeof target !== "number") return;
});

// Do. Both null and undefined reach the omitted path.
onNet("garage:share", (plate: unknown, target?: unknown) => {
  if (typeof plate !== "string" || plate.length === 0) return;
  if (target != null && (typeof target !== "number" || !Number.isInteger(target))) return;

  share(source, plate, target ?? undefined);
});
```

Normalize with `?? undefined` at the boundary so the code inside sees one "absent" value. Never use truthiness to validate (`if (!count)`): `0` and `false` are real values. A required value rejects both `null` and `undefined`.

## No `as` casts

Every `as` is a potential runtime crash. Cast only after the type system has verified the claim.

```ts
// Don't
const vehicle = row as VehicleRow;

// Don't: the guard checks one field and claims the whole shape
function isVehicleRow(row: unknown): row is VehicleRow {
  return typeof row === "object" && row !== null && "plate" in row;
}

// Do
function toVehicleRow(row: unknown): VehicleRow | null {
  if (typeof row !== "object" || row === null) return null;
  if (!("plate" in row) || typeof row.plate !== "string") return null;
  if (!("model" in row) || typeof row.model !== "string") return null;

  return { plate: row.plate, model: row.model };
}
```

A type argument on an untyped call is the same cast spelled differently. Nothing checks `T` in `triggerServerCallback<T>` or in a generic database helper.

When refactoring an `as` out of existing code, identify why TypeScript can't infer:

- Missing discriminant: add one, switch to a discriminated union.
- Overly wide source type (e.g. `Record<string, unknown>`): narrow it.
- Untyped boundary (an event argument, an export result, a state bag value): parse it with the resource's existing parse function for that shape, or write one.
- Genuinely inexpressible: use a branded type or `satisfies`.

## Narrowing hierarchy

From best to last resort:

1. **Discriminated union switch / if.** The compiler narrows automatically.
2. **`in` operator.** `"key" in obj` narrows to variants containing that key.
3. **`typeof` / `instanceof`.** For primitives and class instances.
4. **User-defined type guard.** When the above aren't enough.
5. **`as` cast.** Only after validation.

```ts
function zoneArea(zone: Zone): number {
  if ("radius" in zone) return Math.PI * zone.radius ** 2; // narrowed to sphere
  return zone.width * zone.length; // narrowed to box
}
```

## Type guards

A guard must actually verify the claim. A lying guard is worse than `as`.

```ts
function isSphere(zone: Zone): zone is Zone & { kind: "sphere" } {
  return zone.kind === "sphere";
}
```

Prefer discriminant narrowing when possible.

## Exhaustiveness

In default arms, assign the discriminant to a `never`-typed local. A shared union of NUI messages is the classic case: add a message and every listener that forgot it fails to compile.

```ts
// Value-returning switch
function zoneArea(zone: Zone): number {
  switch (zone.kind) {
    case "sphere":
      return Math.PI * zone.radius ** 2;
    case "box":
      return zone.width * zone.length;
    default: {
      const _exhaustive: never = zone;
      return _exhaustive;
    }
  }
}

// Void switch
function onMessage(message: NuiMessage): void {
  switch (message.action) {
    case "open":
      open(message.items);
      break;
    case "close":
      close();
      break;
    default: {
      const _exhaustive: never = message;
      void _exhaustive;
    }
  }
}
```

Return style in value-returning switches, void style in statement switches.

## `satisfies` over `as`

`satisfies` validates without widening literal types.

```ts
// Don't. Widens, loses literal types.
const config = { currency: "money", maxStack: 50 } as ShopConfig;

// Do. Validates and keeps literal types.
const config = { currency: "money", maxStack: 50 } satisfies ShopConfig;
// config.currency is "money" (literal), not string
```

## Boundary validation

Validate once where data crosses in. Trust types inside. The handler stays thin, and the logic it calls takes typed data, so it can be tested without a server.

```ts
// The boundary: parse, call, return.
onClientCallback("garage:takeOut", (playerId: number, plate: unknown) => {
  if (typeof plate !== "string") return false;
  return takeOut(playerId as PlayerId, plate);
});

// Inside: typed input, no re-validation.
function takeOut(playerId: PlayerId, plate: string): boolean {
  /* ... */
}
```

`playerId` comes from ox_lib's callback handler, which reads it from `source`, so it is a real server id and the brand is earned.

- **Persisted JSON** (KVP, metadata columns): a versioned blob with a `try` / `catch` around the parse.
- **Exports from other resources:** wrap each one you use in a typed function that parses its result, in one module.
- **Don't re-validate** deep in call chains.

## Derived types

When a shape already exists in code (a function's parameters, a package's types, a database table's row type), derive from it instead of declaring it again.

```ts
// Don't. Two copies, one in the client script and one in the NUI, that drift.
// client/nui.ts
type NuiMessage = { action: "open"; items: ShopItem[] } | { action: "close" };
// web/src/App.tsx
type NuiMessage = { action: "open"; items: ShopItem[] } | { action: "close" };

// Do. One module both sides import.
// shared/nui.ts
export type NuiMessage = { action: "open"; items: ShopItem[] } | { action: "close" };
```

Reach for `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof` before writing a new interface.

## Object args

```ts
// Don't. Swap two args, still compiles.
createShop("Ammunation", "weapons", 50, 10);

// Do. Order-independent, self-documenting.
createShop({ label: "Ammunation", category: "weapons", maxStack: 50, restockMinutes: 10 });
```

Skip on hot paths: `setTick` callbacks and anything else running every frame, where the allocation cost matters. Natives stay positional; don't wrap them just to get object args.
