import { Result } from 'ethers/lib/utils';
import { ColonyActionType } from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';

import { type ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';

export default async ({
  event,
  args,
  gasEstimate,
}: {
  event: ContractEvent;
  args: Result;
  gasEstimate: string;
}): Promise<void> => {
  const { colonyAddress } = event;
  const [, , expenditureId, , , keys] = args;
  const [, , domainId] = event.args;
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
