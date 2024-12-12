export const getUserStakeDatabaseId = (
  userAddress: string,
  transactionHash: string,
): string => {
  return `${userAddress}_${transactionHash}`;
};
