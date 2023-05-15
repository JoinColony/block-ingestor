import dotenv from 'dotenv';
import { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config();

const endpoint = `${process.env.AWS_APPSYNC_ENDPOINT}/graphql`;

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
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write --ignore-unknown'],
  },
};

export default config;
