import { Amplify } from 'aws-amplify';
import dotenv from 'dotenv';

dotenv.config();

/*
 * @TODO There needs to be a better way of fetching queries and mutations
 * inside the ingestor, as currently we can't update these if the schema
 * ever changes, other than manually
 */

export const mutations = {
  createColonyTransaction: /* GraphQL */ `
  mutation CreateColonyTransaction($input: CreateColonyTransactionInput!, $condition: ModelColonyTransactionConditionInput) {
    createColonyTransaction(input: $input, condition: $condition) { id }
  }`,
  updateColonyTransaction: /* GraphQL */ `
  mutation UpdateColonyTransaction($input: UpdateColonyTransactionInput!, $condition: ModelColonyTransactionConditionInput) {
    updateColonyTransaction(input: $input, condition: $condition) { id }
  }`,
};

export const queries = {
  getColonyUnclaimedTransactions: /* GraphQL */ `
  query GetColonyUnclaimedTransactions($colonyAddress: ID!, $startingBlock: Int = 1) {
    getColonyByAddress(id: $colonyAddress) {
      items {
        id
        type
        transactions(filter: { claimed: { ne: "true" }, createdAtBlock: { gt: $startingBlock } }) {
          items { id }
        }
      }
    }
  }`,
  getTransactionById: /* GraphQL */ `
  query GetTransactionById($transactionId: ID!) {
    getColonyTransaction(id: $transactionId) { id }
  }`,
};

// const httpLink = new HttpLink({
//   uri: `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`,
//   headers: {
//     'x-api-key': process.env.AWS_APPSYNC_KEY,
//   },
// });

// export default new ApolloClient({
//   ssrMode: true,
//   link: httpLink,
//   cache: new InMemoryCache(),
//   // @ts-ignore
//   something: { hello: true },
// });

export default (): void => {
  Amplify.configure({
    aws_appsync_graphqlEndpoint: `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`,
    // aws_appsync_region: 'eu-central-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.AWS_APPSYNC_KEY,
  });
};
