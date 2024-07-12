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
  colonyAddress: string,
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { args } = event;
  const [, , streamingPaymentId] = actionArgs;
  const [, , domainId] = args;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    gasEstimate: gasEstimate.toString(),
    streamingPaymentId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(streamingPaymentId),
    ),
  });
};
