import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`,
  headers: {
    'x-api-key': process.env.AWS_APPSYNC_KEY,
  },
});

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
