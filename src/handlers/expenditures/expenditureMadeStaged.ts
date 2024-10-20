import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  ExpenditureType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

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

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        type: ExpenditureType.Staged,
        stagedExpenditureAddress: event.contractAddress,
      },
    },
  );
};
