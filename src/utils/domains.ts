export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeId: number | string,
): string => `${colonyAddress}_${nativeId}`;
