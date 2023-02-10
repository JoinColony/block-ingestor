import dotenv from 'dotenv';
import { constants, BigNumber } from 'ethers';

import {
  deleteExtensionFromEvent,
  output,
  toNumber,
  verbose,
  writeExtensionFromEvent,
  writeExtensionVersionFromEvent,
  writeJsonStats,
} from './utils';
import { coloniesSet } from './trackColonies';
import networkClient from './networkClient';
import {
  extensionSpecificEventsListener,
  colonySpecificEventsListener,
} from './eventListener';
import { getChainId } from './provider';
import { query, mutate } from './amplifyClient';
import {
  ContractEventsSignatures,
  ContractEvent,
  ColonyActionType,
} from './types';
import { COLONY_CURRENT_VERSION_KEY } from './constants';
import { getColonyTokenAddress } from './utils/tokens';

dotenv.config();

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
    throw new Error(
      'Event does not have a signature. Possibly bad event data. Refusing the process!',
    );
  }

  const { transactionHash, blockNumber } = event;

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

      output(
        'Found new Colony:',
        colonyAddress,
        'Total tracked colonies:',
        coloniesSet.size,
      );

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
      const { contractAddress, logIndex } = event ?? {};
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
      const isMiningCycleTransfer =
        source === networkClient.address && wad.isZero();

      if (!isMiningCycleTransfer) {
        let existingClaim;
        const amount = wad.toString();
        const claimId = `${chainId}_${transactionHash}_${logIndex}`;
        /*
         * @NOTE That this check is only required for local development where
         * the chain does not mine a new block automatically, so you'll most likely
         * run parsing / events listener on the same block over and over
         * So as to not mess up your data / database, only create the event
         * if it does not exist
         *
         * @TODO an idea of how to reduce queries is to wrap this in a try catch block
         * and just send out the mutation
         * If it succeeds, great, the event is created, if it fails, assume the event
         * already existed in the database
         */

        if (process.env.NODE_ENV !== 'production') {
          const { id: existingClaimId } =
            (await query('getColonyUnclaimedFund', { claimId })) || {};
          existingClaim = existingClaimId;
        }

        output(
          'Found new Transfer of:',
          amount,
          'into Colony:',
          dst,
          existingClaim || amount === '0'
            ? `but not acting upon it since ${
                existingClaim ? 'it already exists in the database' : ''
              }${amount === '0' ? "it's value is zero" : ''}`
            : '',
        );

        // Don't add zero transfer claims in the database
        if (!existingClaim && amount !== '0') {
          await mutate('createColonyFundsClaim', {
            input: {
              id: claimId,
              colonyFundsClaimsId: dst,
              colonyFundsClaimTokenId: contractAddress,
              createdAtBlock: blockNumber,
              amount,
            },
          });
        }
      }
      return;
    }

    /*
     * New Colony transfer claims
     */
    case ContractEventsSignatures.ColonyFundsClaimed: {
      const { contractAddress: colonyAddress } = event ?? {};
      const { token: tokenAddress, payoutRemainder } = event?.args ?? {};

      /*
       * We're not handling native chain token claims from here, so no point
       * in running through the whole logic just to end up with the same result
       */
      if (tokenAddress !== constants.AddressZero) {
        const { items: unclaimedFunds } =
          (await query('getColonyUnclaimedFunds', {
            colonyAddress,
            tokenAddress,
            upToBlock: blockNumber,
          })) || {};
        /*
         * This check is actually required since anybody can make payout claims
         * for any colony, any time, even if there's nothing left to claim
         * (basically do claims for 0)
         */
        const colonyHasUnclaimedFunds = unclaimedFunds?.length;
        output(
          'Found new Transfer Claim for Token:',
          tokenAddress,
          'by Colony:',
          colonyAddress,
          !colonyHasUnclaimedFunds
            ? 'but not acting upon it since all existing non-zero transactions were claimed for this token'
            : '',
        );
        /*
         * Colony needs to exist (this should not happen, but a safety check nontheless)
         * and to have unclaimed transactions for this token
         */
        if (colonyHasUnclaimedFunds) {
          await Promise.all(
            unclaimedFunds.map(
              async ({ id }: { id: string }) =>
                await mutate('deleteColonyFundsClaim', { input: { id } }),
            ),
          );
        }
      } else {
        output(
          'Found new Transfer Claim for Token:',
          tokenAddress,
          'by Colony:',
          colonyAddress,
          "but not acting upon it since it's a chain native token claim, and we're not handling these from here",
        );
      }

      /*
       * Save the event to the database, but only if the claim was greater than zero
       * No point in filling the database with useless data
       */
      if (!payoutRemainder.isZero()) {
        await saveEvent(event);
      }

      return;
    }

    case ContractEventsSignatures.ColonyVersionAdded: {
      const { version } = event.args;
      const convertedVersion = toNumber(version);

      verbose('New colony version:', convertedVersion, 'added to network');

      await mutate('setCurrentVersion', {
        input: {
          key: COLONY_CURRENT_VERSION_KEY,
          version: convertedVersion,
        },
      });

      return;
    }

    case ContractEventsSignatures.ColonyUpgraded: {
      const { contractAddress } = event;
      const { newVersion } = event.args;
      const convertedVersion = toNumber(newVersion);

      verbose(
        'Colony:',
        contractAddress,
        `upgraded to version ${convertedVersion}`,
      );

      await mutate('updateColony', {
        input: {
          id: event.contractAddress,
          version: convertedVersion,
        },
      });

      return;
    }

    case ContractEventsSignatures.ExtensionAddedToNetwork: {
      await writeExtensionVersionFromEvent(event);
      return;
    }

    case ContractEventsSignatures.ExtensionInstalled: {
      const { extensionId: extensionHash, colony } = event.args;
      const extensionAddress = await networkClient.getExtensionInstallation(
        extensionHash,
        colony,
      );

      await writeExtensionFromEvent(event, extensionAddress);
      await extensionSpecificEventsListener(extensionAddress, extensionHash);
      return;
    }

    case ContractEventsSignatures.ExtensionUninstalled: {
      await deleteExtensionFromEvent(event);
      return;
    }

    case ContractEventsSignatures.ExtensionDeprecated: {
      const { extensionId: extensionHash, colony, deprecated } = event.args;

      verbose(
        'Extension:',
        extensionHash,
        deprecated ? 'deprecated' : 're-enabled',
        'in Colony:',
        colony,
      );

      await mutate('updateColonyExtensionByColonyAndHash', {
        input: {
          colonyId: colony,
          hash: extensionHash,
          isDeprecated: deprecated,
        },
      });

      return;
    }

    case ContractEventsSignatures.ExtensionUpgraded: {
      const { extensionId: extensionHash, colony, version } = event.args;
      const convertedVersion = toNumber(version);

      verbose(
        'Extension:',
        extensionHash,
        'upgraded to version',
        convertedVersion,
        'in Colony:',
        colony,
      );

      await mutate('updateColonyExtensionByColonyAndHash', {
        input: {
          colonyId: colony,
          hash: extensionHash,
          version: convertedVersion,
        },
      });

      return;
    }

    case ContractEventsSignatures.ExtensionInitialised: {
      const { contractAddress: extensionAddress } = event;

      verbose('Extension with address:', extensionAddress, 'was enabled');

      await mutate('updateColonyExtensionByAddress', {
        input: {
          id: extensionAddress,
          isInitialized: true,
        },
      });

      return;
    }

    case ContractEventsSignatures.TokensMinted: {
      const { contractAddress: colonyAddress } = event;
      const {
        agent: initiatorAddress,
        who: recipientAddress,
        amount,
      } = event.args;

      const tokenAddress = await getColonyTokenAddress(colonyAddress);

      verbose(
        amount.toString(),
        'tokens were minted in colony:',
        colonyAddress,
      );

      await mutate('createColonyAction', {
        input: {
          id: transactionHash,
          colonyId: colonyAddress,
          type: ColonyActionType.MintTokens,
          initiatorAddress,
          recipientAddress,
          amount: amount.toString(),
          blockNumber,
          tokenAddress,
        },
      });

      return;
    }

    case ContractEventsSignatures.OneTxPaymentMade: {
      const { contractAddress: colonyAddress } = event;
      const [initiatorAddress, fundamentalChainId] = event.args;

      await mutate('createColonyAction', {
        input: {
          id: transactionHash,
          colonyId: colonyAddress,
          type: ColonyActionType.Payment,
          initiatorAddress,
          fundamentalChainId,
        },
      });
      return;
    }

    default: {
      return;
    }
  }
};

export const saveEvent = async (event: ContractEvent): Promise<void> => {
  if (!event.signature) {
    throw new Error(
      'Event does not have a signature. Possibly bad event data. Refusing the save to database!',
    );
  }
  const chainId = getChainId();

  const {
    name,
    signature,
    logIndex,
    transactionHash,
    blockNumber,
    args = {},
    contractAddress,
  } = event;

  /*
   * Parse Args
   */
  const keys = Object.keys(args);
  const parsedArgs: Record<string, string> = {};
  keys.slice(keys.length / 2).map((key) => {
    if (BigNumber.isBigNumber(args[key as keyof typeof args])) {
      parsedArgs[key] = (
        args[key as keyof typeof args] as BigNumber
      ).toString();
    }
    parsedArgs[key] = String(args[key as keyof typeof args]);
    return undefined;
  });

  const contractEvent: {
    id: string;
    agent: string;
    meta: Record<string, string | number>;
    name: string;
    signature: string;
    target: string;
    encodedArguments?: string;
    contractEventTokenId?: string;
    contractEventUserId?: string;
    contractEventDomainId?: string;
    contractEventColonyId?: string;
  } = {
    id: `${chainId}_${transactionHash}_${logIndex}`,
    agent: parsedArgs?.agent || contractAddress,
    meta: {
      chainId,
      transactionHash,
      logIndex,
      blockNumber,
    },
    name,
    signature,
    target: parsedArgs?.dst || contractAddress,
    encodedArguments: JSON.stringify(parsedArgs),
  };

  switch (signature) {
    case ContractEventsSignatures.ColonyFundsClaimed: {
      /*
       * Link to colony and token
       */
      contractEvent.contractEventTokenId = parsedArgs.token;
      contractEvent.contractEventColonyId = contractAddress;
      break;
    }

    default: {
      break;
    }
  }

  /*
   * @NOTE That this check is only required for local development where
   * the chain does not mine a new block automatically, so you'll most likely
   *  run parsing / events listener on the same block over and over
   * So as to not mess up your data / database, only create the event
   * if it does not exist
   *
   * @TODO an idea of how to reduce queries is to wrap this in a try catch block
   * and just send out the mutation
   * If it succeeds, great, the event is created, if it fails, assume the event
   * already existed in the database
   */
  let existingContractEvent;
  if (process.env.NODE_ENV !== 'production') {
    const { id: existingContractEventId } =
      (await query('getContractEvent', {
        id: contractEvent.id,
      })) || {};
    existingContractEvent = existingContractEventId;
  }
  if (!existingContractEvent) {
    await mutate('createContractEvent', { input: contractEvent });
    verbose(
      `Saving event ${contractEvent.signature} to the database for ${contractAddress}`,
    );
  }
};
