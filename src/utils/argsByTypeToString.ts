import { BigNumber } from 'ethers';

export const argsByTypeToString = (value: unknown, type?: string): string => {
  switch (true) {
    case type?.startsWith('uint'):
    case type?.startsWith('int'):
      return BigNumber.from(value).toString();
    case type === 'address':
    case typeof value === 'string':
      return value as string;
    default:
      return JSON.stringify(value);
  }
};
