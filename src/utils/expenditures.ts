import { utils } from 'ethers';

export const getExpenditureDatabaseId = (
  colonyAddress: string,
  nativeExpenditureId: number,
): string => {
  let checksummedAddress: string;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch {
    checksummedAddress = colonyAddress;
  }

  return `${checksummedAddress}_${nativeExpenditureId}`;
};
