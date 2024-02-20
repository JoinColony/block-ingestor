import { utils } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyContributorDocument,
  GetColonyContributorQuery,
  GetColonyContributorQueryVariables,
  UpdateColonyContributorDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { AddVerifiedMembersOperation, writeActionFromEvent } from '~utils';

import { getColonyContributorId } from '~utils/contributors';

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
        GetColonyContributorQuery,
        GetColonyContributorQueryVariables
      >(GetColonyContributorDocument, {
        id: getColonyContributorId(colonyAddress, userAddress),
      });

      // If user is already verified, don't verify them again
      if (item?.data?.getColonyContributor?.isVerified) {
        return;
      }

      await mutate<
        UpdateColonyContributorMutation,
        UpdateColonyContributorMutationVariables
      >(UpdateColonyContributorDocument, {
        input: {
          id: getColonyContributorId(colonyAddress, userAddress),
          isVerified: true,
        },
      });
    }),
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddVerifiedMembers,
    initiatorAddress,
    members: operation.payload,
  });
};
