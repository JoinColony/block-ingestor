import { constants } from 'ethers';
import { mutate, query } from '~/amplifyClient';

import { ContractEvent } from '~/types';
import { output, saveEvent } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, blockNumber } = event;
  const { token: tokenAddress, payoutRemainder } = event.args;

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
        unclaimedFunds.map(({ id }: { id: string }) =>
          mutate('deleteColonyFundsClaim', { input: { id } }),
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
};
