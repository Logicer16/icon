module.exports = {
  root: true,
  extends: [
    "plugin:@logicer/recommended-typescript",
    "plugin:svelte/prettier",
    "plugin:@logicer/recommended-prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@logicer"],
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.*.json"],
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"]
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser"
      }
    }
  ]
};
