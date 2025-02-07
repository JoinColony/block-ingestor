import { ColonyActionType } from '~graphql';
import { toNumber } from 'lodash';
import { BigNumber } from 'ethers';
import { getStreamingPaymentFromDB } from '~handlers/expenditures/helpers';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { MulticallHandler, MulticallValidator } from './types';
import { ContractMethodSignatures } from '~types';
import { getExpenditureDatabaseId, getPendingMetadataDatabaseId } from '~utils';

export const isEditStreamingPaymentMotion: MulticallValidator = ({
  decodedFunctions,
}) => {
  const signaturesToMatch = [
    ContractMethodSignatures.SetTokenAmount,
    ContractMethodSignatures.SetStartTime,
    ContractMethodSignatures.SetEndTime,
  ];

  return signaturesToMatch.includes(
    decodedFunctions[0].signature as ContractMethodSignatures,
  );
};

export const editStreamingPaymentMotionHandler: MulticallHandler = async ({
  colonyAddress,
  event,
  decodedFunctions,
}) => {
  const { transactionHash } = event;

  const streamingPaymentId = decodedFunctions[0]?.args._id;
  const convertedStreamingPaymentId = toNumber(streamingPaymentId);
  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedStreamingPaymentId,
  );

  const streamingPayment = await getStreamingPaymentFromDB(databaseId);
  if (!streamingPayment) {
    return;
  }

  const pendingStreamingPaymentChanges = {
    amount: streamingPayment.amount,
    interval: streamingPayment.interval,
    startTime: streamingPayment.startTime,
    endTime: streamingPayment.endTime,
  };

  for (const decodedFunction of decodedFunctions) {
    const decodedFunctionStreamingPaymentId = decodedFunction.args._id;
    if (
      !BigNumber.from(decodedFunctionStreamingPaymentId).eq(streamingPaymentId)
    ) {
      continue;
    }

    if (decodedFunction.signature === ContractMethodSignatures.SetTokenAmount) {
      const amount = decodedFunction.args[7];
      const interval = decodedFunction.args[8];

      pendingStreamingPaymentChanges.amount = amount.toString();
      pendingStreamingPaymentChanges.interval = interval.toString();
    } else if (
      decodedFunction.signature === ContractMethodSignatures.SetStartTime
    ) {
      const [, , , startTime] = decodedFunction.args;

      pendingStreamingPaymentChanges.startTime = startTime.toString();
    } else if (
      decodedFunction.signature === ContractMethodSignatures.SetEndTime
    ) {
      const [, , , endTime] = decodedFunction.args;

      pendingStreamingPaymentChanges.endTime = endTime.toString();
    }
  }

  const pendingStreamingPaymentMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  createMotionInDB(colonyAddress, event, {
    type: ColonyActionType.EditStreamingPaymentMotion,
    streamingPaymentId: streamingPayment.id,
    pendingStreamingPaymentMetadataId,
    pendingStreamingPaymentChanges,
  });
};
