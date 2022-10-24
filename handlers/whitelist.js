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

  const { _approvals, _agreementHash } = args;
  const query = {
    operationName: "UpdateWhitelist",
    query: `
        mutation UpdateWhitelist {
          updateWhitelist(
          input: { id: ${whitelistAddress}, agreementHash: ${_agreementHash}, useApprovals: ${Boolean(_approvals)} }
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
