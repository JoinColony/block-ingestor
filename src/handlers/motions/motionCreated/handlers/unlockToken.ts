import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleUnlockTokenMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress, blockNumber } = event;
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    tokenAddress,
    gasEstimate: gasEstimate.toString(),
  });
};
