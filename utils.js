const { fetch, Request } = require("cross-fetch");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const USER_NAME = "blockingestor";
// This is found in the User pool overview of the cognito tab for the project
const USER_POOL_ID = process.env.USER_POOL_ID;
// This is found at the bottom of the App integration tab of the cognito tab
// in the section called `App clients and analytics` it is the `app_client`
// not the `app_clientWeb`
const CLIENT_ID = process.env.CLIENT_ID;

if (!CLIENT_ID || !USER_POOL_ID) {
  throw new Error(
    `User pool id ${USER_POOL_ID} or Client id ${CLIENT_ID} not set`
  );
}

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
  output: (...messages) => console.log("[BlockIngestor]", ...messages),
  poorMansGraphQL: async (
    query,
    endpoint = process.env.GraphQLAPIEndpointOutput ||
      "http://192.168.0.220:20002/graphql",
    password = process.env.BlockIngestorPassword || "test1234"
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
      throw new Error(`Query not successful: ${query.operationName}`);
    }

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  },
};
