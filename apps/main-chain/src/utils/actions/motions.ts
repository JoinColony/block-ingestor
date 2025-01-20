import { ContractEventsSignatures } from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import { constants } from 'ethers';
import { getMotionDatabaseId } from '~handlers/motions/helpers';
import { getMultiSigDatabaseId } from '~handlers/multiSig/helpers';
// @NOTE this thing uses the networkClient and rpcProveider of the main chain!!! if you are making this reusable, networkClient and rpcProvider will need to be passed as arguments
import networkClient from '~networkClient';
import rpcProvider from '~provider';
import {
  VotingReputationEvents__factory as VotingReputationEventsFactory,
  MultisigPermissionsEvents__factory as MultisigPermissionsEventsFactory,
} from '@colony/events';

export const getFinalizationMotionId = async (
  txHash: string,
  votingReputationExtensionAddress: string,
): Promise<string | undefined> => {
  const chainId = rpcProvider.getChainId();
  const receipt = await networkClient.provider.getTransactionReceipt(txHash);
  const logInterface = VotingReputationEventsFactory.connect(
    constants.AddressZero,
    rpcProvider.getProviderInstance(),
  ).interface;

  for (const log of receipt.logs) {
    try {
      const parsedLog = logInterface?.parseLog(log);
      if (!parsedLog) {
        continue;
      }

      // if it's a voting reputation motion
      if (parsedLog.signature === ContractEventsSignatures.MotionFinalized) {
        const { motionId } = parsedLog.args;

        const motionDatabaseId = getMotionDatabaseId(
          Number(chainId),
          votingReputationExtensionAddress,
          motionId,
        );

        return motionDatabaseId;
      }
    } catch (error) {
      // Log could not be parsed, continue to next log
    }
  }

  output(`The txHash: ${txHash} doesn't have any MotionFinalized logs.`);
  return undefined;
};

export const getFinalizationMultiSigId = async (
  txHash: string,
  multiSigExtensionAddress: string,
): Promise<string | undefined> => {
  const chainId = rpcProvider.getChainId();
  const receipt = await networkClient.provider.getTransactionReceipt(txHash);
  const logInterface = MultisigPermissionsEventsFactory.connect(
    constants.AddressZero,
    rpcProvider.getProviderInstance(),
  ).interface;

  for (const log of receipt.logs) {
    try {
      const parsedLog = logInterface?.parseLog(log);
      if (!parsedLog) {
        continue;
      }

      // if it's a multisig motion
      if (
        parsedLog.signature === ContractEventsSignatures.MultisigMotionExecuted
      ) {
        const { motionId } = parsedLog.args;
        const multiSigDatabaseId = getMultiSigDatabaseId(
          chainId,
          multiSigExtensionAddress,
          motionId,
        );

        return multiSigDatabaseId;
      }
    } catch (error) {
      // Log could not be parsed, continue to next log
    }
  }

  output(`The txHash: ${txHash} doesn't have any MultisigMotionExecuted logs.`);
  return undefined;
};
