import { ClientType } from '@colony/colony-js';

import ctx, { ListenerRemover } from '~context';

import { ContractEventsSignatures } from '../types';
import { generateListenerRemoverKey } from './events';

const getMotionListenerRemovers = (
  colonyAddress: string,
): ListenerRemover[] => {
  const listenerRemovers: ListenerRemover[] = [];

  const motionSignatures = Object.values(ContractEventsSignatures).filter(
    (sig) => sig.includes('Motion'),
  );

  motionSignatures.forEach((signature) => {
    const key = generateListenerRemoverKey(
      colonyAddress,
      ClientType.VotingReputationClient,
      signature,
    );
    const motionListenerRemover = ctx.listenerRemovers[key];
    if (motionListenerRemover) {
      listenerRemovers.push(motionListenerRemover);
    }
  });

  return listenerRemovers;
};

export const removeMotionListeners = (colonyAddress: string): void => {
  const listenerRemovers = getMotionListenerRemovers(colonyAddress);
  listenerRemovers.forEach((listenerRemover) => {
    listenerRemover();
  });
};
