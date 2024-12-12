import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

import { updateExpenditureStake } from './helpers';

export const handleStakeReclaimed: EventHandler = async (event, listener) => {
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const { colonyAddress } = listener as ExtensionEventListener;

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
