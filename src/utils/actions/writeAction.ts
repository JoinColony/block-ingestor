import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateColonyActionDocument,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { verbose } from '~utils';

type ActionFields = Record<string, unknown> & { type: ColonyActionType };

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: ActionFields,
): Promise<void> => {
  const { transactionHash, blockNumber, timestamp } = event;

  const actionType = actionFields.type ?? 'UNKNOWN';
  verbose('Action', actionType, 'took place in Colony:', colonyAddress);

  await mutate<CreateColonyActionMutation, CreateColonyActionMutationVariables>(
    CreateColonyActionDocument,
    {
      input: {
        id: transactionHash,
        colonyId: colonyAddress,
        blockNumber,
        createdAt: new Date(timestamp * 1000).toISOString(),
        ...actionFields,
      },
    },
  );
};
