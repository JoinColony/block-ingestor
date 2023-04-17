import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getColonyTokenAddress, getDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleMintTokensMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { domainId },
  } = event;
  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress);
  await createMotionInDB(event, {
    type: motionNameMapping[name],
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    amount,
  });
};
