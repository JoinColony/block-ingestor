import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import {} from '~utils/stakes';

import { updateExpenditureStake } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { expenditureId, punished } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    `Staker of expenditure with ID ${databaseId} was ${
      !punished ? 'not ' : ''
    }punished`,
  );

  await updateExpenditureStake(databaseId, {
    isForfeited: punished,
  });
};
