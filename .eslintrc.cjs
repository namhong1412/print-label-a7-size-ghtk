module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    "node/no-missing-import": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
  },
}
