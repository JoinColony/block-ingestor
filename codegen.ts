import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:20002/graphql': {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'da2-fakeApiId123456',
        },
      },
    },
  ],
  documents: ['src/**/*.graphql'],
  generates: {
    'src/types/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
