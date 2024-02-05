import { verbose } from '~utils';
import { MetadataDeltaOperation, MetadataDeltaActionType } from './types';

export const isMetadataDeltaOperation = (
  operation: any,
): operation is MetadataDeltaOperation => {
  return (
    typeof operation === 'object' &&
    operation !== null &&
    operation.type !== undefined &&
    Object.values(MetadataDeltaActionType).includes(operation.type)
  );
};

export const parseOperation = (operationString: string): object | null => {
  const operation = JSON.parse(operationString);

  if (typeof operation !== 'object') {
    verbose('Operation not an object: ', operation);
    return null;
  }

  return operation;
};
