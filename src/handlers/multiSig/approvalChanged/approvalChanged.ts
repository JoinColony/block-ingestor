import { MultiSigVote } from '~graphql';
import { getChainId } from '~provider';
import { ContractEvent } from '~types';
import { getMultiSigClient } from '~utils/clients';
import { getMultiSigDatabaseId, getUserMultiSigSignature } from '../helpers';
import { addApprovalVote, removeMultiSigVote } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!multiSigClient) {
    return;
  }

  const chainId = getChainId();
  const { agent: userAddress, motionId, role, approval } = event.args;

  const multiSigId = getMultiSigDatabaseId(
    chainId,
    multiSigClient.address,
    motionId,
  );

  const existingVote = await getUserMultiSigSignature({
    multiSigId,
    userAddress,
    vote: MultiSigVote.Approve,
  });

  if (!approval) {
    if (existingVote) {
      await removeMultiSigVote(existingVote?.id);
    }
  } else {
    if (!existingVote) {
      await addApprovalVote({
        multiSigId,
        role,
        userAddress,
        colonyAddress,
      });
    }
  }
};
