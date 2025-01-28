import { constants } from 'ethers';

import amplifyClient from '~amplifyClient';
import { ContractEvent, EventHandler } from '@joincolony/blocks';
import { saveEvent, notNull } from '~utils';
import {
  UpdateColonyFundsClaimDocument,
  UpdateColonyFundsClaimMutation,
  UpdateColonyFundsClaimMutationVariables,
  GetColonyUnclaimedFundsDocument,
  GetColonyUnclaimedFundsQuery,
  GetColonyUnclaimedFundsQueryVariables,
} from '@joincolony/graphql';
import { output } from '@joincolony/utils';

export const handleProxyColonyFundsClaimed: EventHandler = async (
  event: ContractEvent,
): Promise<void> => {
  const { contractAddress: colonyAddress, blockNumber } = event;
  const {
    _chainId: chainId,
    _token: tokenAddress,
    _amount: amount,
  } = event.args;

  const chainIdValue = chainId.toNumber();

  // @TODO this needs to be updated as the native chain token claims will have a token address different than constants.AddressZero
  /*
   * We're not handling native chain token claims from here, so no point
   * in running through the whole logic just to end up with the same result
   */
  if (tokenAddress !== constants.AddressZero) {
    const { items: unclaimedFunds } =
      (
        await amplifyClient.query<
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
      'on Chain:',
      chainIdValue,
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
          await amplifyClient.mutate<
            UpdateColonyFundsClaimMutation,
            UpdateColonyFundsClaimMutationVariables
          >(UpdateColonyFundsClaimDocument, {
            input: { id, isClaimed: true },
          });

          // @TODO this will need to be uncommented and check for the initiator address as we don't get this information from the event
          // await sendFundsClaimedNotifications({
          //   tokenSymbol: token.symbol,
          //   tokenAmount: amount,
          //   tokenAddress,
          //   creator: initiatorAddress,
          //   colonyAddress,
          // });
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
  if (!amount.isZero()) {
    await saveEvent(event);
  }
};
