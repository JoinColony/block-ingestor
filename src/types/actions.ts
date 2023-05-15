export interface ColonyActionInput {
  type: string;
  [key: string]: any;
}

export interface ColonyAction {
  id: string;
  colonyId: string;
  type: string;
  blockNumber: number;
  showInActionsList: boolean;
  initiatorAddress: string;
  isMotion?: boolean;
  motionId?: string;
  recipientAddress?: string;
  amount?: string;
  tokenAddress?: string;
  fromDomainId?: string;
  toDomainId?: string;
  fundamentalChainId?: number;
  newColonyVersion?: number;
  pendingDomainMetadataId?: string;
};
