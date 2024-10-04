// For testing.
// Run this:
//    $ deno test --allow-net main_test.ts
// Cleve  2024

import { assertEquals } from "@std/assert";
import { testFunction } from "./main.ts";

Deno.test(function onlyTest() {
  assertEquals(testFunction(), "test");
});
