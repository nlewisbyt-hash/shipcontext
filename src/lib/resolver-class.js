/**
 * @forge/resolver 2.x is CommonJS (`exports.default = Resolver`).
 * Under ESM, and in the Forge webpack bundle, a default import can
 * yield the module object rather than the class. Unwrap `.default`
 * until we have a constructor.
 */
export function getConstructor(mod) {
  let current = mod;
  for (let i = 0; i < 3; i += 1) {
    if (typeof current === "function") {
      return current;
    }
    if (
      current &&
      (typeof current === "object" || typeof current === "function") &&
      "default" in current &&
      current.default != null
    ) {
      current = current.default;
      continue;
    }
    break;
  }
  throw new TypeError("Failed to load the Forge Resolver constructor");
}
