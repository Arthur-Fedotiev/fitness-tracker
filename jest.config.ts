const { getJestProjects } = require('@nx/jest');

export default {
  projects: getJestProjects(),
  setupFilesAfterEnv: [
    'node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',
  ],
};
