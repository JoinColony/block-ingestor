import { Id } from '@colony/colony-js';
import { utils } from 'ethers';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyContributorDocument,
  GetColonyContributorQuery,
  GetColonyContributorQueryVariables,
  UpdateColonyContributorDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import { NotificationCategory } from '~types/notifications';
import {
  getDomainDatabaseId,
  RemoveVerifiedMembersOperation,
  writeActionFromEvent,
} from '~utils';

import { getColonyContributorId } from '~utils/contributors';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export const handleRemoveVerifiedMembers = async (
  event: ContractEvent,
  operation: RemoveVerifiedMembersOperation,
): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
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

      const item = await amplifyClient.query<
        GetColonyContributorQuery,
        GetColonyContributorQueryVariables
      >(GetColonyContributorDocument, {
        id: getColonyContributorId(colonyAddress, userAddress),
      });

      // If user is already unverified, don't unverify them again
      if (!item?.data?.getColonyContributor?.isVerified) {
        return;
      }

      await amplifyClient.mutate<
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
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });

  sendPermissionsActionNotifications({
    mentions: operation.payload,
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
