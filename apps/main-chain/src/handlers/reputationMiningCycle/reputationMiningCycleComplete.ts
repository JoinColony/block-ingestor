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
        lastCompletedAt: new Date().toISOString(),
      },
    });
  } else {
    await amplifyClient.mutate<
      CreateReputationMiningCycleMetadataMutation,
      CreateReputationMiningCycleMetadataMutationVariables
    >(CreateReputationMiningCycleMetadataDocument, {
      input: {
        id: reputationMiningCycleMetadataId,
        lastCompletedAt: new Date().toISOString(),
      },
    });
  }
};
