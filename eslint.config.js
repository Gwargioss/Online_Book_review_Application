export default [
  {
    ignores: ["node_modules/**", "client/node_modules/**", "client/dist/**", "client/.vite/**", "dist/**"]
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["client/src/**/*.jsx"],
    rules: {
      "no-unused-vars": "off"
    }
  }
];
