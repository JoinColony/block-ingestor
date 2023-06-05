FROM node:16.16.0

ENV BLOCK_INGESTOR_HASH=e32c79bf0a242703b577daf5806053cc2164f41f

# Clone block ingestor repo
RUN git clone https://github.com/JoinColony/block-ingestor.git block-ingestor
WORKDIR /block-ingestor

RUN echo $BLOCK_INGESTOR_HASH

# Fetch the correct network repo commit/branch/tag
RUN git fetch origin $BLOCK_INGESTOR_HASH
RUN git checkout $BLOCK_INGESTOR_HASH

# Install block ingestor dependencies
RUN npm install

# the command that starts our app
CMD ["npm","run","prod"]
