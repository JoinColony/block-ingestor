import { WormholeClient } from "@joincolony/clients";

const bridgeEndpoint = process.env.MULTI_CHAIN_BRIDGE_ENDPOINT ?? '';

const client = new WormholeClient(bridgeEndpoint);

export default client;