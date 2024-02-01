import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  CreateVerifiedMemberDocument,
  CreateVerifiedMemberMutation,
  CreateVerifiedMemberMutationVariables,
  GetVerifiedMemberDocument,
  GetVerifiedMemberQuery,
  GetVerifiedMemberQueryVariables,
} from '~graphql';
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
  _desc: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash, colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }
  const operationString = event.args[0];

  if (!operationString) {
    verbose('Unable to get operation for ColonyMetadataDelta motion event');
  }

  const operation = parseOperation(operationString);

  if (!isMetadataDeltaOperation(operation)) {
    verbose(
      'Operation does not conform to MetadataDeltaOperation type: ',
      operation,
    );
    throw new Error('Unknown operation format');
  }

  const pendingColonyMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  if (isAddVerifiedMembersOperation(operation)) {
    await Promise.all(
      operation.members.map(async (userAddress) => {
        const item = await query<
          GetVerifiedMemberQuery,
          GetVerifiedMemberQueryVariables
        >(GetVerifiedMemberDocument, { colonyAddress, userAddress });

        const verifiedMemberData = item?.data?.getVerifiedMember;

        if (verifiedMemberData !== undefined && verifiedMemberData !== null) {
          throw new Error(
            `User ${userAddress} already a verified member of the colony ${colonyAddress}`,
          );
        }

        await mutate<
          CreateVerifiedMemberMutation,
          CreateVerifiedMemberMutationVariables
        >(CreateVerifiedMemberDocument, {
          input: { colonyAddress, userAddress },
        });
      }),
    );

    await createMotionInDB(event, {
      type: ColonyActionType.AddVerifiedMembersMotion,
      members: operation.members,
      pendingColonyMetadataId,
      gasEstimate: gasEstimate.toString(),
    });
  }
};
