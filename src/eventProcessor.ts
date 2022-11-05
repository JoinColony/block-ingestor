import { output, writeJsonStats, setToJS, verbose } from './utils';
import { coloniesSet } from './trackColonies';
import networkClient from './networkClient';
import { ContractEventsSignatures, ContractEvent } from './types';

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
      const { colonyAddress, token: tokenAddress } = event?.args ?? {};

      coloniesSet.add(JSON.stringify({ colonyAddress, tokenAddress }));
      await writeJsonStats({ trackedColonies: coloniesSet.size });

      output('Found new Colony:', colonyAddress, 'Total tracked colonies:', coloniesSet.size);
      return;
    }
    case ContractEventsSignatures.Transfer: {
      const { contractAddress, transactionHash, logIndex } = event ?? {};
      const [source, dst, wad] = event?.args ?? {};

      const isMiningCycleTransfer = source === networkClient.address && wad.isZero();
      const destinationIsTrackedColony = setToJS(coloniesSet).find(
        ({ colonyAddress }) => colonyAddress === dst,
      );

      if (destinationIsTrackedColony && !isMiningCycleTransfer) {
        const amount = wad.toString();
        output('Found new Transfer of:', amount, 'into Colony:', dst);
        /*
         * @TODO Wire up GraphQL mutation once available
         */
        verbose({
          id: `${transactionHash}_${logIndex}`,
          colonyId: dst,
          tokenId: contractAddress,
          args: {
            source,
            amount,
          },
        });
      }
      return;
    }

    default: {
      return;
    };
  }
};
