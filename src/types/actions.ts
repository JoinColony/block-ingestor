import { ContractEvent } from './events';

/*
 * GraphQL ColonyActionType enum
 */
export enum ColonyActionType {
  MintTokens = 'MINT_TOKENS',
  Payment = 'PAYMENT',
  CreateDomain = 'CREATE_DOMAIN',
  EditDomain = 'EDIT_DOMAIN',
  UnlockToken = 'UNLOCK_TOKEN',
  MoveFunds = 'MOVE_FUNDS',
  ColonyEdit = 'COLONY_EDIT',
  VersionUpgrade = 'VERSION_UPGRADE',
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
}

export type ColonyActionHandler = (event: ContractEvent) => Promise<void>;
