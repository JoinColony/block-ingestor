import {
  UpdateSupportedChainMutation,
  UpdateSupportedChainMutationVariables,
  UpdateSupportedChainDocument,
} from '@joincolony/graphql';
import { output } from '@joincolony/utils/src/logger';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';

const cleanup = async (): Promise<void> => {
  const chainId = rpcProvider.getChainId();
  try {
    if (chainId) {
      await amplifyClient.mutate<
        UpdateSupportedChainMutation,
        UpdateSupportedChainMutationVariables
      >(UpdateSupportedChainDocument, {
        input: {
          id: chainId.toString(),
          isActive: false,
        },
      });
    }
  } catch {
    // There might have been an error upon disabling a supported chain
  }
};

// Here we listen for process events and in case one is intercepted, we perform the cleanup
[
  {
    name: 'SIGTERM',
    exitCode: 0,
  },
  {
    name: 'SIGINT',
    exitCode: 0,
  },
  {
    name: 'uncaughtException',
    exitCode: 1,
  },
  {
    name: 'unhandledRejection',
    exitCode: 1,
  },
].forEach((signalConfig) =>
  process.on(signalConfig.name, async () => {
    output('Performing cleanup before exiting.');
    await cleanup();
    process.exit(signalConfig.exitCode);
  }),
);
