export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeId: number,
): string => `${colonyAddress}_${nativeId}`;

export const getPendingMetadataDatabaseId = (
  colonyAddress: string,
  transactionHash: string,
): string => `${colonyAddress}_motion-${transactionHash}`;
