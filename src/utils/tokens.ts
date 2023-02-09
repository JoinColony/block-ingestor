import networkClient from '../networkClient';

export const getColonyTokenAddress = async (
  colonyAddress: string,
): Promise<string> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();
  return tokenAddress;
};
