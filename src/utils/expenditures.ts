export const getExpenditureDatabaseId = (
  colonyAddress: string,
  nativeExpenditureId: number,
): string => `${colonyAddress}_${nativeExpenditureId}`;
