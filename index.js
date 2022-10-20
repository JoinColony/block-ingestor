const ethers = require('ethers');
const coinMachineFactory = require('./abi/coinMachineFactoryABI.json');
const whitelist = require('./abi/whitelistABI.json');

const { output, poorMansGraphQL } = require('./utils');

// const subsribeToWhitelist = async (whitelistAddress, provider) => {
//   try {
//     const contract = await new ethers.Contract(whitelistAddress, coinMachineFactory.abi, provider);
//     contract.on('*', async(event) => {
//       const parsed = contract.interface.parseLog(event);
//       const { useApprovals, agreementHash } = parsed.args;

//       const query = {
//         operationName: "UpdateWhitelist",
//         query: `
//             mutation UpdateWhitelist {
//               updateWhitelist(
//               input: { id: "${whitelistAddress}", agreementHash: "${agreementHash}", useApprovals: "${useApprovals}" }
//               condition: {}
//             ) {
//               id
//             }
//           }
//         `,
//         variables: null,
//       };
//       try {
//         await poorMansGraphQL(query);
//         output('Saving whitelist to database');
//       } catch (error) {
//         console.log(error);
//         // silent error
//       }
//     });

//   } catch (error) {
//     console.error(error);
//   }
// }

(async () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const whitelistContracts = [];

  const coinmachineFactoryAddress = process.argv[2];

  try {
    const contract = await new ethers.Contract(coinmachineFactoryAddress, coinMachineFactory.abi, provider);
    contract.on('*', async(event) => {
      const parsed = contract.interface.parseLog(event);
      const { whitelist, owner } = parsed.args;
      // subsribeToWhitelist(whitelist);

      const query = {
        operationName: "CreateWhitelist",
        query: `
            mutation CreateWhitelist {
              createWhitelist(
              input: { id: "${whitelist}", walletAddress: "${owner}" }
              condition: {}
            ) {
              id
            }
          }
        `,
        variables: null,
      };
      try {
        await poorMansGraphQL(query);
        output('Saving whitelist to database');
      } catch (error) {
        console.log(error);
        // silent error
      }
    });
} catch (error) {
    console.error(error);
}

})()
