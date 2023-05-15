module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',
    'no-lone-blocks': 'off',
    'no-useless-return': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
  },
  ignorePatterns: ['codegen.ts', 'src/graphql/generated.ts'],
};
