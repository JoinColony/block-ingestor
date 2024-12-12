import { getExpenditureDatabaseId, toNumber } from '~utils';

import { updateExpenditureStake } from './helpers';
import { verbose } from '@joincolony/utils';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

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
