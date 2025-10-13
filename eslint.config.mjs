import openCollectiveConfig from 'eslint-config-opencollective/eslint-node.config.cjs'; // eslint-disable-line n/no-unpublished-import
import globals from 'globals'; // eslint-disable-line n/no-unpublished-import

export default [
  ...openCollectiveConfig,
  {
    ignores: ['**/node_modules/', '**/dist/', '**/coverage/', '**/.nyc_output', '**/.vscode', '**/.history'],
  },
  {
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      'no-console': 'warn',
      'node/no-missing-import': 'off',
      'no-unused-vars': 'off',
    },
  },
];
