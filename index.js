const ethers = require('ethers');
const coinMachineFactory = require('./abi/coinMachineFactoryABI.json');
const whitelist = require('./abi/whitelistABI.json');
const { handleWhitelistInitialised, handleAgreementSigned, handleUserApproved } = require('./handlers/whitelist.js');

const { output, poorMansGraphQL } = require('./utils');


const WhitelistEvents = {
  'UserApproved': handleUserApproved,
  'AgreementSigned': handleAgreementSigned,
  'WhitelistInitialised': handleWhitelistInitialised
}

const subsribeToWhitelist = async (whitelistAddress, provider) => {
  try {
    const contract = await new ethers.Contract(whitelistAddress, whitelist.abi, provider);
    contract.on('*', async(event) => {
      const parsed = contract.interface.parseLog(event);
      const handler =  WhitelistEvents[event.event];
      if (!handler) return;
      const query = handler(parsed.args, whitelistAddress);
      try {
        await poorMansGraphQL(query);
        output(`Database updated after event: ${event.event}`);
      } catch (error) {
        console.log(error);
        // silent error
      }
    });

  } catch (error) {
    console.error(error);
  }
}

(async () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const whitelistContracts = []; // Fetch from db and subsribe

  const coinmachineFactoryAddress = process.argv[2];

  try {
    const contract = await new ethers.Contract(coinmachineFactoryAddress, coinMachineFactory.abi, provider);
    contract.on('*', async(event) => {
      const parsed = contract.interface.parseLog(event);
      const { whitelist, owner } = parsed.args;
      await subsribeToWhitelist(whitelist, provider);

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
