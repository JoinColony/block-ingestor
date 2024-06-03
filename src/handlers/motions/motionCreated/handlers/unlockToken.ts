import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleUnlockTokenMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { blockNumber } = event;

  const { name } = parsedAction;
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    tokenAddress,
    gasEstimate: gasEstimate.toString(),
  });
};
