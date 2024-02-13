import { utils } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  DeleteVerifiedMemberDocument,
  DeleteVerifiedMemberMutation,
  DeleteVerifiedMemberMutationVariables,
  GetVerifiedMemberDocument,
  GetVerifiedMemberQuery,
  GetVerifiedMemberQueryVariables,
  UpdateColonyContributorDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { RemoveVerifiedMembersOperation, writeActionFromEvent } from '~utils';

import { getColonyContributorId } from '~utils/contributors';

export const handleRemoveVerifiedMembers = async (
  event: ContractEvent,
  operation: RemoveVerifiedMembersOperation,
): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  await Promise.allSettled(
    operation.payload.map(async (address) => {
      let userAddress;
      try {
        userAddress = utils.getAddress(address);
      } catch (error) {
        // Bail if it's not an address
        return;
      }

      const item = await query<
        GetVerifiedMemberQuery,
        GetVerifiedMemberQueryVariables
      >(GetVerifiedMemberDocument, { colonyAddress, userAddress });

      const verifiedMemberData = item?.data?.getVerifiedMember;

      // If user is already unverified, don't unverify them again
      if (verifiedMemberData === null || verifiedMemberData === undefined) {
        return;
      }

      await mutate<
        DeleteVerifiedMemberMutation,
        DeleteVerifiedMemberMutationVariables
      >(DeleteVerifiedMemberDocument, {
        input: { colonyAddress, userAddress },
      });

      await mutate<
        UpdateColonyContributorMutation,
        UpdateColonyContributorMutationVariables
      >(UpdateColonyContributorDocument, {
        input: {
          id: getColonyContributorId(colonyAddress, userAddress),
          isVerified: false,
        },
      });
    }),
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.RemoveVerifiedMembers,
    initiatorAddress,
    members: operation.payload,
  });
};
