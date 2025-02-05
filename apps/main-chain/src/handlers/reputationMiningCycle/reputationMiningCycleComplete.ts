import amplifyClient from '~amplifyClient';
import {
  CreateReputationMiningCycleMetadataDocument,
  CreateReputationMiningCycleMetadataMutation,
  CreateReputationMiningCycleMetadataMutationVariables,
  GetReputationMiningCycleMetadataDocument,
  GetReputationMiningCycleMetadataQuery,
  GetReputationMiningCycleMetadataQueryVariables,
  UpdateReputationMiningCycleMetadataDocument,
  UpdateReputationMiningCycleMetadataMutation,
  UpdateReputationMiningCycleMetadataMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import { reputationMiningCycleMetadataId } from './utils';

export default async (event: ContractEvent): Promise<void> => {
  // The event signature looks like: event ReputationMiningCycleComplete(bytes32 hash, uint256 nLeaves);
  // However, for current purposes (updating colony-wide contributor reputation), we don't care. We just need a timestamp.

  // If we're running this in production, use the time of the actual
  // mining cycle, which is the block time of when this event was emitted.
  let lastCompletedAt = new Date(event.timestamp * 1000).toISOString();

  // However, due to the time forwarding shennaningans we do when developing locally,
  // This would break the UI badly, so we're forced to use the current time.
  if (process.env.NODE_ENV === 'development') {
    lastCompletedAt = new Date().toISOString();
  }

  // The current time cannot be used in production though, due to the fact that
  // the ingestor might fall out of sync with the blockchain, and when it will attempt
  // to catch up, and will come across this event, it will use an incorrect timestamp
  // for it, basically the time it got to process it, meaning the UI will "lie" at that point

  const { data } =
    (await amplifyClient.query<
      GetReputationMiningCycleMetadataQuery,
      GetReputationMiningCycleMetadataQueryVariables
    >(GetReputationMiningCycleMetadataDocument, {
      id: reputationMiningCycleMetadataId,
    })) ?? {};

  const dbEntryExists = !!data?.getReputationMiningCycleMetadata;

  if (dbEntryExists) {
    await amplifyClient.mutate<
      UpdateReputationMiningCycleMetadataMutation,
      UpdateReputationMiningCycleMetadataMutationVariables
    >(UpdateReputationMiningCycleMetadataDocument, {
      input: {
        id: reputationMiningCycleMetadataId,
        lastCompletedAt,
      },
    });
  } else {
    await amplifyClient.mutate<
      CreateReputationMiningCycleMetadataMutation,
      CreateReputationMiningCycleMetadataMutationVariables
    >(CreateReputationMiningCycleMetadataDocument, {
      input: {
        id: reputationMiningCycleMetadataId,
        lastCompletedAt,
      },
    });
  }
};
