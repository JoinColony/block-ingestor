export const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;
export const notNull = <T>(x: T | null): x is T => x !== null;
