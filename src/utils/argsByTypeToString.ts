import { BigNumber } from 'ethers';

export const argsByTypeToString = (value: unknown, type?: string): string => {
  switch (true) {
    case type?.startsWith('uint'):
    case type?.startsWith('int'):
      return BigNumber.from(value).toString();
    default:
      return JSON.stringify(value);
  }
};
