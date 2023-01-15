import { BigNumber, constants } from 'ethers';

import networkClient from '../networkClient';
import { mutate } from '../amplifyClient';
import { ContractEvent } from '../types';

export const writeExtensionFromEvent = async (
  event: ContractEvent,
  extensionAddress: string,
): Promise<void> => {
  const { transactionHash, timestamp } = event;
  const { extensionId, colony, version } = event.args;
  const convertedVersion = BigNumber.from(version).toNumber();

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );
  const installedBy = receipt.from || constants.AddressZero;

  await mutate('createColonyExtension', {
    input: {
      id: extensionAddress,
      colonyId: colony,
      hash: extensionId,
      version: convertedVersion,
      installedBy,
      installedAt: timestamp,
      isDeprecated: false,
      isDeleted: false,
      isInitialized: false,
    },
  });
};
