import { mutate } from '~amplifyClient';
import {
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  UpdateColonyMultiSigMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { verbose } from '~utils';
import { getMultiSigDatabaseId } from './helpers';
import { getChainId } from '~provider';

export const handleMultiSigMotionCancelled: EventHandler = async (event) => {
  const {
    args: { motionId },
    contractAddress: multiSigExtensionAddress,
  } = event;

  const chainId = getChainId();

  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );

  verbose(`MultiSig motion: ${motionId} has been rejected`);

  await mutate<
    UpdateColonyMultiSigInput,
    UpdateColonyMultiSigMutationVariables
  >(UpdateColonyMultiSigDocument, {
    input: {
      id: multiSigDatabaseId,
      hasActionCompleted: false,
      isRejected: true,
    },
  });
};
