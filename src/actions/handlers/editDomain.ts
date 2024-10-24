import { ActionHandler } from '~actions/types';
import { ContractEvent } from '~types';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '~graphql';
import { toNumber } from '~utils';

export const handleEditDomainAction: ActionHandler = async (
  events: ContractEvent[],
): Promise<void> => {
  const editDomainEvent = events[0];
  const { colonyAddress, args } = editDomainEvent;

  if (!colonyAddress || !args) {
    throw new Error('Invalid edit domain event: missing colonyAddress or args');
  }

  const { domainId, metadata } = args;

  if (!domainId || !metadata) {
    throw new Error('Invalid edit domain event: missing required arguments');
  }

  const actionFields = {
    type: ColonyActionType.EditDomain,
    domainId: toNumber(domainId),
    metadata,
    initiatorAddress: editDomainEvent.from,
    recipientAddress: colonyAddress,
    amount: '0',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    fromDomainId: toNumber(domainId),
    toDomainId: toNumber(domainId),
  };

  await writeActionFromEvent(editDomainEvent, colonyAddress, actionFields);
};
