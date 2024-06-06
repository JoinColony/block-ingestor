import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';

import { getStreamingPaymentFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  console.log(event);
  const { colonyAddress } = event;
  const { streamingPaymentId, token: tokenAddress, amount } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  const streamingPayment = await getStreamingPaymentFromDB(databaseId);

  if (!streamingPayment) {
    output(`Streaming payment with ID ${databaseId} not found in the database`);
    return;
  }

  verbose(`Payment token updated for streaming payment with ID ${databaseId}`);

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      tokenAddress,
      amount: amount.toString(),
    },
  });
};
