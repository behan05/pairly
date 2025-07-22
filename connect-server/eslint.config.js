/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ["dist/", "node_modules/"], // pengganti .eslintignore
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      semi: "error",
      quotes: ["error", "double"],
    },
  },
];
