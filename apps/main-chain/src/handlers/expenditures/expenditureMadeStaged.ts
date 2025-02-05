import amplifyClient from '~amplifyClient';
import {
  ExpenditureType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { getExpenditureDatabaseId, toNumber } from '~utils';
import { verbose } from '@joincolony/utils';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

export const handleExpenditureMadeStaged: EventHandler = async (
  event,
  listener,
) => {
  const { expenditureId, staged } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const { colonyAddress } = listener as ExtensionEventListener;

  verbose(
    `Expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress} ${
      staged ? 'set' : 'unset'
    } as staged`,
  );

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
      type: ExpenditureType.Staged,
      stagedExpenditureAddress: event.contractAddress,
    },
  });
};
