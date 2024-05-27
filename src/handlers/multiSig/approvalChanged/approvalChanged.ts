import { BigNumber } from 'ethers';
import { MultiSigVote } from '~graphql';
import { ContractEvent } from '~types';
import { getUserMultiSigSignature } from '../helpers';
import { addApprovalVote, removeMultiSigVote } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { agent: userAddress, motionId, role, approval } = event.args;
  const multiSigId = BigNumber.from(motionId).toString();

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
      });
    }
  }
};
