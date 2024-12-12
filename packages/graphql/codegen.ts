import { CodegenConfig } from '@graphql-codegen/cli';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
    './src/generated.ts': {
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
