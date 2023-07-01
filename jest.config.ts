const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: getJestProjects(),
  setupFilesAfterEnv: [
    'node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',
  ],
};
