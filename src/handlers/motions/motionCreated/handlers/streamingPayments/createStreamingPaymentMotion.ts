import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { createMotionInDB } from '../../helpers';
import { getDomainDatabaseId } from '~utils';

export default async (
  colonyAddress: string,
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
): Promise<void> => {
  const { args } = event;
  const [, , domainId] = args;

  const [
    ,
    ,
    ,
    ,
    ,
    startTime,
    endTimeOrDuration,
    interval,
    recipient,
    token,
    amount,
  ] = actionArgs;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    pendingStreamingPayment: {
      amount: amount.toString(),
      startTime: startTime.toString(),
      endTime: endTimeOrDuration.toString(),
      interval: interval.toString(),
      recipientAddress: recipient,
      tokenAddress: token,
      nativeDomainId: Number(domainId),
    },
  });
};
