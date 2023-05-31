FROM node:16.16.0

COPY . /block-ingestor
WORKDIR /block-ingestor

RUN npm ci

# the command that starts our app
CMD ["npm","run","prod"]
