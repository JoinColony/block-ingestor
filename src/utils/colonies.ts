import { BigNumber } from 'ethers';
import { mutate } from '../amplifyClient';
import networkClient from '../networkClient';
import { ContractEvent } from '../types';

export const writeColonyFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const { colonyAddress, token: tokenAddress } = event.args;

  const ensName = await networkClient.lookupRegisteredENSDomain(colonyAddress);
  const colonyName = ensName;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const version = await colonyClient.version();
  const convertedVersion = BigNumber.from(version).toNumber();

  await mutate('createUniqueColony', {
    input: {
      id: colonyAddress,
      name: colonyName,
      colonyNativeTokenId: tokenAddress,
      version: convertedVersion,
    },
  });
};
