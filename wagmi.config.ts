import { defineConfig } from '@wagmi/cli';
import colony from '@colony/wagmi-plugin';

export default defineConfig({
  out: 'packages/blocks/src/constants/abis.ts',
  contracts: [],
  plugins: [
    colony({
      baseUrl: 'http://localhost:3006/artifacts/contracts',
      contracts: [
        {
          name: 'ColonyNetwork',
          path: 'colonyNetwork/ColonyNetwork.sol/ColonyNetwork.json',
        },
        // Here we define a special type, an "artificial" ABI, that combines events of _all_ versions of this contract
        {
          name: 'ColonyNetwork',
          path: 'colonyNetwork/ColonyNetwork.sol/ColonyNetwork.json',
          merge: 'events',
        },

        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
        },
        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
          merge: 'events',
        },
        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
          merge: 'functions',
        },
      ],
    }),
  ],
});
