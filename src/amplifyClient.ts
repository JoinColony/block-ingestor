import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { GraphQLQuery } from '@aws-amplify/api';
import dotenv from 'dotenv';
import { DocumentNode, isExecutableDefinitionNode } from 'graphql';

dotenv.config();

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

export const query = async <T, TVariables extends Record<string, unknown>>(
  queryDocument: DocumentNode,
  variables?: TVariables,
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
      ? definitionNode.name?.value
      : 'Unknown';
    console.trace(
      `Could not execute mutation ${mutationName}. Error: ${error}`,
    );
    return undefined;
  }
};
