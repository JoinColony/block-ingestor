import { BigNumber } from 'ethers';

export const getMultiSigDatabaseId = (
  chainId: number,
  multiSigExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${multiSigExtnAddress}_${nativeMotionId}`;
