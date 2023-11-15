import {
  ColonyFragment,
  ColonyMetadataFragment,
  ColonyMotionFragment,
  DomainMetadataFragment,
  ExtensionFragment,
  MotionStakesFragment,
  StakerRewardFragment,
  UserMotionStakesFragment,
  VoterRecordFragment,
} from './generated';
export * from './generated';

export type ColonyMotion = ColonyMotionFragment;
export type StakerReward = StakerRewardFragment;
export type DomainMetadata = DomainMetadataFragment;
export type ColonyMetadata = ColonyMetadataFragment;
export type Colony = ColonyFragment;
export type MotionStakes = MotionStakesFragment;
export type UserMotionStakes = UserMotionStakesFragment;
export type VoterRecord = VoterRecordFragment;
export type Extension = ExtensionFragment;
