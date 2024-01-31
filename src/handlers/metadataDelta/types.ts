export enum OperationType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export enum Entity {
  VERIFIED_MEMBERS = 'verifiedMembers',
}

export interface AddVerifiedMembersOperation {
  type: OperationType.ADD;
  entity: Entity.VERIFIED_MEMBERS;
  colonyAddress: string;
  members: string[];
}

export type MetadataDeltaOperation = AddVerifiedMembersOperation;
