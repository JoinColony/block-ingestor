import { verbose } from '~utils';
import { MetadataDeltaOperation, MetadataDeltaOperationType } from './types';

const isMetadataDeltaOperation = (
  operation: any,
): operation is MetadataDeltaOperation => {
  return (
    typeof operation === 'object' &&
    operation !== null &&
    operation.type !== undefined &&
    Object.values(MetadataDeltaOperationType).includes(operation.type)
  );
};

export const parseOperation = (
  operationString: string,
): MetadataDeltaOperation | null => {
  try {
    const operation = JSON.parse(operationString);

    if (typeof operation !== 'object') {
      verbose('Operation not an object: ', operation);
      return null;
    }

    if (!isMetadataDeltaOperation(operation)) {
      verbose(
        'Operation does not conform to MetadataDeltaOperation type: ',
        operation,
      );
      return null;
    }

    return operation;
  } catch (error) {
    verbose(`String: ${operationString} cannot be parsed`, error);
    return null;
  }
};
