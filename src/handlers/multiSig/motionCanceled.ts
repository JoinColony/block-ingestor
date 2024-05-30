import { mutate } from '~amplifyClient';
import {
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  UpdateColonyMultiSigMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getMultiSigClient } from '~utils';
import { getMultiSigDatabaseId } from './helpers';
import { getChainId } from '~provider';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args: { motionId },
    colonyAddress,
  } = event;

  if (!colonyAddress) {
    return;
  }

  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!multiSigClient) {
    return;
  }

  const chainId = getChainId();

  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigClient.address,
    motionId,
  );

  await mutate<
    UpdateColonyMultiSigInput,
    UpdateColonyMultiSigMutationVariables
  >(UpdateColonyMultiSigDocument, {
    input: {
      id: multiSigDatabaseId,
      isRejected: true,
    },
  });
};
