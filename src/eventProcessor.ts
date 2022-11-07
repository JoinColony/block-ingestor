import { output, writeJsonStats, setToJS, verbose } from './utils';
import { coloniesSet } from './trackColonies';
import networkClient from './networkClient';
import { colonySpecificEventsListener } from './eventListener';
import { getChainId } from './provider';
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
    /*
     * New Colony Added
     */
    case ContractEventsSignatures.ColonyAdded: {
      const { colonyAddress, token: tokenAddress } = event?.args ?? {};

      /*
       * Add it to the Set
       */
      coloniesSet.add(JSON.stringify({ colonyAddress, tokenAddress }));
      await writeJsonStats({ trackedColonies: coloniesSet.size });

      output('Found new Colony:', colonyAddress, 'Total tracked colonies:', coloniesSet.size);

      /*
       * Setup all Colony specific listeners for it
       */
      await colonySpecificEventsListener(colonyAddress);
      return;
    }

    /*
     * New ERC-20 transfers
     * (but not Native Chain Token -- 0x0000...0000)
     */
    case ContractEventsSignatures.Transfer: {
      const { contractAddress, transactionHash, logIndex, blockNumber } = event ?? {};
      const chainId = getChainId();
      /*
       * @NOTE Take the values from the "array" rather than from the named properties
       * This is because our native tokens differ in abi from ERC20 or SAI tokens
       *
       * Here's the mapping:
       *
       * Ours   ERC20
       * ---    ---
       * src    from
       * dest   to
       * wad    value
       *
       * But if we take the values from the array, they will always be in the
       * same order: 0->from, 1->to, 2->value
       *
       * This way we can always be sure that get the correct values for the various
       * tokens all the time
       */
      const [source, dst, wad] = event?.args ?? {};

      /*
       * Determine if this transfer was generated by the reputation mining cycle
       * If that's the case, we need to filter it out.
       */
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
          id: `${chainId}_${transactionHash}_${logIndex}`,
          colonyId: dst,
          tokenId: contractAddress,
          createdAtBlock: blockNumber,
          args: {
            source,
            amount,
          },
          status: {
            claimed: false,
          },
        });
      }
      return;
    }

    /*
     * New Colony transfer claims
     */
    case ContractEventsSignatures.ColonyFundsClaimed: {
      const { contractAddress } = event ?? {};
      const { token: tokenAddress } = event?.args ?? {};

      output('Found new Transfer Claim for Token:', tokenAddress, 'by Colony:', contractAddress);
      /*
       * @TODO Wire up GraphQL mutation once available
       *
       * This needs to find all transfer entries that are unclaimed in the database,
       * which were created before this claim
       */
      verbose({
        colonyId: contractAddress,
        tokenId: tokenAddress,
        status: {
          claimed: true,
        },
      });
      return;
    }

    default: {
      return;
    };
  }
};
