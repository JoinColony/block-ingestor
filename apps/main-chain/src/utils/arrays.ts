export const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;
export const notNull = <T>(x: T | null): x is T => x !== null;

/**
 * Helper function returning a copy of the original array with replaced item at a specific index
 */
export const insertAtIndex = <T>(array: T[], index: number, item: T): T[] => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
};
