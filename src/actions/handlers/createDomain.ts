import { ActionHandler } from '~actions/types';
import { ContractEvent } from '~types';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '~graphql';
import { toNumber } from '~utils';

export const handleCreateDomainAction: ActionHandler = async (
  events: ContractEvent[],
): Promise<void> => {
  const createDomainEvent = events[0];
  const { colonyAddress, args } = createDomainEvent;

  if (!colonyAddress || !args) {
    throw new Error(
      'Invalid create domain event: missing colonyAddress or args',
    );
  }

  const { domainId, metadata } = args;

  if (!domainId || !metadata) {
    throw new Error('Invalid create domain event: missing required arguments');
  }

  const actionFields = {
    type: ColonyActionType.CreateDomain,
    domainId: toNumber(domainId),
    metadata,
    initiatorAddress: createDomainEvent.from,
    recipientAddress: colonyAddress,
    amount: '0',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    fromDomainId: toNumber(1),
    toDomainId: toNumber(domainId),
  };

  await writeActionFromEvent(createDomainEvent, colonyAddress, actionFields);
};
