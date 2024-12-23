import { ContractEvent } from '@joincolony/blocks';
import {
  isAddVerifiedMembersOperation,
  isDisableProxyColonyOperation,
  isManageTokensOperation,
  isRemoveVerifiedMembersOperation,
  parseMetadataDeltaOperation,
} from '~utils';
import { handleAddVerifiedMembers } from './handlers/addVerifiedMembers';
import { handleRemoveVerifiedMembers } from './handlers/removeVerifiedMembers';
import { handleManageTokens } from './handlers/manageTokens';
import { verbose } from '@joincolony/utils';
import { handleDisableProxyColony } from './handlers/disableProxyColony';

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

  if (isDisableProxyColonyOperation(operation)) {
    await handleDisableProxyColony(event, operation);
  }

  verbose('Unknown operation type: ', operation);
};
