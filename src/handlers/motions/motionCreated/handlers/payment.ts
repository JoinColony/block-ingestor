import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId, toNumber } from '~utils';

import { ColonyActionType } from '~graphql';
import { MultiPayment } from '~handlers/actions/oneTxPayment';

import { createMotionInDB } from '../helpers';
import { getAmountLessFee, getNetworkInverseFee } from '~utils/networkFee';

export const handlePaymentMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const [, , , , recipients, tokenAddresses, amounts, fromDomainId] =
    actionArgs;

  const networkInverseFee = await getNetworkInverseFee();
  if (!networkInverseFee) {
    throw new Error(
      'Network inverse fee not found. This is a bug and should be investigated.',
    );
  }

  if (recipients.length === 1) {
    const amountLessFee = getAmountLessFee(amounts[0], networkInverseFee);
    const fee = BigNumber.from(amounts[0]).sub(amountLessFee);

    await createMotionInDB(colonyAddress, event, {
      type: motionNameMapping[name],
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      tokenAddress: tokenAddresses[0],
      amount: amountLessFee.toString(),
      networkFee: fee.toString(),
      recipientAddress: recipients[0],
      gasEstimate: gasEstimate.toString(),
    });
  } else {
    const payments = (recipients as string[]).map((recipient, idx) => {
      const amountLessFee = getAmountLessFee(amounts[idx], networkInverseFee);
      const fee = BigNumber.from(amounts[idx]).sub(amountLessFee);

      const payment: MultiPayment = {
        amount: amountLessFee.toString(),
        networkFee: fee.toString(),
        tokenAddress: tokenAddresses[idx],
        recipientAddress: recipient,
      };
      return payment;
    });

    await createMotionInDB(colonyAddress, event, {
      type: ColonyActionType.MultiplePaymentMotion,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(fromDomainId)),
      payments,
      gasEstimate: gasEstimate.toString(),
    });
  }
};
