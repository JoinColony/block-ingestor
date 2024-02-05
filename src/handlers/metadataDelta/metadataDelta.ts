import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { isMetadataDeltaOperation, parseOperation } from './utils';
import { MetadataDeltaActionType } from './types';
import { handleAddVerifiedMembers } from './handlers/addVerifiedMembers';

export default async (event: ContractEvent): Promise<void> => {
  const operationString = event.args[1];

  if (!operationString) {
    verbose('Unable to get operation for ColonyMetadataDelta event');
  }

  const operation = parseOperation(operationString);

  if (operation === null || !isMetadataDeltaOperation(operation)) {
    verbose(
      'Operation does not conform to MetadataDeltaOperation type: ',
      operation,
    );
    return;
  }

  switch (operation.type) {
    case MetadataDeltaActionType.ADD_VERIFIED_MEMBERS:
      await handleAddVerifiedMembers(event, operation);
      break;
  }
};
