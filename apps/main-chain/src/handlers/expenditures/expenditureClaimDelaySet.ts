import { BigNumber } from 'ethers';
import amplifyClient from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import { getExpenditureDatabaseId, toNumber } from '~utils';

import { getExpenditureFromDB, getUpdatedExpenditureSlots } from './helpers';
import { output, verbose } from '@joincolony/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, claimDelay } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);
  const convertedClaimDelay = BigNumber.from(claimDelay).toString();

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const updatedSlots = getUpdatedExpenditureSlots(
    expenditure.slots,
    convertedSlot,
    {
      claimDelay: convertedClaimDelay,
    },
  );

  verbose(
    `Claim delay set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      slots: updatedSlots,
    },
  });
};
