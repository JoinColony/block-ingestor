import { ContractEvent } from '~types';
import {
  isAddVerifiedMembersOperation,
  isManageTokensOperation,
  isRemoveVerifiedMembersOperation,
  parseMetadataDeltaOperation,
  verbose,
} from '~utils';
import { handleAddVerifiedMembers } from './handlers/addVerifiedMembers';
import { handleRemoveVerifiedMembers } from './handlers/removeVerifiedMembers';
import { handleManageTokens } from './handlers/manageTokens';

export default async (event: ContractEvent): Promise<void> => {
  const operationString = event.args.metadata;
  const operation = parseMetadataDeltaOperation(operationString);

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

  if (isManageTokensOperation(operation)) {
    await handleManageTokens(event, operation);
    return;
  }

  verbose('Unknown operation type: ', operation);
};
