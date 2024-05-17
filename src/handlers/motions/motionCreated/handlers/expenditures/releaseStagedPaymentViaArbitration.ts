import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { createMotionInDB } from '../../helpers';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';

export default async (
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { args, colonyAddress } = event;
  const [, , , , expenditureId] = actionArgs;
  const [, , domainId] = args;

  if (!colonyAddress) {
    return;
  }

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: colonyAddress
      ? getDomainDatabaseId(colonyAddress, domainId)
      : undefined,
    gasEstimate: gasEstimate.toString(),
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
  });
};
