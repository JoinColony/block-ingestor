import dotenv from 'dotenv';

import { ContractEventsSignatures, ContractEvent } from './types';
import {
  handleColonyAdded,
  handleColonyFundsClaimed,
  handleColonyVersionAdded,
  handleTransfer,
  handleMintTokensAction,
  handlePaymentAction,
  handleExtensionInstalled,
  handleExtensionAddedToNetwork,
  handleExtensionUninstalled,
  handleExtensionDeprecated,
  handleExtensionUpgraded,
  handleExtensionInitialised,
  handleCreateDomainAction,
  handleTokenUnlockedAction,
  handleMoveFundsAction,
  handleEditDomainAction,
  handleEditColonyAction,
  handleVersionUpgradeAction,
  handleEmitDomainReputationAction,
  handleNetworkFeeInverseSet,
  handleManagePermissionsAction,
  handleMotionCreated,
  handleMotionStaked,
  handleMotionFinalized,
  handleMotionRewardClaimed,
  handleMotionVoteSubmitted,
  handleMotionVoteRevealed,
  handleExpenditureAdded,
  handleExpenditureRecipientSet,
  handleExpenditurePayoutSet,
  handleExpenditureLocked,
  handleExpenditureCancelled,
  handleExpenditureFinalized,
  handleExpenditureTransferred,
  handleExpenditureGlobalClaimDelaySet,
  handleExpenditureClaimDelaySet,
  handleExpenditurePayoutModifierSet,
  handleExpenditurePayoutClaimed,
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

    case ContractEventsSignatures.NetworkFeeInverseSet: {
      await handleNetworkFeeInverseSet(event);
      return;
    }

    case ContractEventsSignatures.ExtensionAddedToNetwork: {
      await handleExtensionAddedToNetwork(event);
      return;
    }

    case ContractEventsSignatures.ExtensionInstalled: {
      await handleExtensionInstalled(event);
      return;
    }

    case ContractEventsSignatures.ExtensionUninstalled: {
      await handleExtensionUninstalled(event);
      return;
    }

    case ContractEventsSignatures.ExtensionDeprecated: {
      await handleExtensionDeprecated(event);
      return;
    }

    case ContractEventsSignatures.ExtensionUpgraded: {
      await handleExtensionUpgraded(event);
      return;
    }

    case ContractEventsSignatures.ExtensionInitialised: {
      await handleExtensionInitialised(event);
      return;
    }

    /* Entry point for a newly created motion. */
    case ContractEventsSignatures.MotionCreated: {
      await handleMotionCreated(event);
      return;
    }

    case ContractEventsSignatures.MotionStaked: {
      await handleMotionStaked(event);
      return;
    }

    case ContractEventsSignatures.MotionFinalized: {
      await handleMotionFinalized(event);
      return;
    }

    case ContractEventsSignatures.MotionRewardClaimed: {
      await handleMotionRewardClaimed(event);
      return;
    }

    case ContractEventsSignatures.MotionVoteSubmitted: {
      await handleMotionVoteSubmitted(event);
      return;
    }

    case ContractEventsSignatures.MotionVoteRevealed: {
      await handleMotionVoteRevealed(event);
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

    case ContractEventsSignatures.DomainAdded: {
      await handleCreateDomainAction(event);
      return;
    }

    case ContractEventsSignatures.DomainMetadata: {
      await handleEditDomainAction(event);
      return;
    }

    case ContractEventsSignatures.TokenUnlocked: {
      await handleTokenUnlockedAction(event);
      return;
    }

    case ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots: {
      await handleMoveFundsAction(event);
      return;
    }

    case ContractEventsSignatures.ColonyMetadata: {
      await handleEditColonyAction(event);
      return;
    }

    case ContractEventsSignatures.ColonyUpgraded: {
      await handleVersionUpgradeAction(event);
      return;
    }

    case ContractEventsSignatures.ArbitraryReputationUpdate: {
      await handleEmitDomainReputationAction(event);
      return;
    }

    case ContractEventsSignatures.ColonyRoleSet: {
      await handleManagePermissionsAction(event);
      return;
    }

    case ContractEventsSignatures.ColonyRoleSet_OLD: {
      await handleManagePermissionsAction(event);
      return;
    }

    case ContractEventsSignatures.RecoveryRoleSet: {
      await handleManagePermissionsAction(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureGlobalClaimDelaySet: {
      await handleExpenditureGlobalClaimDelaySet(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureAdded: {
      await handleExpenditureAdded(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureRecipientSet: {
      await handleExpenditureRecipientSet(event);
      return;
    }

    case ContractEventsSignatures.ExpenditurePayoutSet: {
      await handleExpenditurePayoutSet(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureLocked: {
      await handleExpenditureLocked(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureCancelled: {
      await handleExpenditureCancelled(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureFinalized: {
      await handleExpenditureFinalized(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureTransferred: {
      await handleExpenditureTransferred(event);
      return;
    }

    case ContractEventsSignatures.ExpenditureClaimDelaySet: {
      await handleExpenditureClaimDelaySet(event);
      return;
    }

    case ContractEventsSignatures.ExpenditurePayoutModifierSet: {
      await handleExpenditurePayoutModifierSet(event);
      return;
    }

    case ContractEventsSignatures.ExpenditurePayoutClaimed: {
      await handleExpenditurePayoutClaimed(event);
      return;
    }

    default: {
      return;
    }
  }
};
