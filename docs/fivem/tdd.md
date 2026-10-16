## What it does

`tdd` fixes a bug in a TypeScript resource test-first: it writes a focused regression test, runs it to watch it fail for the right reason, makes the smallest fix, and runs it again to watch it pass. The final report shows both runs.

The tests run under the resource's test runner with the natives and ox_lib calls mocked, so the bug is proven fixed without a FiveM server.

## When to reach for it

Type `/tdd`, or the agent reaches for it automatically when you ask for a failing test or a regression test, or when the bug has an obvious cheap test target such as a parse function, a price calculation or a NUI reducer. It only covers TypeScript resources and their NUI.

## When it skips the test

A bad test is worse than none. When a test would need a large harness, mostly test mocks, depend on timing, or be deleted right after the fix, the agent uses the closest check it can run itself instead: a script, browser automation against the NUI's dev server, a log assertion, or `tsc --noEmit` for a type error. It says why.

## It's working if

- The report names the test that failed before the fix and the run where it passed.
- Tests call the code the way the resource does and assert exact values.
- Existing assertions aren't weakened to make a fix pass.

## Where it fits

A **bug-fix** habit for TypeScript resources. It pairs with [typescript-best-practices](./typescript-best-practices.md), whose parse functions are often the cheapest thing to test.
