import { mutate } from '~amplifyClient';
import {
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { verbose } from '~utils';

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: Omit<
    CreateColonyActionInput,
    'blockNumber' | 'colonyId' | 'colonyActionsId'
  >,
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
