import { ContractEventsSignatures } from '~types';
import { handleExpenditureAddedAction } from './handlers/expenditureAdded';
import { handleMintTokensAction } from './handlers/mintTokens';
import { handlePaymentAction } from './handlers/payment';
import { ActionMatcher } from './types';

export const actionMatchers: ActionMatcher[] = [
  {
    eventSignatures: [ContractEventsSignatures.TokensMinted],
    handler: handleMintTokensAction,
  },
  {
    matcherFn: (events) => {
      if (
        events[0].signature !== ContractEventsSignatures.ExpenditureAdded ||
        events[events.length - 1].signature !==
          ContractEventsSignatures.OneTxPaymentMade
      ) {
        return false;
      }

      const remainingEvents = events.slice(1, -1);

      if (
        remainingEvents.some((event) =>
          [
            ContractEventsSignatures.ExpenditureAdded,
            ContractEventsSignatures.OneTxPaymentMade,
          ].includes(event.signature as ContractEventsSignatures),
        )
      ) {
        return false;
      }

      // @TODO: Adding another listener has a potential to break this
      return remainingEvents.every((event) =>
        [
          ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots,
          ContractEventsSignatures.ExpenditureStateChanged,
          ContractEventsSignatures.ExpenditurePayoutSet,
          ContractEventsSignatures.ExpenditureFinalized,
          ContractEventsSignatures.ExpenditureRecipientSet,
          ContractEventsSignatures.ExpenditurePayoutClaimed,
        ].includes(event.signature as ContractEventsSignatures),
      );
    },
    handler: handlePaymentAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.ExpenditureAdded],
    handler: handleExpenditureAddedAction,
  },
];
