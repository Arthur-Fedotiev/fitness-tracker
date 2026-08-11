const { getJestProjectsAsync } = require('@nx/jest');

module.exports = async () => ({
  projects: await getJestProjectsAsync(),
  setupFilesAfterEnv: ['node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js'],
});
