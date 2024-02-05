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
import { writeActionFromEvent } from '~utils';
import {
  AddVerifiedMembersOperation,
  MetadataDeltaActionType,
  MetadataDeltaOperation,
} from '../types';

const isAddVerifiedMembersOperation = (
  operation: MetadataDeltaOperation,
): operation is AddVerifiedMembersOperation => {
  return (
    operation.type === MetadataDeltaActionType.ADD_VERIFIED_MEMBERS &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload)
  );
};

export const handleAddVerifiedMembers = async (
  event: ContractEvent,
  operation: MetadataDeltaOperation,
): Promise<void> => {
  if (isAddVerifiedMembersOperation(operation)) {
    const { contractAddress: colonyAddress } = event;
    const { agent: initiatorAddress } = event.args;

    await Promise.all(
      operation.payload.map(async (userAddress) => {
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

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.AddVerifiedMembers,
      initiatorAddress,
      members: operation.payload,
    });
  }
};
