import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { createMotionInDB } from '../../helpers';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';

export default async (
  colonyAddress: string,
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
): Promise<void> => {
  const { args } = event;
  const [, , , , expenditureId, slotId] = actionArgs;
  const [, , domainId] = args;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: colonyAddress
      ? getDomainDatabaseId(colonyAddress, domainId)
      : undefined,
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
    expenditureSlotIds: [toNumber(slotId)],
  });
};
