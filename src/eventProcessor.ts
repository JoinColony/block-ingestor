import { ContractEvent, ContractEventsSignatures } from './types';
import { output, writeJsonStats } from './utils';
import { coloniesSet } from './trackColonies';

/*
 * Here's where you'll be handling all your custom logic for the various events
 * this ingestors listens for, and which make their way into the Event Queue
 *
 * Here's an example of how to set up your case:
 *
 * case ContractEventsSignatures.<YourEventName>: {
 *   // your custom logic
 *   return;
 * }
 */
export default async (event: ContractEvent): Promise<void> => {
  if (!event.signature) {
    throw new Error('Event does not have a signature. Possibly bad event data. Refusing the process!');
  }
  switch (event.signature) {
    case ContractEventsSignatures.ColonyAdded: {
      const { colonyAddress } = event?.args ?? {};
      coloniesSet.add(colonyAddress);
      await writeJsonStats({ trackedColonies: coloniesSet.size });
      output('Found new Colony:', colonyAddress, 'Total tracked colonies:', coloniesSet.size);
      return;
    }

    default: {
      return;
    };
  }
};
