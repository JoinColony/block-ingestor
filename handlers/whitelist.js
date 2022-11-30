const { poorMansGraphQL } = require('../utils');

function handleUserStatusCreate(user, whitelistAddress, status = null, agreement = null) {
  const input = status ? `{ walletAddress: "${user}", approved: ${Boolean(status)}, whitelistId: "${whitelistAddress}" }` :
  `{ walletAddress: "${user}", agreementSigned: true, whitelistId: "${whitelistAddress}" }`
  const query = {
    operationName: "CreateUserStatusMutation",
    query: `
        mutation CreateUserStatusMutation {
          createUserStatus(
          input: ${input}
          condition: {}
        ) {
          id
        }
      }
    `,
    variables: null,
  };
  return query;
}

function handleUserStatusUpdate(id, status = null, agreement = null) {
  const input = status ? `{ id: "${id}", approved: ${Boolean(status)} }` :
  `{ id: "${id}", agreementSigned: true }`
  const query = {
    operationName: "UpdateUserStatusMutation",
    query: `
        mutation UpdateUserStatusMutation {
          updateUserStatus(
          input: ${input}
          condition: {}
        ) {
          id
        }
      }
    `,
    variables: null,
  };
  return query;
}

async function handleUserApproved(args, whitelistAddress) {
  const { _user, _status } = args;
  const queryUserStatus = {
    operationName: "UserStatusByWhitelistAndWalletAddress",
    query: `
        query UserStatusByWhitelistAndWalletAddress {
          userStatusByWhitelistAndWalletAddress(
          whitelistId: "${whitelistAddress}",
          walletAddress: {eq: "${_user}"}
        ) {
          items {
            id
          }
        }
      }
    `,
    variables: null,
  };
   try {
      const { body } = await poorMansGraphQL(queryUserStatus);
      const result = JSON.parse(body);
      const items = result.data.userStatusByWhitelistAndWalletAddress.items;
      const userStatusExist = items.length > 0;
      if (userStatusExist) {
        return handleUserStatusUpdate(items[0].id, _status);
      } else {
        return handleUserStatusCreate(_user, whitelistAddress, _status);
      }
    } catch (error) {
      console.log(error);
      // silent error
    }
}

async function handleAgreementSigned(args, whitelistAddress) {
  const { _user } = args;
  const queryUserStatus = {
    operationName: "UserStatusByWhitelistAndWalletAddress",
    query: `
        query UserStatusByWhitelistAndWalletAddress {
          userStatusByWhitelistAndWalletAddress(
          whitelistId: "${whitelistAddress}",
          walletAddress: {eq: "${_user}"}
        ) {
          items {
            id
          }
        }
      }
    `,
    variables: null,
  };
   try {
      const { body } = await poorMansGraphQL(queryUserStatus);
      const result = JSON.parse(body);
      const items = result.data.userStatusByWhitelistAndWalletAddress.items;
      const userStatusExist = items.length > 0;
      if (userStatusExist) {
        return handleUserStatusUpdate(items[0].id, null, true);
      } else {
        return handleUserStatusCreate(_user, whitelistAddress, null, true);
      }
    } catch (error) {
      console.log(error);
      // silent error
    }
}

module.exports = {
  handleUserApproved,
  handleAgreementSigned,
}
