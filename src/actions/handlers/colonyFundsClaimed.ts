import { constants } from 'ethers';

import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import { output, verbose, notNull, writeActionFromEvent } from '~utils';
import {
  UpdateColonyFundsClaimDocument,
  UpdateColonyFundsClaimMutation,
  UpdateColonyFundsClaimMutationVariables,
  GetColonyUnclaimedFundsDocument,
  GetColonyUnclaimedFundsQuery,
  GetColonyUnclaimedFundsQueryVariables,
  ColonyActionType,
} from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, blockNumber } = event;
  const {
    token: tokenAddress,
    payoutRemainder,
    agent: initiatorAddress,
  } = event.args;

  verbose('Processing ColonyFundsClaimed event');
  verbose('Colony Address:', colonyAddress);
  verbose('Token Address:', tokenAddress);
  verbose('Payout Remainder:', payoutRemainder.toString());
  verbose('Initiator Address:', initiatorAddress);

  if (tokenAddress !== constants.AddressZero) {
    verbose('Processing non-native token claim');
    const { items: unclaimedFunds } =
      (
        await query<
          GetColonyUnclaimedFundsQuery,
          GetColonyUnclaimedFundsQueryVariables
        >(GetColonyUnclaimedFundsDocument, {
          colonyAddress,
          tokenAddress,
          upToBlock: blockNumber,
        })
      )?.data?.listColonyFundsClaims ?? {};

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

    if (colonyHasUnclaimedFunds) {
      verbose('Colony has unclaimed funds. Updating claim status.');
      await Promise.all(
        unclaimedFunds.filter(notNull).map(({ id }) => {
          verbose('Updating claim status for id:', id);
          return mutate<
            UpdateColonyFundsClaimMutation,
            UpdateColonyFundsClaimMutationVariables
          >(UpdateColonyFundsClaimDocument, {
            input: { id, isClaimed: true },
          });
        }),
      );
      verbose('All unclaimed funds have been updated');
    } else {
      verbose('No unclaimed funds found for this colony and token');
    }
  } else {
    verbose('Native token claim detected. Not processing from this handler.');
    output(
      'Found new Transfer Claim for Token:',
      tokenAddress,
      'by Colony:',
      colonyAddress,
      "but not acting upon it since it's a chain native token claim, and we're not handling these from here",
    );
  }

  if (!payoutRemainder.isZero()) {
    verbose('Writing action for non-zero payout');
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.ClaimFunds,
      initiatorAddress,
      tokenAddress,
      amount: payoutRemainder.toString(),
    });
    verbose('Action written successfully');
  } else {
    verbose('Payout remainder is zero. No action written.');
  }

  verbose('ColonyFundsClaimed event processing completed');
};
