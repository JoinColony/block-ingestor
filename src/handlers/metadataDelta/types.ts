export enum MetadataDeltaOperationType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS',
}

export interface AddVerifiedMembersOperation {
  type: MetadataDeltaOperationType.ADD_VERIFIED_MEMBERS;
  payload: string[];
}

export interface RemoveVerifiedMembersOperation {
  type: MetadataDeltaActionType.REMOVE_VERIFIED_MEMBERS;
  payload: string[];
}

export type MetadataDeltaOperation =
  | AddVerifiedMembersOperation
  | RemoveVerifiedMembersOperation;
