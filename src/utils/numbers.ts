import { BigNumber, BigNumberish } from 'ethers';

export const toNumber = (bigNumber: BigNumberish): number =>
  BigNumber.from(bigNumber).toNumber();
