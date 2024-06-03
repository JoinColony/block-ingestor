import { ContractEvent } from '~types';
import { DecodedFunction } from '../multicall';

interface MulticallHandlerParams {
  colonyAddress: string;
  event: ContractEvent;
  gasEstimate: string;
  decodedFunctions: DecodedFunction[];
}

export type MulticallHandler = ({
  event,
  decodedFunctions,
  gasEstimate,
}: MulticallHandlerParams) => void | Promise<void>;

export type MulticallValidator = ({
  decodedFunctions,
}: {
  decodedFunctions: DecodedFunction[];
}) => boolean;
