import { BigNumber } from 'ethers';

import { ContractEvent, ContractEventsSignatures } from './types';
import { output, writeJsonStats } from './utils';
import { coloniesSet } from './trackColonies';

export default async (event: ContractEvent): Promise<void> => {
  if (!event.signature) {
    throw new Error('Event does not have a name. Possibly bad event data. Aborting!');
  }
  switch (event.signature) {
    case ContractEventsSignatures.ColonyAdded: {
      const { colonyAddress, token } = event?.args ?? {};
      coloniesSet.add(JSON.stringify({
        colonyAddress,
        tokenAddress: token,
        balance: BigNumber.from(0),
        unclaimedBalance: BigNumber.from(0),
      }));
      await writeJsonStats({ trackedColonies: coloniesSet.size });
      output('Found new Colony:', colonyAddress, 'Total colonies:', coloniesSet.size);
      return;
    }

    default: {
      return;
    };
  }
};
