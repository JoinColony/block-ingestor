import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleMintTokensMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const {
    args: { domainId },
    blockNumber,
  } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);
  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    amount,
  });
};
