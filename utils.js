const { fetch, Request } = require("cross-fetch");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const USER_NAME = "blockingestor";
const PASSWORD = "test1234";
const USER_POOL_ID = "eu-west-2_jeQWnWA5z";
const CLIENT_ID = "10is5acnrpvf0a73thu0dpk8df";

function authUser() {
  // authenticates with cognito to receive the access tokens.
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: USER_NAME,
      Password: PASSWORD,
    };
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: authenticationData.Username,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        // idToken serves our purposes for now
        resolve(idToken);
      },
      onFailure: function (err) {
        reject(err.message);
      },
    });
  });
}

module.exports = {
  output: (...messages) => console.log('[BlockIngestor]', ...messages),
  poorMansGraphQL: async (
    query,
    endpoint = process.env.GraphQLAPIEndpointOutput ||
      "http://192.168.0.220:20002/graphql",
  ) => {
    /* preferably cache the token somewhere and reuse in the future until it
       expires, then re-auth */
    const token = await authUser();

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "content-type": "application/json",
      },
      body: JSON.stringify(query),
    };

    const request = new Request(endpoint, options);
    let statusCode = 200;
    let body;
    let response;

    try {
      response = await fetch(request);
      body = await response.json();
      if (body.errors) statusCode = 400;
    } catch (error) {
      console.log(error);
    }

    if (statusCode === 400) {
      throw new Error(`Query not successful: ${query.operationName}`)
    }

    return {
      statusCode,
      body: JSON.stringify(body)
    };
  },
};
