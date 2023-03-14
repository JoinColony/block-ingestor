import { ColonyActionType, ContractEvent } from '~/types';
import { writeActionFromEvent } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, user: userAddress, skillId, amount } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ManageReputation,
    initiatorAddress,
    userAddress,
    skillId,
    amount: amount.toString(),
  });
};
