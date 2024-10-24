import { ActionHandler } from '~actions/types';
import { ContractEvent } from '~types';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '~graphql';
import { toNumber } from '~utils';

export const handlePaymentAction: ActionHandler = async (
  events: ContractEvent[],
): Promise<void> => {
  const paymentEvent = events[0];
  const { colonyAddress, args } = paymentEvent;

  if (!colonyAddress || !args) {
    throw new Error('Invalid payment event: missing colonyAddress or args');
  }

  const { recipient, amount, tokenAddress, domainId } = args;

  if (!recipient || !amount || !tokenAddress || !domainId) {
    throw new Error('Invalid payment event: missing required arguments');
  }

  const actionFields = {
    type: ColonyActionType.Payment,
    amount: toNumber(amount),
    tokenAddress,
    recipient,
    initiatorAddress: paymentEvent.from,
    fromDomainId: toNumber(domainId),
    toDomainId: toNumber(domainId),
  };

  await writeActionFromEvent(paymentEvent, colonyAddress, actionFields);
};
