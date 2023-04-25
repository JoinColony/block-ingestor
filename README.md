# Coinmachine Block Ingestor

Ingest blocks and parse events

**!WARNING** While function, it's super experimental currently and should be treated as such

## Authentication

The Coinmachine application that utilises this block ingestor is set up using AWS infrastructure and thus it is necessary to install the [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) in order to setup the authentication flow.

The first step is to clone and setup the coinmachine application using the steps found in that repo's README.

Specifically the authentication for this process is done by creating a `blockingestor` user in the projects cognito user pool and then creating and adding this user to a `admin` group.

The setup script automates this process for you just call `npm run setup` to configure the block ingestor user.

This script is a wrapper to provide a good user experience around the following commands:
``` shell
aws cognito-idp admin-create-user \
    --user-pool-id $userPool \
    --username blockingestor

aws cognito-idp admin-set-user-password \
    --user-pool-id $userPool \
    --username blockingestor \
    --password $password \
    --permanent

aws cognito-idp create-group \
    --user-pool-id $userPool \
    --group-name admin

aws cognito-idp admin-add-user-to-group \
    --user-pool-id $userPool \
    --username blockingestor \
    --group-name admin
```

NOTE: The default password for local development is `test1234`

The following env vars need to be set in the process environment for authentication to function correctly, there is also a note of these in the `frontend/.env.example` file in the coinmachine repo

``` shell
// This is found in the User pool overview of the cognito tab for the project
export USER_POOL_ID="eu-west-2_example-id"
// This is found at the bottom of the App integration tab of the cognito tab
// in the section called `App clients and analytics` it is the `app_client`
// not the `app_clientWeb`
export CLIENT_ID="example-client-id"
export GraphQLAPIEndpointOutput="https://notarealendpoint.amazonaws.com/graphql"
```

