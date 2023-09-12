import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId, toNumber } from '~utils';

import { ColonyActionType } from '~graphql';
import { MultiPayment } from '~handlers/actions/oneTxPayment';

import { createMotionInDB } from '../helpers';

export const handlePaymentMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const [, , , , recipients, tokenAddresses, amounts, fromDomainId] =
    actionArgs;

  if (recipients.length === 1) {
    await createMotionInDB(event, {
      type: motionNameMapping[name],
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      tokenAddress: tokenAddresses[0],
      amount: amounts[0].toString(),
      recipientAddress: recipients[0],
      gasEstimate: gasEstimate.toString(),
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

    await createMotionInDB(event, {
      type: ColonyActionType.MultiplePaymentMotion,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      payments,
      gasEstimate: gasEstimate.toString(),
    });
  }
};
