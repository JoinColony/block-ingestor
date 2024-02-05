export enum MetadataDeltaActionType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS ',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS ',
}

export interface AddVerifiedMembersOperation {
  type: MetadataDeltaActionType.ADD_VERIFIED_MEMBERS;
  payload: string[];
}

export type MetadataDeltaOperation = AddVerifiedMembersOperation;
