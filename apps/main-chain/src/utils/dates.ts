export const getBlockChainTimestampISODate = (
  blockTimestamp: number,
): string => {
  return new Date(blockTimestamp * 1000).toISOString();
};
