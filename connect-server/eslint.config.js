/** @type {import("eslint").Linter.FlatConfig[]} */
const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["dist/", "node_modules/"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Node.js globals
        process: "readonly",
        console: "readonly",
        module: "writable",
        exports: "writable",
        require: "readonly",
        Buffer: "readonly",

        // Jest globals
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      semi: "error",
      quotes: ["error", "double"],
      indent: ["error", 2],
      camelcase: ["error", { properties: "always" }],
      "react/jsx-pascal-case": "error",
      "no-unused-vars": "warn"
    }
  },
  prettier
];
