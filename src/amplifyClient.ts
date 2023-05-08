import { Amplify, API, graphqlOperation } from 'aws-amplify';
import dotenv from 'dotenv';

dotenv.config();

/*
 * @TODO There needs to be a better way of fetching queries and mutations
 * inside the ingestor, as currently we can't update these if the schema
 * ever changes, other than manually
 */

export const mutations = {
  createColonyFundsClaim: /* GraphQL */ `
    mutation CreateColonyFundsClaim(
      $input: CreateColonyFundsClaimInput!
      $condition: ModelColonyFundsClaimConditionInput
    ) {
      createColonyFundsClaim(input: $input, condition: $condition) {
        id
      }
    }
  `,
  deleteColonyFundsClaim: /* GraphQL */ `
    mutation DeleteColonyFundsClaim(
      $input: DeleteColonyFundsClaimInput!
      $condition: ModelColonyFundsClaimConditionInput
    ) {
      deleteColonyFundsClaim(input: $input, condition: $condition) {
        id
      }
    }
  `,
  createContractEvent: /* GraphQL */ `
    mutation CreateContractEvent(
      $input: CreateContractEventInput!
      $condition: ModelContractEventConditionInput
    ) {
      createContractEvent(input: $input, condition: $condition) {
        id
      }
    }
  `,
  setCurrentVersion: /* GraphQL */ `
    mutation SetCurrentVersion($input: SetCurrentVersionInput!) {
      setCurrentVersion(input: $input)
    }
  `,
  createCurrentNetworkInverseFee: /* GraphQL */ `
    mutation CreateCurrentNetworkInverseFee(
      $input: CreateCurrentNetworkInverseFeeInput!
    ) {
      createCurrentNetworkInverseFee(input: $input) {
        id
      }
    }
  `,
  updateCurrentNetworkInverseFee: /* GraphQL */ `
    mutation UpdateCurrentNetworkInverseFee(
      $input: UpdateCurrentNetworkInverseFeeInput!
    ) {
      updateCurrentNetworkInverseFee(input: $input) {
        id
      }
    }
  `,
  createColonyExtension: /* GraphQL */ `
    mutation CreateColonyExtension($input: CreateColonyExtensionInput!) {
      createColonyExtension(input: $input) {
        id
      }
    }
  `,
  updateColonyExtensionByColonyAndHash: /* GraphQL */ `
    mutation UpdateColonyExtensionByColonyAndHash(
      $input: UpdateExtensionByColonyAndHashInput!
    ) {
      updateExtensionByColonyAndHash(input: $input) {
        id
      }
    }
  `,
  updateColonyExtensionByAddress: /* GraphQL */ `
    mutation UpdateColonyExtensionByAddress(
      $input: UpdateColonyExtensionInput!
    ) {
      updateColonyExtension(input: $input) {
        extensionHash: hash
        colonyAddress: colonyId
      }
    }
  `,
  updateColony: /* GraphQL */ `
    mutation UpdateColony($input: UpdateColonyInput!) {
      updateColony(input: $input) {
        id
      }
    }
  `,
  createColonyAction: /* GraphQL */ `
    mutation CreateColonyAction($input: CreateColonyActionInput!) {
      createColonyAction(input: $input) {
        id
      }
    }
  `,
  updateColonyAction: /* GraphQL */ `
    mutation UpdateColonyAction($input: UpdateColonyActionInput!) {
      updateColonyAction(input: $input) {
        id
      }
    }
  `,
  createDomain: /* GraphQL */ `
    mutation CreateDomain($input: CreateDomainInput!) {
      createDomain(input: $input) {
        id
      }
    }
  `,
  createDomainMetadata: /* GraphQL */ `
    mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
      createDomainMetadata(input: $input) {
        id
      }
    }
  `,
  updateDomainMetadata: /* GraphQL */ `
    mutation UpdateDomainMetadata($input: UpdateDomainMetadataInput!) {
      updateDomainMetadata(input: $input) {
        id
      }
    }
  `,
  updateColonyMetadata: /* GraphQL */ `
    mutation UpdateColonyMetadata($input: UpdateColonyMetadataInput!) {
      updateColonyMetadata(input: $input) {
        id
      }
    }
  `,
  createColonyTokens: /* GraphQL */ `
    mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
      createColonyTokens(input: $input) {
        id
      }
    }
  `,
  deleteColonyTokens: /* GraphQL */ `
    mutation DeleteColonyTokens($input: DeleteColonyTokensInput!) {
      deleteColonyTokens(input: $input) {
        id
      }
    }
  `,
  createColonyMotion: /* GraphQL */ `
    mutation CreateColonyMotion($input: CreateColonyMotionInput!) {
      createColonyMotion(input: $input) {
        id
      }
    }
  `,
  updateColonyMotion: /* GraphQL */ `
    mutation UpdateColonyMotion($input: UpdateColonyMotionInput!) {
      updateColonyMotion(input: $input) {
        id
      }
    }
  `,
};

/*
 * @NOTE These queries are custom
 */
export const queries = {
  getColonyUnclaimedFunds: /* GraphQL */ `
    query GetColonyUnclaimedFunds(
      $colonyAddress: ID!
      $tokenAddress: ID!
      $upToBlock: Int = 1
    ) {
      listColonyFundsClaims(
        filter: {
          colonyFundsClaimsId: { eq: $colonyAddress }
          colonyFundsClaimTokenId: { eq: $tokenAddress }
          createdAtBlock: { le: $upToBlock }
        }
      ) {
        items {
          id
        }
      }
    }
  `,
  getColonyUnclaimedFund: /* GraphQL */ `
    query GetColonyUnclaimedFund($claimId: ID!) {
      getColonyFundsClaim(id: $claimId) {
        id
      }
    }
  `,
  getContractEvent: /* GraphQL */ `
    query GetContractEvent($id: ID!) {
      getContractEvent(id: $id) {
        id
      }
    }
  `,
  getCurrentNetworkInverseFee: /* GraphQL */ `
    query GetCurrentNetworkInverseFee {
      listCurrentNetworkInverseFees(limit: 1) {
        items {
          id
          inverseFee
        }
      }
    }
  `,
  getColonyExtension: /* GraphQL */ `
    query GetColonyExtension($id: ID!) {
      getColonyExtension(id: $id) {
        colonyId
      }
    }
  `,
  getColonyActionByMotion: /* GraphQL */ `
    query GetColonyActionByMotion($motionDataId: ID!) {
      getColonyActionByMotion(motionDataId: $motionDataId) {
        items {
          id
          pendingDomainMetadata
        }
      }
    }
  `,
  getColonyMotion: /* GraphQL */ `
    query GetColonyMotion($id: ID!) {
      getColonyMotion(id: $id) {
        id
        nativeMotionId
        motionStakes {
          raw {
            nay
            yay
          }
          percentage {
            nay
            yay
          }
        }
        requiredStake
        remainingStakes
        usersStakes {
          address
          stakes {
            raw {
              yay
              nay
            }
            percentage {
              yay
              nay
            }
          }
        }
        userMinStake
        rootHash
        nativeMotionDomainId
        stakerRewards {
          address
          rewards {
            yay
            nay
          }
          isClaimed
        }
        isFinalized
        createdBy
        voterRecord {
          address
          voteCount
          vote
        }
        revealedVotes {
          raw {
            yay
            nay
          }
          percentage {
            yay
            nay
          }
        }
        repSubmitted
        skillRep
        hasObjection
        nativeMotionDomainId
        motionStateHistory {
          hasVoted
          hasPassed
          hasFailed
          hasFailedNotFinalizable
          inRevealPhase
        }
        messages {
          name
          messageKey
          initiatorAddress
          vote
          amount
        }
        pendingDomainMetadata {
          name
          color
          description
          changelog {
            transactionHash
            oldName
            newName
            oldColor
            newColor
            oldDescription
            newDescription
          }
          pendingColonyMetadata {
            id
            displayName
            avatar
            thumbnail
            changelog {
              transactionHash
              oldDisplayName
              newDisplayName
              hasAvatarChanged
              hasWhitelistChanged
              haveTokensChanged
            }
            isWhitelistActivated
            whitelistedAddresses
            modifiedTokenAddresses {
              added
              removed
            }
          }
        }
      }
    }
  `,
  getVotingRepInstallations: /* GraphQL */ `
    query GetVotingRepInstallations(
      $votingRepHash: String!
      $colonyAddress: ID!
    ) {
      getExtensionByColonyAndHash(
        colonyId: $colonyAddress
        hash: { eq: $votingRepHash }
      ) {
        items {
          id
        }
      }
    }
  `,
  getColonyMetadata: /* GraphQL */ `
    query GetColonyMetadata($id: ID!) {
      getColonyMetadata(id: $id) {
        id
        displayName
        avatar
        thumbnail
        changelog {
          transactionHash
          oldDisplayName
          newDisplayName
          hasAvatarChanged
          hasWhitelistChanged
          haveTokensChanged
        }
        isWhitelistActivated
        whitelistedAddresses
        modifiedTokenAddresses {
          added
          removed
        }
      }
    }
  `,
  getTokenFromEverywhere: /* GraphQL */ `
    query GetTokenFromEverywhere($input: TokenFromEverywhereArguments!) {
      getTokenFromEverywhere(input: $input) {
        items {
          id
        }
      }
    }
  `,
  getColony: /* GraphQL */ `
    query GetColony($id: ID!) {
      getColony(id: $id) {
        colonyAddress: id
        tokens {
          items {
            id
            tokenAddress: tokenID
          }
        }
      }
    }
  `,
  getDomainMetadata: /* GraphQL */ `
    query GetDomainMetadata($id: ID!) {
      getDomainMetadata(id: $id) {
        color
        description
        id
        name
        changelog {
          newColor
          newDescription
          newName
          oldColor
          oldDescription
          oldName
          transactionHash
        }
      }
    }
  `,
};

export default (): void => {
  Amplify.configure({
    aws_appsync_graphqlEndpoint: `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`,
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.AWS_APPSYNC_KEY,
  });
};

export const query = async <T = any>(
  queryName: keyof typeof queries,
  /*
   * @TODO Would be nice if at some point we could actually set these
   * types properly
   */
  variables?: Record<string, unknown>,
): Promise<T | undefined> => {
  try {
    const result = await API.graphql(
      graphqlOperation(queries[queryName], variables),
    );
    const [internalQueryName] = Object.keys(result?.data ?? []);
    return result?.data[internalQueryName];
  } catch (error) {
    console.error(`Could not fetch query "${queryName}"`, error);
    return undefined;
  }
};

export const mutate = async (
  mutationName: keyof typeof mutations,
  /*
   * @TODO Would be nice if at some point we could actually set these
   * types properly
   */
  variables?: { input: Record<string, unknown> },
): Promise<any> => {
  try {
    const result = await API.graphql(
      graphqlOperation(mutations[mutationName], variables),
    );
    return result;
  } catch (error) {
    console.error(`Could not execute mutation "${mutationName}"`, error);
    return undefined;
  }
};
