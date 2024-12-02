import { Id } from '@colony/colony-js';
import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleUnlockTokenMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { blockNumber } = event;

  const { name } = parsedAction;
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    tokenAddress,
  });
};
