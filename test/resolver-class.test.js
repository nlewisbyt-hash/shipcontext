import { describe, it } from "node:test";
import assert from "node:assert/strict";
import resolverModule from "@forge/resolver";
import { getConstructor } from "../src/lib/resolver-class.js";

describe("getConstructor", () => {
  it("returns a function when given the class itself", () => {
    class FakeResolver {}
    assert.equal(getConstructor(FakeResolver), FakeResolver);
  });

  it("unwraps one or two .default layers from a CJS interop object", () => {
    class FakeResolver {}
    const oneLevel = { default: FakeResolver };
    const twoLevels = { default: { default: FakeResolver } };
    assert.equal(getConstructor(oneLevel), FakeResolver);
    assert.equal(getConstructor(twoLevels), FakeResolver);
  });

  it("unwraps the real @forge/resolver package under ESM and can construct it", () => {
    const Resolver = getConstructor(resolverModule);
    assert.equal(typeof Resolver, "function");
    const resolver = new Resolver();
    resolver.define("ping", () => ({ ok: true }));
    assert.equal(typeof resolver.getDefinitions(), "function");
  });

  it("throws if no constructor can be found", () => {
    assert.throws(() => getConstructor({}), /Failed to load the Forge Resolver constructor/);
  });
});
