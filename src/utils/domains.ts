export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeId: number,
): string => `${colonyAddress}_${nativeId}`;

export const getPendingMotionDomainDatabaseId = (
  colonyAddress: string,
  transactionHash: string,
) => `${colonyAddress}_motion-${transactionHash}`;

