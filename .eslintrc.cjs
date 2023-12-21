module.exports = {
  root: true,
  extends: [
    "plugin:@logicer/recommended-typescript",
    "plugin:@logicer/recommended-jsdoc",
    "plugin:@logicer/deprecation",
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
  rules: {
    "import/no-unresolved": [
      "error",
      {
        // Regex
        ignore: [
          "\\$app/environment",
          "\\$app/forms",
          "\\$app/navigation",
          "\\$app/paths",
          "\\$app/stores",
          "\\$env/dynamic/private",
          "\\$env/dynamic/public",
          "\\$env/static/private",
          "\\$env/static/public",
          "\\$service-worker"
        ]
      }
    ]
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser"
      },
      rules: {
        "jsdoc/require-file-overview": "off",

        "import/no-mutable-exports": "off",
        "import/unambiguous": "off"
      }
    },
    {
      files: ["src/**/*"],
      rules: {
        "n/no-missing-import": "off",
        "n/prefer-global/process": ["error", "always"]
      }
    }
  ]
};
