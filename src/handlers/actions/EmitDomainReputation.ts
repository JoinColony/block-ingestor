import { BigNumber } from 'ethers';
import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, user: userAddress, skillId, amount } = event.args;
  console.log('event', event);

  const isReputationChangePositive = BigNumber.from(amount).gt(0);

  const actionType = isReputationChangePositive ? ColonyActionType.EmitDomainReputationReward : ColonyActionType.EmitDomainReputationPenalty;

  await writeActionFromEvent(event, colonyAddress, {
    type: actionType,
    initiatorAddress,
    recipientAddress: userAddress,
    skillId: toNumber(skillId),
    amount: amount.toString(),
  });
};
