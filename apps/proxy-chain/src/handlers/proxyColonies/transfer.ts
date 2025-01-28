import amplifyClient from '~amplifyClient';
import networkClient from '~networkClient';
import rpcProvider from '~provider';
import { ContractEvent } from '@joincolony/blocks';
import {
  GetColonyUnclaimedFundDocument,
  GetColonyUnclaimedFundQuery,
  GetColonyUnclaimedFundQueryVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '@joincolony/graphql';
import { createFundsClaim } from '~utils';
import { output } from '@joincolony/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: tokenAddress, logIndex, transactionHash } = event;
  const chainId = rpcProvider.getChainId();
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
  const [source, dst, wad] = event.args;

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
        (
          await amplifyClient.query<
            GetColonyUnclaimedFundQuery,
            GetColonyUnclaimedFundQueryVariables
          >(GetColonyUnclaimedFundDocument, { claimId })
        )?.data?.getColonyFundsClaim ?? {};
      existingClaim = existingClaimId;
    }

    output(
      'Found new Transfer of:',
      amount,
      'into Colony:',
      dst,
      !!existingClaim || amount === '0'
        ? `but not acting upon it since ${
            existingClaim ? 'it already exists in the database' : ''
          }${amount === '0' ? "it's value is zero" : ''}`
        : '',
    );

    let tokenAddressFromDb: string | undefined;

    /**
     * Call the GetTokenFromEverywhere query to ensure the token
     * gets added to the DB if it doesn't already exist
     */
    try {
      const dbTokenQuery = await amplifyClient.query<
        GetTokenFromEverywhereQuery,
        GetTokenFromEverywhereQueryVariables
      >(GetTokenFromEverywhereDocument, {
        input: {
          tokenAddress,
        },
      });
      const [dbToken] = dbTokenQuery?.data?.getTokenFromEverywhere?.items ?? [];
      tokenAddressFromDb = dbToken?.id;
    } catch {
      output(
        `Token ${tokenAddress} not found on chain while handling Transfer event to colony ${dst}`,
      );
    }

    /*
     * 1. Don't add claims that are already in the database
     * 2. Don't add claims that are zero
     * 3. Don't add claims that don't have a token address in the database -- this is important since it prevents spam tokens (or contracts mascarading as tokens)
     * from being added to the database, breaking the colony query
     */
    if (!existingClaim && amount !== '0' && tokenAddressFromDb) {
      createFundsClaim({
        colonyAddress: dst,
        tokenAddress,
        amount,
        event,
      });
    }
  }
};
