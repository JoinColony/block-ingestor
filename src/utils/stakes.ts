export const getUserStakeDatabaseId = (
  userAddress: string,
  motionTransactionHash: string,
): string => {
  return `${userAddress}_${motionTransactionHash}`;
};
