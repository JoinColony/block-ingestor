import { TransactionDescription } from 'ethers/lib/utils';

import { multiSigNameMapping } from '~types';
import { getDomainDatabaseId, toNumber } from '~utils';

import { ColonyActionType } from '@joincolony/graphql';
import { MultiPayment } from '~handlers/actions/oneTxPayment';

import { createMultiSigInDB } from '../helpers';
import { sendMentionNotifications } from '~utils/notifications';
import { ContractEvent } from '@joincolony/blocks';

export const handlePaymentMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const [, , , , recipients, tokenAddresses, amounts, fromDomainId] =
    actionArgs;

  if (recipients.length === 1) {
    await createMultiSigInDB(colonyAddress, event, {
      type: multiSigNameMapping[name],
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

    await createMultiSigInDB(colonyAddress, event, {
      type: ColonyActionType.MultiplePaymentMultisig,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      payments,
    });
  }

  sendMentionNotifications({
    colonyAddress,
    creator: event.args.agent,
    transactionHash: event.transactionHash,
    recipients,
  });
};
