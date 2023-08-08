import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import { writeActionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { target: recipientAddress } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MakeArbitraryTransaction,
    initiatorAddress: colonyAddress,
    recipientAddress,
  });
};
