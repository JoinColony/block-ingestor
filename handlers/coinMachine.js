const { poorMansGraphQL } = require('../utils');
const ethers = require('ethers');

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

const CoinMachineStatus = {
  0: "ACTIVE",
  1: "PAUSED",
  2: "STOPPED"
}

async function handleCoinMachineStateSet(args, coinMachineAddress) {
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
      const { state } = args;
      const query = {
        operationName: "UpdateSaleMutation",
        query: `
            mutation UpdateSaleMutation {
              updateSale(
              input: { id: "${sale.id}", coinMachineStatus: ${CoinMachineStatus[state]} }
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


async function handleTokensBought(args, coinMachineAddress) {
  const { buyer, numTokens, totalCost } = args;
  const marketPrice = ethers.BigNumber.from(totalCost).div(ethers.BigNumber.from(numTokens));
  const query = {
    operationName: "CreateOrdersHistory",
    query: `
        mutation CreateOrdersHistory {
          createOrdersHistory(
          input: { coinMachineAddress: "${coinMachineAddress}", walletAddress: "${buyer}", volume: "${numTokens}", marketPrice: "${marketPrice}" }
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
  handleCoinMachineInitialised,
  handleCoinMachineStateSet,
  handleTokensBought,
}
