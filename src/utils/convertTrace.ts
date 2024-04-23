import { TransactionResponse } from '@ethersproject/providers';

/**
 * Neither Hardhat nor Truffle support fetching transaction trace in `callTrace` format
 * Alex kindly wrote a util to convert trace from local chain to call trace
 */

interface CallTraceRoot {
  from: string;
  to: string;
  input: string;
  calls: CallTraceNode[];
}

interface CallTraceNode {
  from: string;
  to: string;
  input: string;
  type: string;
  calls: CallTraceNode[];
}

export const convertToCallTrace = (
  trace: any,
  transaction: TransactionResponse,
): CallTraceRoot => {
  const frames = trace.structLogs.filter((x: any) =>
    ['CALL', 'DELEGATECALL', 'STATICCALL', 'RETURN', 'STOP'].includes(x.op),
  );

  // get from, to, input from tx
  const stack = {
    from: transaction.from,
    to: transaction.to ?? '',
    input: transaction.data,
    calls: [] as any[],
  };

  const callHistory: any[] = [];

  let currentPositionInStack = stack;
  // These various positions of arguments on in memory come from https://ethervm.io/
  for (const f of frames) {
    if (f.op === 'CALL') {
      const offset = parseInt(f.stack[f.stack.length - 4], 16);
      const size = parseInt(f.stack[f.stack.length - 5], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);

      // If we delegate called in here, the 'from' address should be where we delegate called from.
      const from =
        // @ts-expect-error
        currentPositionInStack.type === 'DELEGATECALL'
          ? currentPositionInStack.from
          : currentPositionInStack.to;

      currentPositionInStack.calls.push({
        from,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        type: 'CALL',
        calls: [],
      });
      callHistory.push(currentPositionInStack);
      currentPositionInStack =
        currentPositionInStack.calls[currentPositionInStack.calls.length - 1];
    }
    if (f.op === 'DELEGATECALL') {
      const offset = parseInt(f.stack[f.stack.length - 3], 16);
      const size = parseInt(f.stack[f.stack.length - 4], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);

      // If we delegate called in here, the 'from' address should be where we delegate called from.
      const from =
        // @ts-expect-error
        currentPositionInStack.type === 'DELEGATECALL'
          ? currentPositionInStack.from
          : currentPositionInStack.to;

      currentPositionInStack.calls.push({
        from,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        type: 'DELEGATECALL',
        calls: [],
      });
      callHistory.push(currentPositionInStack);
      currentPositionInStack =
        currentPositionInStack.calls[currentPositionInStack.calls.length - 1];
      // A delegate call shouldn't change where we call from in the future.
    }
    if (f.op === 'STATICCALL') {
      const offset = parseInt(f.stack[f.stack.length - 3], 16);
      const size = parseInt(f.stack[f.stack.length - 4], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);

      // If we delegate called in here, the 'from' address should be where we delegate called from.
      const from =
        // @ts-expect-error
        currentPositionInStack.type === 'DELEGATECALL'
          ? currentPositionInStack.from
          : currentPositionInStack.to;

      currentPositionInStack.calls.push({
        from,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        type: 'STATICCALL',
        calls: [],
      });
      callHistory.push(currentPositionInStack);
      currentPositionInStack =
        currentPositionInStack.calls[currentPositionInStack.calls.length - 1];
    }
    if (f.op === 'RETURN' || f.op === 'STOP') {
      // These are the same from our perspective, the only difference is whether they return data or not
      if (callHistory.length === 0) {
        break;
      }
      currentPositionInStack = callHistory.pop();
    }
  }

  return stack;
};
