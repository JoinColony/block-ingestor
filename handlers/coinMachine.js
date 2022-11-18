const { poorMansGraphQL } = require('../utils');

async function handleCoinMachineInitialised(args, coinMachineAddress) {
  const querySaleByCoinMachineAddress = {
    operationName: "GetSalebyCoinMachineAddress",
    query: `
        query GetSalebyCoinMachineAddress {
          getSalebyCoinMachineAddress(
          coinMachineAddress: "${coinMachineAddress}"
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
      const { body } = await poorMansGraphQL(querySaleByCoinMachineAddress);
      const result = JSON.parse(body);
      const sale = result.data.getSalebyCoinMachineAddress.items[0];
      if (!sale) return;
      const query = {
        operationName: "UpdateSaleMutation",
        query: `
            mutation UpdateSaleMutation {
              updateSale(
              input: { id: "${sale.id}", status: INITIALISED }
              condition: {}
            ) {
              id
            }
          }
        `,
        variables: null,
      };
      return query;
    } catch (error) {
      console.log(error);
      // silent error
    }
}

module.exports = {
  handleCoinMachineInitialised
}
