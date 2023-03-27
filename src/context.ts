export type ListenerRemover = () => void;

export interface Context {
  listenerRemovers: {
    [key: string]: ListenerRemover;
  };
}

const context: Context = { listenerRemovers: {} };

export default context;
