const { poorMansGraphQL } = require("../utils");
const ethers = require("ethers");
const purchaseTokens = require("../purchaseTokens.json");

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
  };
  try {
    const { body } = await poorMansGraphQL(querySaleByCoinMachineAddress);
    const result = JSON.parse(body);
    const sale = result.data.getSalebyCoinMachineAddress.items[0];
    if (!sale) return [];
    const query = {
      operationName: "UpdateSaleMutation",
      query: `
            mutation UpdateSaleMutation {
              updateSale(
              input: {
                id: "${sale.id}",
                status: INITIALISED,
                soldOut: false
              }
            ) {
              id
            }
          }
        `,
    };
    return [query];
  } catch (error) {
    console.log(error);
    // silent error
  }
}

const CoinMachineStatus = {
  0: "ACTIVE",
  1: "PAUSED",
  2: "STOPPED",
};

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
  };
  try {
    const { body } = await poorMansGraphQL(querySaleByCoinMachineAddress);
    const result = JSON.parse(body);
    const sale = result.data.getSalebyCoinMachineAddress.items[0];
    if (!sale) return [];
    const { state } = args;
    const query = {
      operationName: "UpdateSaleMutation",
      query: `
            mutation UpdateSaleMutation {
              updateSale(
              input: { id: "${sale.id}", coinMachineStatus: ${CoinMachineStatus[state]} }
            ) {
              id
            }
          }
        `,
    };
    return [query];
  } catch (error) {
    console.log(error);
    // silent error
  }
}

async function handleTokensBought(args, coinMachineAddress, contract) {
  const { buyer, numTokens, totalCost } = args;

  const querySaleByCoinMachineAddress = {
    operationName: "GetSalebyCoinMachineAddress",
    query: `
        query GetSalebyCoinMachineAddress {
          getSalebyCoinMachineAddress(
          coinMachineAddress: "${coinMachineAddress}"
        ) {
          items {
            tokenDecimals
            tokenAddress
            purchaseToken
            id
            endDate
            userCount
            users(filter: {userID: {eq: "${buyer}"}}) {
              items {
                userID
              }
            }
          }
        }
      }
    `,
  };

  try {
    const { body } = await poorMansGraphQL(querySaleByCoinMachineAddress);
    const result = JSON.parse(body);
    const sale = result.data.getSalebyCoinMachineAddress.items[0];
    if (!sale) return [];

    // Create Order History Entry
    const { tokenDecimals, purchaseToken, id, userCount } = sale;
    const purchaseTokenDecimals = purchaseTokens.find(
      (token) => token.tokenAddress === purchaseToken
    )?.decimals;
    const tokens = ethers.utils.formatUnits(numTokens, tokenDecimals);
    const cost = ethers.utils.formatUnits(totalCost, purchaseTokenDecimals);
    const currentPeriod = await contract.getCurrentPeriod();
    const query = {
      operationName: "CreateOrdersHistory",
      query: `
          mutation CreateOrdersHistory {
            createOrdersHistory(
            input: {
              coinMachineAddress: "${coinMachineAddress}",
              walletAddress: "${buyer}",
              volume: "${tokens}",
              marketPrice: "${parseFloat(cost / tokens)}",
              period: ${currentPeriod.toNumber()}
            }
          ) {
            id
          }
        }
      `,
    };

    // Update Sale Information
    const firstTimeBuy = sale.users.items.length === 0;

    const [totalSold, totalIntake, tokenBalance, intakeCap] = await Promise.all(
      [
        contract.getSoldTotal(),
        contract.getTotalIntake(),
        contract.getTokenBalance(),
        contract.intakeCap(),
      ]
    );
    const formattedSold = ethers.utils.formatUnits(totalSold, tokenDecimals);
    const formattedIntake = ethers.utils.formatUnits(
      totalIntake,
      purchaseTokenDecimals
    );
    const soldOut = totalSold.gte(tokenBalance) || totalIntake.gte(intakeCap);
    const saleUpdateQuery = {
      operationName: "UpdateSaleMutation",
      query: `
        mutation UpdateSaleMutation {
          updateSale(
          input: {
            id: "${id}",
            totalSold: "${formattedSold}",
            totalIntake: "${formattedIntake}",
            soldOut: ${soldOut}
            userCount: ${firstTimeBuy ? userCount + 1 : userCount}
          }
        ) {
          id
        }
      }
      `,
    };

    const queries = [query, saleUpdateQuery];

    if (firstTimeBuy) {
      // Create User Sale Connection
      const createUserSaleConnection = {
        operationName: "CreateUserSales",
        query: `
          mutation CreateUserSales {
            createUserSales(
            input: {
              userID: "${buyer}",
              saleID: "${id}"
            }
          ) {
            id
          }
        }
      `,
      };

      return [...queries, createUserSaleConnection];
    }

    return queries;
  } catch (error) {
    console.log(error);
    // silent error
  }
}

module.exports = {
  handleCoinMachineInitialised,
  handleCoinMachineStateSet,
  handleTokensBought,
};
