export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly"
      }
    },
    plugins: {},
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
