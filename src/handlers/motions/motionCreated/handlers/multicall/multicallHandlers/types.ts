import { ContractEvent } from '~types';
import { DecodedFunction } from '../multicall';

export type MulticallHandler = ({
  event,
  decodedFunctions,
  gasEstimate,
}: {
  event: ContractEvent;
  gasEstimate: string;
  decodedFunctions: DecodedFunction[];
}) => void | Promise<void>;

export type MulticallValidator = ({
  decodedFunctions,
}: {
  decodedFunctions: DecodedFunction[];
}) => boolean;
