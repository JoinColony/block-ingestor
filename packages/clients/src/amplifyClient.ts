import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { GraphQLQuery } from '@aws-amplify/api';
import { DocumentNode, isExecutableDefinitionNode } from 'graphql';
import { verbose } from '@joincolony/utils';

export type GraphQLFnReturn<T> = Promise<
  ReturnType<typeof API.graphql<GraphQLQuery<T>>> | undefined
>;

export class AmplifyClient {
  constructor(appSyncEndpoint: string, appSyncApiKey: string) {
    Amplify.configure({
      aws_appsync_graphqlEndpoint: appSyncEndpoint,
      aws_appsync_authenticationType: 'API_KEY',
      aws_appsync_apiKey: appSyncApiKey,
    });
  }

  public async query<T, TVariables extends Record<string, unknown>>(
    queryDocument: DocumentNode,
    variables?: TVariables,
  ): GraphQLFnReturn<T> {
    try {
      const result = await API.graphql<GraphQLQuery<T>>(
        graphqlOperation(queryDocument, variables),
      );
      return result;
    } catch (error) {
      const definitionNode = queryDocument.definitions[0];
      const queryName = isExecutableDefinitionNode(definitionNode)
        ? definitionNode.name?.value
        : 'Unknown';
      console.error(`Could not fetch query ${queryName}`, error);
      return undefined;
    }
  }

  public async mutate<T, TVariables extends Record<string, unknown>>(
    mutationDocument: DocumentNode,
    variables?: TVariables,
  ): GraphQLFnReturn<T> {
    try {
      const result = await API.graphql<GraphQLQuery<T>>(
        graphqlOperation(mutationDocument, variables),
      );
      return result;
    } catch (error: any) {
      const definitionNode = mutationDocument.definitions[0];
      const name = isExecutableDefinitionNode(definitionNode)
        ? definitionNode.name?.value
        : 'Unknown';

      const errMsg = 'errors' in error ? error.errors : error;
      verbose(`Could not execute mutation ${name}. Error: `, errMsg);
      console.error(`Could not execute mutation ${name}`, error);
      return undefined;
    }
  }
}
