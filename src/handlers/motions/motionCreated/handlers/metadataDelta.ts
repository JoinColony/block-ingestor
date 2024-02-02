import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  getPendingMetadataDatabaseId,
  isAddVerifiedMembersOperation,
  isMetadataDeltaOperation,
  parseOperation,
  verbose,
} from '~utils';
import { createMotionInDB } from '../helpers';

export const handleMetadataDeltaMotion = async (
  event: ContractEvent,
  desc: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash, colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  try {
    const operationString = desc.args[0];

    if (!operationString) {
      verbose('Unable to get operation for ColonyMetadataDelta motion event');
      return;
    }

    const operation = parseOperation(operationString);

    if (!isMetadataDeltaOperation(operation)) {
      verbose(
        'Operation does not conform to MetadataDeltaOperation type: ',
        operation,
      );
      return;
    }

    const pendingColonyMetadataId = getPendingMetadataDatabaseId(
      colonyAddress,
      transactionHash,
    );

    if (isAddVerifiedMembersOperation(operation)) {
      await createMotionInDB(event, {
        type: ColonyActionType.AddVerifiedMembersMotion,
        members: operation.members,
        pendingColonyMetadataId,
        gasEstimate: gasEstimate.toString(),
      });
    }
  } catch (error) {
    verbose('Error while handling metadata delta motion created', error);
  }
};
