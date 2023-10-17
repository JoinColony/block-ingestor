import { Result } from 'ethers/lib/utils';

import { ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';
import { ColonyActionType } from '~graphql';

import { createMotionInDB } from '../../../helpers';

export default async ({
  event,
  args,
  gasEstimate,
}: {
  event: ContractEvent;
  args: Result;
  gasEstimate: string;
}): Promise<void> => {
  console.log(event);
  console.log(args);
  const { colonyAddress } = event;
  const [, , expenditureId, , , keys] = args;
  const [, , domainId] = args;
  const [slotId] = keys;

  if (!colonyAddress) {
    return;
  }

  await createMotionInDB(event, {
    type: ColonyActionType.SetExpenditureStateMotion,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    gasEstimate: gasEstimate.toString(),
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
    expenditureSlotId: toNumber(slotId),
  });
};
