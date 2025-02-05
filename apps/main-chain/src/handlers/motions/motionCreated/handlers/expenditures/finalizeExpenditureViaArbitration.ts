import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { createMotionInDB } from '../../helpers';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';
import { ContractEvent } from '@joincolony/blocks';

export default async (
  colonyAddress: string,
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
): Promise<void> => {
  const { args } = event;
  const [, , expenditureId] = actionArgs;
  const [, , domainId] = args;

  if (!colonyAddress) {
    return;
  }

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: colonyAddress
      ? getDomainDatabaseId(colonyAddress, domainId)
      : undefined,
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
  });
};
