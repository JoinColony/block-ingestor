import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';

import { createMotionInDB } from '../../helpers';

export default async (
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress, args } = event;
  const [, , expenditureId] = actionArgs;

  const [, , domainId] = args;
  const [, , , slotId] = actionArgs;

  if (!colonyAddress) {
    return;
  }

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    gasEstimate: gasEstimate.toString(),
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
    expenditureSlotId: toNumber(slotId),
  });
};
