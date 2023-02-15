import dotenv from 'dotenv';

import {
  deleteExtensionFromEvent,
  toNumber,
  verbose,
  writeExtensionFromEvent,
  writeExtensionVersionFromEvent,
} from './utils';
import networkClient from './networkClient';
import { extensionSpecificEventsListener } from './eventListener';
import { mutate } from './amplifyClient';
import { ContractEventsSignatures, ContractEvent } from './types';
import {
  handleColonyAdded,
  handleColonyFundsClaimed,
  handleColonyUpgraded,
  handleColonyVersionAdded,
  handleTransfer,
  handleMintTokensAction,
  handlePaymentAction,
} from './handlers';

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

  switch (event.signature) {
    /*
     * New Colony Added
     */
    case ContractEventsSignatures.ColonyAdded: {
      await handleColonyAdded(event);
      return;
    }

    /*
     * New ERC-20 transfers
     * (but not Native Chain Token -- 0x0000...0000)
     */
    case ContractEventsSignatures.Transfer: {
      await handleTransfer(event);
      return;
    }

    /*
     * New Colony transfer claims
     */
    case ContractEventsSignatures.ColonyFundsClaimed: {
      await handleColonyFundsClaimed(event);
      return;
    }

    /**
     * New Colony version added to network
     */
    case ContractEventsSignatures.ColonyVersionAdded: {
      await handleColonyVersionAdded(event);
      return;
    }

    case ContractEventsSignatures.ColonyUpgraded: {
      await handleColonyUpgraded(event);
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
      await handleMintTokensAction(event);
      return;
    }

    case ContractEventsSignatures.PaymentAdded: {
      await handlePaymentAction(event);
      return;
    }

    default: {
      return;
    }
  }
};
