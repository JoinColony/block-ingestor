export enum MetadataDeltaOperationType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS',
  MANAGE_TOKENS = 'MANAGE_TOKENS',
}

export interface AddVerifiedMembersOperation {
  type: MetadataDeltaOperationType.ADD_VERIFIED_MEMBERS;
  payload: string[];
}

export interface RemoveVerifiedMembersOperation {
  type: MetadataDeltaOperationType.REMOVE_VERIFIED_MEMBERS;
  payload: string[];
}

export interface ManageTokensOperation {
  type: MetadataDeltaOperationType.MANAGE_TOKENS;
  payload: string[];
}

export type MetadataDeltaOperation =
  | AddVerifiedMembersOperation
  | RemoveVerifiedMembersOperation
  | ManageTokensOperation;
