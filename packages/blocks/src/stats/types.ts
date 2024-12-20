export type ObjectOrFunction =
  | Record<string, unknown>
  | ((jsonFile: Record<string, unknown>) => Record<string, unknown>);