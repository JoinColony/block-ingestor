import { ContractEvent } from '~types';
import { verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const {
    colonyAddress,
    args: { motionId, eventIndex },
  } = event;

  if (!colonyAddress) {
    return;
  }

  verbose(`Motion: ${motionId} has advanced from ${eventIndex}`);
};
