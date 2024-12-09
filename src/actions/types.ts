import { ContractEvent } from '~types';

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

export const isSimpleActionMatcher = (
  matcher: ActionMatcher,
): matcher is SimpleActionMatcher => 'eventSignatures' in matcher;

export const isFunctionActionMatcher = (
  matcher: ActionMatcher,
): matcher is FunctionActionMatcher => 'matcherFn' in matcher;
