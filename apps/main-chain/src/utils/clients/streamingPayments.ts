import { AnyStreamingPaymentsClient, Extension } from '@colony/colony-js';

import { getCachedColonyClient } from './colony';

// @TODO: Cache streaming payments clients
export const getStreamingPaymentsClient = async (
  colonyAddress: string,
): Promise<AnyStreamingPaymentsClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.StreamingPayments);
  } catch {
    return null;
  }
};
