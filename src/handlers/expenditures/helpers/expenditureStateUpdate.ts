import { BigNumber } from 'ethers';
import { getCachedColonyClient } from '~utils';

export const getCanFinalizeExpenditure = async (
  expenditureNativePotId: number,
  colonyAddress: string,
): Promise<boolean> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return false;
  }

  const fundingPot = await colonyClient.getFundingPot(expenditureNativePotId);

  return BigNumber.from('0').eq(fundingPot.payoutsWeCannotMake);
};
