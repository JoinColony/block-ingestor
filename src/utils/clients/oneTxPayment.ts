import { AnyOneTxPaymentClient, Extension } from '@colony/colony-js';
import { getCachedColonyClient } from './colony';

// @TODO: Cache OneTxPayment clients
export const getOneTxPaymentClient = async (
  colonyAddress: string,
): Promise<AnyOneTxPaymentClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.OneTxPayment);
  } catch {
    // `getExtensionClient` will throw an error if OneTxPayment is not installed, hence the try/catch block
    return null;
  }
};
