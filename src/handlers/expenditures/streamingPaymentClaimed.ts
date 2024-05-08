import { mutate } from '~amplifyClient';
import {
  StreamingPaymentClaim,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber } from '~utils';
import { getStreamingPaymentFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, timestamp } = event;
  const { amount, streamingPaymentId, token: tokenAddress } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);

  const streamingPayment = await getStreamingPaymentFromDB(databaseId);
  if (!streamingPayment) {
    output(
      `Could not find streaming payment with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const newClaim: StreamingPaymentClaim = {
    amount: amount.toString(),
    tokenAddress,
    timestamp,
  };
  const claims: StreamingPaymentClaim[] = streamingPayment.claims
    ? [...streamingPayment.claims, newClaim]
    : [newClaim];

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      claims,
    },
  });
};
