import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  isAddVerifiedMembersOperation,
  isRemoveVerifiedMembersOperation,
  parseMetadataDeltaOperation,
  verbose,
} from '~utils';
import { createMotionInDB } from '../helpers';

export const handleMetadataDeltaMotion = async (
  event: ContractEvent,
  desc: TransactionDescription,
  gasEstimate: BigNumber,
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
      await createMotionInDB(event, {
        type: ColonyActionType.AddVerifiedMembersMotion,
        members: operation.payload,
        gasEstimate: gasEstimate.toString(),
      });
    }

    if (isRemoveVerifiedMembersOperation(operation)) {
      await createMotionInDB(event, {
        type: ColonyActionType.RemoveVerifiedMembersMotion,
        members: operation.payload,
        gasEstimate: gasEstimate.toString(),
      });
    }
  } catch (error) {
    verbose('Error while handling metadata delta motion created', error);
  }
};
