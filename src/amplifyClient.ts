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
        id
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
};

export default (): void => {
  Amplify.configure({
    aws_appsync_graphqlEndpoint: `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`,
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.AWS_APPSYNC_KEY,
  });
};

export const query = async (
  queryName: keyof typeof queries,
  /*
   * @TODO Would be nice if at some point we could actually set these
   * types properly
   */
  variables?: Record<string, unknown>,
): Promise<any> => {
  try {
    const result = await API.graphql(
      graphqlOperation(queries[queryName], variables),
    );
    const [internalQueryName] = Object.keys(result?.data ?? []);
    return result?.data[internalQueryName] ?? {};
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
): Promise<void> => {
  try {
    await API.graphql(graphqlOperation(mutations[mutationName], variables));
  } catch (error) {
    console.error(`Could not execute mutation "${mutationName}"`, error);
    return undefined;
  }
};
