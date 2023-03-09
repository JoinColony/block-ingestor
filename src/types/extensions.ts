interface VotingReputationParams {
  requiredStake: string;
  minimumStake: string;
}

export interface CreateExtensionInput extends Record<string, any> {
  colonyId: string;
  hash: string;
  version: number;
  installedBy: string;
  installedAt: number;
  isDeprecated: boolean;
  isDeleted: boolean;
  isInitialized: boolean;
  extensionConfig: VotingReputationParams | null;
}
