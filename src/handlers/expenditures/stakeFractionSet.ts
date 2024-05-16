import { ContractEvent, EventHandler } from '~types';

export const handleStakeFractionSet: EventHandler = async (
  event: ContractEvent,
): Promise<void> => {
  console.log(event.args);
  //   const { colonyAddress, blockNumber } = event;
  //   const { streamingPaymentId } = event.args;
  //   const convertedNativeId = toNumber(streamingPaymentId);
  //   if (!colonyAddress) {
  //     return;
  //   }
  //   const streamingPaymentsClient = await getStreamingPaymentsClient(
  //     colonyAddress,
  //   );
  //   if (!streamingPaymentsClient) {
  //     return;
  //   }
  //   const streamingPayment = await streamingPaymentsClient.getStreamingPayment(
  //     streamingPaymentId,
  //     { blockTag: blockNumber },
  //   );
  //   if (!streamingPayment) {
  //     return;
  //   }
  //   const {
  //     recipient: recipientAddress,
  //     domainId,
  //     startTime,
  //     endTime,
  //     interval,
  //   } = streamingPayment;
  //   const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  //   verbose(`Streaming payment with ID ${databaseId} created`);
  //   await mutate<
  //     CreateStreamingPaymentMutation,
  //     CreateStreamingPaymentMutationVariables
  //   >(CreateStreamingPaymentDocument, {
  //     input: {
  //       id: databaseId,
  //       nativeId: convertedNativeId,
  //       recipientAddress,
  //       nativeDomainId: toNumber(domainId),
  //       startTime: toNumber(startTime),
  //       endTime: toNumber(endTime),
  //       interval: interval.toString(),
  //     },
  //   });
};
