import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

import { updateExpenditureStake } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    `Stake reclaimed for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  await updateExpenditureStake(databaseId, {
    isClaimed: true,
  });
};
