import { AmplifyClient } from '@joincolony/clients';

const amplifyClient = new AmplifyClient(
  process.env.AWS_APPSYNC_ENDPOINT || '',
  process.env.AWS_APPSYNC_KEY || '',
);

// @TODO stop exporting mutate and query like this because "this.methodName" loses context
const { mutate, query } = amplifyClient;
export { mutate, query };
export default amplifyClient;
