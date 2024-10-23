import { ContractEvent } from '~graphql';

interface BaseActionMatcher {
  handler: (events: ContractEvent[]) => Promise<void>;
}

interface SimpleActionMatcher extends BaseActionMatcher {
  eventSignatures: string[];
}

interface FunctionActionMatcher extends BaseActionMatcher {
  matcherFn: (events: ContractEvent[]) => boolean;
}

export type ActionMatcher = SimpleActionMatcher | FunctionActionMatcher;

export type ActionHandler = (events: ContractEvent[]) => Promise<void>;
