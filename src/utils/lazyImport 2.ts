
import { ComponentType, lazy } from "react";

/**
 * Helper function for lazy loading components with named exports
 */
export function lazyImport<
  T extends ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

// Example usage:
// const { ComponentName } = lazyImport(() => import("./path-to-component"), "ComponentName");
