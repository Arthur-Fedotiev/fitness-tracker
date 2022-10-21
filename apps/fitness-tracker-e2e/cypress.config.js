import admin from 'firebase-admin';
import { defineConfig } from 'cypress';
import { plugin as cypressFirebasePlugin } from 'cypress-firebase';

const config = defineConfig({
  projectId: '6x4xqb',
  videosFolder: './src/videos',
  fileServerFolder: './',
  supportFolder: './src/support',
  screenshotsFolder: './src/screenshots',
  fixturesFolder: './src/fixtures',

  e2e: {
    setupNodeEvents(on, config) {
      cypressFirebasePlugin(on, config, admin);
    },
    baseUrl: 'http://localhost:4200',
    specPattern: './src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
});

export default config;
