import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { GraphQLQuery } from '@aws-amplify/api';
import dotenv from 'dotenv';
import { DocumentNode, isExecutableDefinitionNode } from 'graphql';

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
};

export default (): void => {
  Amplify.configure({
    aws_appsync_graphqlEndpoint: `${process.env.AWS_APPSYNC_ENDPOINT}`,
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.AWS_APPSYNC_KEY,
  });
};

type GraphQLFnReturn<T> = Promise<
  ReturnType<typeof API.graphql<GraphQLQuery<T>>> | undefined
>;

export const query = async <T, TVariables extends Record<string, unknown> = {}>(
  queryDocument: DocumentNode,
  variables: TVariables,
): GraphQLFnReturn<T> => {
  try {
    const result = await API.graphql<GraphQLQuery<T>>(
      graphqlOperation(queryDocument, variables),
    );

    return result;
  } catch (error) {
    const definitionNode = queryDocument.definitions[0];
    const queryName = isExecutableDefinitionNode(definitionNode)
      ? definitionNode.name
      : 'Unknown';
    console.error(`Could not fetch query ${queryName}`, error);
    return undefined;
  }
};

export const mutate = async <
  T,
  TVariables extends Record<string, unknown> = {},
>(
  mutationDocument: DocumentNode,
  variables: TVariables,
): GraphQLFnReturn<T> => {
  try {
    const result = await API.graphql<GraphQLQuery<T>>(
      graphqlOperation(mutationDocument, variables),
    );

    return result;
  } catch (error) {
    const definitionNode = mutationDocument.definitions[0];
    const mutationName = isExecutableDefinitionNode(definitionNode)
      ? definitionNode.name
      : 'Unknown';
    console.error(`Could not execute mutation ${mutationName}`, error);
    return undefined;
  }
};
