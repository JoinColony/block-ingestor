import { AnyStakedExpenditureClient, Extension } from '@colony/colony-js';

import { getCachedColonyClient } from './colony';

// @TODO: Cache staked expenditure clients
export const getStakedExpenditureClient = async (
  colonyAddress: string,
): Promise<AnyStakedExpenditureClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.StakedExpenditure);
  } catch {
    return null;
  }
};
