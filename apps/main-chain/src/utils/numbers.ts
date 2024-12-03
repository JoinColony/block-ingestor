import { BigNumber, BigNumberish, utils } from 'ethers';

export const toNumber = (bigNumber: BigNumberish): number =>
  BigNumber.from(bigNumber).toNumber();

export const toB32 = (input: BigNumberish): string =>
  utils.hexZeroPad(utils.hexlify(input), 32);
