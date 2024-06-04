import { Id } from '@colony/colony-js';
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
import {
  AddVerifiedMembersOperation,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';

import {
  createColonyContributor,
  getColonyContributorId,
} from '~utils/contributors';

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

      // If a wallet address is not currently a member of a Colony,
      // add the entity as a new Colony contributor
      if (item?.data?.getColonyContributor === null) {
        await createColonyContributor({
          colonyAddress,
          contributorAddress: userAddress,
          hasPermissions: false,
          isVerified: true,
          colonyReputationPercentage: 0,
        });

        return;
      }

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
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
