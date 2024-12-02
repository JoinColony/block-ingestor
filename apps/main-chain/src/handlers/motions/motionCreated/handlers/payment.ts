import { TransactionDescription } from 'ethers/lib/utils';

import { motionNameMapping } from '~types';
import { getDomainDatabaseId, toNumber } from '~utils';

import { ColonyActionType } from '@joincolony/graphql';
import { MultiPayment } from '~handlers/actions/oneTxPayment';

import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handlePaymentMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const [, , , , recipients, tokenAddresses, amounts, fromDomainId] =
    actionArgs;

  if (recipients.length === 1) {
    await createMotionInDB(colonyAddress, event, {
      type: motionNameMapping[name],
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      tokenAddress: tokenAddresses[0],
      amount: amounts[0].toString(),
      recipientAddress: recipients[0],
    });
  } else {
    const payments = (recipients as string[]).map((recipient, idx) => {
      const payment: MultiPayment = {
        amount: amounts[idx].toString(),
        tokenAddress: tokenAddresses[idx],
        recipientAddress: recipient,
      };
      return payment;
    });

    await createMotionInDB(colonyAddress, event, {
      type: ColonyActionType.MultiplePaymentMotion,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      payments,
    });
  }
};
