import { constants } from 'ethers';

import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import { output, saveEvent, notNull } from '~utils';
import {
  UpdateColonyFundsClaimDocument,
  UpdateColonyFundsClaimMutation,
  UpdateColonyFundsClaimMutationVariables,
  GetColonyUnclaimedFundsDocument,
  GetColonyUnclaimedFundsQuery,
  GetColonyUnclaimedFundsQueryVariables,
} from '~graphql';
import { sendFundsClaimedNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, blockNumber } = event;
  const { initiatorAddress, token: tokenAddress, payoutRemainder } = event.args;

  /*
   * We're not handling native chain token claims from here, so no point
   * in running through the whole logic just to end up with the same result
   */
  if (tokenAddress !== constants.AddressZero) {
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
        unclaimedFunds.filter(notNull).map(async ({ id, token, amount }) => {
          await mutate<
            UpdateColonyFundsClaimMutation,
            UpdateColonyFundsClaimMutationVariables
          >(UpdateColonyFundsClaimDocument, {
            input: { id, isClaimed: true },
          });

          await sendFundsClaimedNotifications({
            tokenSymbol: token.symbol,
            tokenAmount: amount,
            tokenAddress,
            creator: initiatorAddress,
            colonyAddress,
          });
        }),
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
};
