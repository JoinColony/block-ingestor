import { ColonyActionType, ContractEvent } from '~/types';
import { writeActionFromEvent } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ColonyEdit,
    initiatorAddress,
  });
};
