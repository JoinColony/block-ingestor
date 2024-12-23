import { verbose } from '@joincolony/utils';
import {
  AddVerifiedMembersOperation,
  RemoveVerifiedMembersOperation,
  MetadataDeltaOperation,
  MetadataDeltaOperationType,
  ManageTokensOperation,
  DisableProxyColonyOperation,
} from './types';

export const isAddVerifiedMembersOperation = (
  operation: MetadataDeltaOperation,
): operation is AddVerifiedMembersOperation => {
  return (
    operation.type === MetadataDeltaOperationType.ADD_VERIFIED_MEMBERS &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload) &&
    operation.payload.every((item) => typeof item === 'string')
  );
};

export const isRemoveVerifiedMembersOperation = (
  operation: MetadataDeltaOperation,
): operation is RemoveVerifiedMembersOperation => {
  return (
    operation.type === MetadataDeltaOperationType.REMOVE_VERIFIED_MEMBERS &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload) &&
    operation.payload.every((item) => typeof item === 'string')
  );
};

export const isManageTokensOperation = (
  operation: MetadataDeltaOperation,
): operation is ManageTokensOperation => {
  return (
    operation.type === MetadataDeltaOperationType.MANAGE_TOKENS &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload) &&
    operation.payload.every((item) => typeof item === 'string')
  );
};

export const isDisableProxyColonyOperation = (
  operation: MetadataDeltaOperation,
): operation is DisableProxyColonyOperation => {
  return (
    operation.type === MetadataDeltaOperationType.DISABLE_PROXY_COLONY &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload) &&
    operation.payload.every((item) => typeof item === 'string')
  );
};

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

export const parseMetadataDeltaOperation = (
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
