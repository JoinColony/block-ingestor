import networkClient from '~networkClient';

/**
 * Function accepting a contract address and returning true if it belongs to a colony
 * It calls the `isColony` function on the network client
 */
export const isColonyAddress = async (address: string): Promise<boolean> => {
  return await networkClient.isColony(address);
};
