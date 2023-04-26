import { BigNumber } from 'ethers';

import { MotionMessage, MotionEvents } from '~types';

interface Props {
  messages: MotionMessage[];
  messageKey: string;
  voter: string;
  votes: [BigNumber, BigNumber];
}

export const getUpdatedMessages = ({
  messages,
  messageKey,
  voter,
  votes: [nayVotes, yayVotes],
}: Props): MotionMessage[] => {
  const updatedMessages = [
    ...messages,
  ];

  if (nayVotes.gte(yayVotes)) {
    updatedMessages.push({
      name: MotionEvents.MotionRevealResultObjectionWon,
      messageKey: `${messageKey}_${MotionEvents.MotionRevealResultObjectionWon}`,
      initiatorAddress: voter,
    });
    updatedMessages.push({
      name: MotionEvents.MotionHasFailedFinalizable,
      messageKey: `${messageKey}_${MotionEvents.MotionHasFailedFinalizable}`,
      initiatorAddress: voter,
    });
  } else {
    updatedMessages.push({
      name: MotionEvents.MotionRevealResultMotionWon,
      messageKey: `${messageKey}_${MotionEvents.MotionRevealResultMotionWon}`,
      initiatorAddress: voter,
    });
  }

  return updatedMessages;
};
