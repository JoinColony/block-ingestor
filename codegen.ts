import dotenv from 'dotenv';
import { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config();

const endpoint = `${process.env.AWS_APPSYNC_ENDPOINT}`;

const config: CodegenConfig = {
  schema: [
    {
      [endpoint]: {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.AWS_APPSYNC_KEY ?? '',
        },
      },
    },
  ],
  documents: ['src/**/*.graphql'],
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
      config: {
        nameSuffix: 'Document',
        scalars: {
          AWSDateTime: 'string',
          AWSEmail: 'string',
          AWSURL: 'string',
          AWSTimestamp: 'number',
        },
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write --ignore-unknown'],
  },
};

export default config;
