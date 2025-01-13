import { defineConfig } from '@wagmi/cli';
import colony from '@colony/wagmi-plugin';

export default defineConfig({
  out: 'src/constants/abis.ts',
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
          // @ts-expect-error - @TODO: fix once new version of plugin is released
          merge: 'events',
        },

        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
        },
        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
          // @ts-expect-error - @TODO: fix once new version of plugin is released
          merge: 'events',
        },
        {
          name: 'Colony',
          path: 'colony/Colony.sol/Colony.json',
          // @ts-expect-error - @TODO: fix once new version of plugin is released
          merge: 'functions',
        },
      ],
    }),
  ],
});
