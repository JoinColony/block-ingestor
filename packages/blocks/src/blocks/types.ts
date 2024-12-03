export type ChainID = string;

export type Block = Awaited<any>;
// @TODO ReturnType<typeof provider.getBlock>
export type BlockWithTransactions = Awaited<any>;
// @TODO ReturnType<typeof provider.getBlockWithTransactions>