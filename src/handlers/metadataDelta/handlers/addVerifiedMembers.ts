import { utils } from 'ethers';
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
import { AddVerifiedMembersOperation, writeActionFromEvent } from '~utils';

export const handleAddVerifiedMembers = async (
  event: ContractEvent,
  operation: AddVerifiedMembersOperation,
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

      // If user is already verified, don't verify them again
      if (verifiedMemberData !== undefined && verifiedMemberData !== null) {
        return;
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
};
