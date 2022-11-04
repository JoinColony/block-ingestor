module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
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
  },
};
