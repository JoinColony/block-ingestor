import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId, toNumber } from '~utils';

import { createMotionInDB } from '../helpers';

export const handlePaymentMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const {
    contractAddress: colonyAddress,
  } = event;
  const { name, args: actionArgs } = parsedAction;
  const [, , , , recipients, tokenAddresses, amounts, fromDomainId] = actionArgs;
  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
    tokenAddress: tokenAddresses[0],
    amount: amounts[0].toString(),
    recipientAddress: recipients[0],
  });
};
