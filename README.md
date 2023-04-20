# Block Ingestor

Ingest blocks and parse events

**!WARNING** While function, it's super experimental currently and should be treated as such

## Authentication

The authentication for this process is done by creating a `blockingestor` user in the projects cognito user pool and creating and adding this user to the `blockingestor` group

The following script sets up this user and group:
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

The following env vars need to be set in the process environment for authentication to function correctly

``` shell
// This is found in the User pool overview of the cognito tab for the project
export USER_POOL_ID="eu-west-2_example-id"
// This is found at the bottom of the App integration tab of the cognito tab
// in the section called `App clients and analytics` it is the `app_client`
// not the `app_clientWeb`
export CLIENT_ID="example-client-id"
export GraphQLAPIEndpointOutput="https://notarealendpoint.amazonaws.com/graphql"
```

