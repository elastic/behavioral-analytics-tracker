module.exports = {
  env: {
    browser: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint", "jest"],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
    "no-extra-boolean-cast": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["test/**", "*.test.ts", "*.test.js"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
        "no-undef": "off",
      },
    },
  ],
};
