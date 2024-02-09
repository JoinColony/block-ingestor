import { ContractEvent } from '~types';
import { verbose } from '~utils';
import {
  isAddVerifiedMembersOperation,
  isRemoveVerifiedMembersOperation,
  parseOperation,
} from './utils';
import { handleAddVerifiedMembers } from './handlers/addVerifiedMembers';
import { handleRemoveVerifiedMembers } from './handlers/removeVerifiedMembers';

export default async (event: ContractEvent): Promise<void> => {
  const operationString = event.args.metadata;
  const operation = parseOperation(operationString);

  if (operation === null) {
    return;
  }

  if (isAddVerifiedMembersOperation(operation)) {
    await handleAddVerifiedMembers(event, operation);
    return;
  }

  if (isRemoveVerifiedMembersOperation(operation)) {
    await handleRemoveVerifiedMembers(event, operation);
    return;
  }

  verbose('Unknown operation type: ', operation);
};
