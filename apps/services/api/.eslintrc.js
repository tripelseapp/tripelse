/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [''],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
