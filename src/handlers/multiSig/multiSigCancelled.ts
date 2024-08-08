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
import { getBlockChainTimestampISODate } from '~utils/dates';

export const handleMultiSigMotionCancelled: EventHandler = async (event) => {
  const {
    args: { motionId, agent: userAddress },
    contractAddress: multiSigExtensionAddress,
    timestamp,
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
      rejectedAt: getBlockChainTimestampISODate(timestamp),
      rejectedBy: userAddress,
    },
  });
};
