import { TransactionDescription } from 'ethers/lib/utils';
import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  isAddVerifiedMembersOperation,
  isRemoveVerifiedMembersOperation,
  parseMetadataDeltaOperation,
  verbose,
} from '~utils';
import { createMultiSigInDB } from '../helpers';

export const handleMetadataDeltaMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  desc: TransactionDescription,
): Promise<void> => {
  try {
    const operationString = desc.args[0];

    if (!operationString) {
      verbose('Unable to get operation for ColonyMetadataDelta motion event');
      return;
    }

    const operation = parseMetadataDeltaOperation(operationString);

    if (operation === null) {
      return;
    }

    if (isAddVerifiedMembersOperation(operation)) {
      await createMultiSigInDB(colonyAddress, event, {
        type: ColonyActionType.AddVerifiedMembersMultisig,
        members: operation.payload,
      });
    }

    if (isRemoveVerifiedMembersOperation(operation)) {
      await createMultiSigInDB(colonyAddress, event, {
        type: ColonyActionType.RemoveVerifiedMembersMultisig,
        members: operation.payload,
      });
    }
  } catch (error) {
    verbose('Error while handling metadata delta motion created', error);
  }
};
