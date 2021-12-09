module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname/src,
  },
  ignorePatterns: [
    "/lib/**/*",
    "/.eslintrc.js", // Ignore built files.
    "/scripts**"
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": [1, "single"],
    "import/no-unresolved": 0,
    "object-curly-spacing": [1, "always"],
    "max-len": [2, 120],
    "require-jsdoc": 0,
    "no-explicit-any": 0,
    "explicit-module-boundary-types": 0
  },
};
