import { ContractEvent } from '~types';
import { DecodedFunction } from '../multicall';

interface MulticallHandlerParams {
  colonyAddress: string;
  event: ContractEvent;
  decodedFunctions: DecodedFunction[];
}

export type MulticallHandler = ({
  event,
  decodedFunctions,
}: MulticallHandlerParams) => void | Promise<void>;

export type MulticallValidator = ({
  decodedFunctions,
}: {
  decodedFunctions: DecodedFunction[];
}) => boolean;
