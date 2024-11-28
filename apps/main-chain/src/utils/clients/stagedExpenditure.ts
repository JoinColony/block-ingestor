import { AnyStagedExpenditureClient, Extension } from '@colony/colony-js';

import { getCachedColonyClient } from './colony';

// @TODO: Cache staked expenditure clients
export const getStagedExpenditureClient = async (
  colonyAddress: string,
): Promise<AnyStagedExpenditureClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.StagedExpenditure);
  } catch {
    return null;
  }
};
