import { AmplifyClient } from '@joincolony/clients';

const amplifyClient = new AmplifyClient(
  process.env.AWS_APPSYNC_ENDPOINT || '',
  process.env.AWS_APPSYNC_KEY || '',
);

const { mutate, query } = amplifyClient;
export { mutate, query };
