import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

import { updateExpenditureStake } from './helpers';

export const handleExpenditureStakerPunished: EventHandler = async (
  event,
  listener,
) => {
  const { expenditureId, punished } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const { colonyAddress } = listener as ExtensionEventListener;

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
