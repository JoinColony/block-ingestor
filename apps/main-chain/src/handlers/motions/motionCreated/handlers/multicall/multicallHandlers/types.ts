import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent } from '@joincolony/blocks';

interface MulticallHandlerParams {
  colonyAddress: string;
  event: ContractEvent;
  decodedFunctions: TransactionDescription[];
}

export type MulticallHandler = ({
  event,
  decodedFunctions,
}: MulticallHandlerParams) => void | Promise<void>;

export type MulticallValidator = ({
  decodedFunctions,
}: {
  decodedFunctions: TransactionDescription[];
}) => boolean;
