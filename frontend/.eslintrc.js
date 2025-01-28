/** @type {import('eslint').Linter.Config} */
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser', // Add parser for TypeScript if you're using it
  parserOptions: {
    ecmaVersion: 2020, // Use ECMAScript 2020 features
    sourceType: 'module', // Allow ES modules syntax (import/export)
    ecmaFeatures: {
      jsx: true, // Enable JSX if you're using React
    },
  },
  extends: ['plugin:@tanstack/query/recommended', 'plugin:prettier/recommended', 'plugin:tailwindcss/recommended'],
  settings: {
    tailwindcss: {
      callees: ['classnames', 'clsx', 'ctl', 'cn'],
      config: path.join(__dirname, './tailwind.config.ts'),
    },
  },
  rules: {
    'tailwindcss/no-custom-classname': [
      'warn',
      {
        whitelist: ['bg-dark-300'],
      },
    ],
  },
};
