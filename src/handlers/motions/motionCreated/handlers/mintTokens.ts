import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleMintTokensMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const {
    colonyAddress,
    args: { domainId },
    blockNumber,
  } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);
  await createMotionInDB(event, {
    type: motionNameMapping[name],
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    amount,
    gasEstimate: gasEstimate.toString(),
  });
};
