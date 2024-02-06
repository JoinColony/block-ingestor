import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { parseOperation } from './utils';
import { MetadataDeltaOperationType } from './types';
import { handleAddVerifiedMembers } from './handlers/addVerifiedMembers';

export default async (event: ContractEvent): Promise<void> => {
  const operationString = event.args.metadata;

  if (!operationString) {
    verbose('Unable to get operation for ColonyMetadataDelta event');
    return;
  }

  const operation = parseOperation(operationString);

  if (operation === null) {
    return;
  }

  switch (operation.type) {
    case MetadataDeltaOperationType.ADD_VERIFIED_MEMBERS:
      await handleAddVerifiedMembers(event, operation);
      break;
  }
};
