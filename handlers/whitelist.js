function handleUserApproved(args, whitelistAddress) {
  const { user, status } = args;
  // TODO find out where to store this informations
  const query = {
    operationName: "UpdateWhitelist",
    query: `
        mutation UpdateWhitelist {
          updateWhitelist(
          input: { id: "${whitelistAddress}" }
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

function handleAgreementSigned(args, whitelistAddress) {
  const { user } = args;
  // TODO find out where to store this informations
  const query = {
    operationName: "UpdateWhitelist",
    query: `
        mutation UpdateWhitelist {
          updateWhitelist(
          input: { id: "${whitelistAddress}" }
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

function handleWhitelistInitialised(args, whitelistAddress) {
  const { approvals, agreementHash } = args;
  const query = {
    operationName: "UpdateWhitelist",
    query: `
        mutation UpdateWhitelist {
          updateWhitelist(
          input: { id: "${whitelistAddress}", agreementHash: "${agreementHash}", useApprovals: "${approvals}" }
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

module.exports = {
  handleUserApproved,
  handleAgreementSigned,
  handleWhitelistInitialised
}
