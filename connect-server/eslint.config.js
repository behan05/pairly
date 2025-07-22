// eslint.config.js
export default [
  {
    ignores: ['node_modules/**', 'dist/**'], // Gantikan .eslintignore
    files: ['**/*.js'], // Atur file yang di-lint
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
