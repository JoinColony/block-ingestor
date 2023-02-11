import { mutate } from '../amplifyClient';
import { ContractEvent } from '../types';
import { verbose } from './logger';

export const writeActionFromEvent = async (
  event: ContractEvent,
  actionFields: Record<string, any>,
): Promise<void> => {
  const {
    transactionHash,
    contractAddress: colonyAddress,
    blockNumber,
    timestamp,
  } = event;

  const actionType = actionFields.type ?? 'UNKNOWN';
  verbose('Action', actionType, 'took place in Colony:', colonyAddress);

  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      blockNumber,
      createdAt: new Date(timestamp * 1000).toISOString(),
      ...actionFields,
    },
  });
};
