import { mutate, query } from '~amplifyClient';
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
import { ContractEvent } from '~types';
import { reputationMiningCycleMetadataId } from './utils';

export default async (event: ContractEvent): Promise<void> => {
  // The event signature looks like: event ReputationMiningCycleComplete(bytes32 hash, uint256 nLeaves);
  // However, for current purposes (updating colony-wide contributor reputation), we don't care. We just need a timestamp.

  const { data } =
    (await query<
      GetReputationMiningCycleMetadataQuery,
      GetReputationMiningCycleMetadataQueryVariables
    >(GetReputationMiningCycleMetadataDocument, {
      id: reputationMiningCycleMetadataId,
    })) ?? {};

  const dbEntryExists = !!data?.getReputationMiningCycleMetadata;

  if (dbEntryExists) {
    await mutate<
      UpdateReputationMiningCycleMetadataMutation,
      UpdateReputationMiningCycleMetadataMutationVariables
    >(UpdateReputationMiningCycleMetadataDocument, {
      input: {
        id: reputationMiningCycleMetadataId,
        lastCompletedAt: new Date().toISOString(),
      },
    });
  } else {
    await mutate<
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
