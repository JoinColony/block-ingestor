import { BigNumber } from 'ethers';

export const argsByTypeToString = (value: unknown, type?: string): string => {
  try {
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
  } catch (e) {
    if (typeof (value as any).toString === 'function') {
      return (value as any).toString();
    } else {
      return `${value}`;
    }
  }
};
