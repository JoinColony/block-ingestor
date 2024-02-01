import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  DeleteVerifiedMemberDocument,
  DeleteVerifiedMemberMutation,
  DeleteVerifiedMemberMutationVariables,
  GetVerifiedMemberDocument,
  GetVerifiedMemberQuery,
  GetVerifiedMemberQueryVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { writeActionFromEvent } from '~utils';
import {
  MetadataDeltaActionType,
  MetadataDeltaOperation,
  RemoveVerifiedMembersOperation,
} from '../types';

export const isRemoveVerifiedMembersOperation = (
  operation: MetadataDeltaOperation,
): operation is RemoveVerifiedMembersOperation => {
  return (
    operation.type === MetadataDeltaActionType.REMOVE_VERIFIED_MEMBERS &&
    operation.payload !== undefined &&
    Array.isArray(operation.payload)
  );
};

export const handleRemoveVerifiedMembers = async (
  event: ContractEvent,
  operation: MetadataDeltaOperation,
): Promise<void> => {
  if (isRemoveVerifiedMembersOperation(operation)) {
    const { contractAddress: colonyAddress } = event;
    const { agent: initiatorAddress } = event.args;

    await Promise.all(
      operation.payload.map(async (userAddress) => {
        const item = await query<
          GetVerifiedMemberQuery,
          GetVerifiedMemberQueryVariables
        >(GetVerifiedMemberDocument, { colonyAddress, userAddress });

        const verifiedMemberData = item?.data?.getVerifiedMember;

        if (verifiedMemberData === null || verifiedMemberData === undefined) {
          throw new Error(
            `User ${userAddress} is not a verified member of the colony ${colonyAddress}`,
          );
        }

        await mutate<
          DeleteVerifiedMemberMutation,
          DeleteVerifiedMemberMutationVariables
        >(DeleteVerifiedMemberDocument, {
          input: { colonyAddress, userAddress },
        });
      }),
    );

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.RemoveVerifiedMembers,
      initiatorAddress,
      members: operation.payload,
    });
  }
};
