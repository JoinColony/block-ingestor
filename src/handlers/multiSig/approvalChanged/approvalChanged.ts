import { BigNumber } from 'ethers';
import { MultiSigVote } from '~graphql';
import { ContractEvent } from '~types';
import { getUserMultiSigSignature } from '../helpers';
import { addApprovalVote } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const {
    agent: userAddress,
    motionId,
    role,
    // TODO if approval is false, the vote was removed
    // approval,
  } = event.args;
  const multiSigId = BigNumber.from(motionId).toString();

  const existingVote = await getUserMultiSigSignature({
    multiSigId,
    userAddress,
    vote: MultiSigVote.Approve,
  });

  if (existingVote) {
    return;
  }

  await addApprovalVote({
    multiSigId,
    role,
    userAddress,
  });
};
