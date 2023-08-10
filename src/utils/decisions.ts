export const getColonyDecisionId = (
  colonyAddress: string,
  txHash: string,
): string => `${colonyAddress}_decision_${txHash}`;
