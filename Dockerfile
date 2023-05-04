FROM node:16.16.0

ENV BLOCK_INGESTOR_HASH=006484c7c787a25c1dd05ee147ba95398205d16d

# Clone block ingestor repo
RUN git clone https://github.com/JoinColony/block-ingestor.git block-ingestor
WORKDIR /block-ingestor

RUN echo $BLOCK_INGESTOR_HASH

# Fetch the correct network repo commit/branch/tag
RUN git fetch origin $BLOCK_INGESTOR_HASH
RUN git checkout $BLOCK_INGESTOR_HASH

# Install block ingestor dependencies
RUN npm install

# Set up .env file
RUN echo "STATS_PORT=$STATS_PORT\n" \
  "VERBOSE_OUTPUT=$VERBOSE_OUTPUT\n" \
  "CHAIN_NETWORK=$CHAIN_NETWORK\n" \
  "CHAIN_RPC_ENDPOINT=$CHAIN_RPC_ENDPOINT\n" \
  "CHAIN_NETWORK_CONTRACT=$CHAIN_NETWORK_CONTRACT\n" \
  "AWS_APPSYNC_ENDPOINT=$AWS_APPSYNC_ENDPOINT\n" \
  "AWS_APPSYNC_KEY=$AWS_APPSYNC_KEY\n" > .env

# the command that starts our app
CMD ["npm","run","prod"]
