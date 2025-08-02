const { getJestProjectsAsync } = require('@nx/jest');

export default async () => ({
  projects: await getJestProjectsAsync(),
  setupFilesAfterEnv: [
    'node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',
  ],
});
