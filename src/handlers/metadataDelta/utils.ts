import { verbose } from '~utils';
import {
  AddVerifiedMembersOperation,
  Entity,
  OperationType,
  MetadataDeltaOperation,
} from './types';

export const isAddVerifiedMembersOperation = (
  operation: MetadataDeltaOperation,
): operation is AddVerifiedMembersOperation => {
  return (
    operation.entity === Entity.VERIFIED_MEMBERS &&
    operation.type === OperationType.ADD
  );
};

export const isMetadataDeltaOperation = (
  operation: any,
): operation is MetadataDeltaOperation => {
  return (
    typeof operation === 'object' &&
    operation !== null &&
    operation.type !== undefined &&
    operation.entity !== undefined &&
    operation.colonyAddress !== undefined &&
    typeof operation.colonyAddress === 'string' &&
    operation.members !== undefined &&
    Array.isArray(operation.members)
  );
};

export const parseOperation = (operationString: string): object => {
  const operation = JSON.parse(operationString);

  if (typeof operation !== 'object') {
    verbose('Operation not an object: ', operation);
    throw new Error('Operation not an object');
  }

  return operation;
};
