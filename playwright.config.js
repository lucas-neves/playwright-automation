// @ts-check
import { devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();


/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  globalSetup: 'support/globalSetup.js',
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000
  },
  // fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'playwright-report/e2e-junit-results.xml' }]
  ],
  use: {
    viewport: { width: 1366, height: 720 },
    screenshot: 'on',
    video: 'on',
    actionTimeout: 15000,
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    headless: process.env.CI ? true : false,
    launchOptions: {
      // slowMo: 1000,
      args: ['--start-maximized']
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        locale: 'pt-BR',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        locale: 'pt-BR',
        ...devices['Desktop Firefox'],
      },
    },
    // {
    //   name: 'webkit',
    //   use: {
    //     locale: 'pt-BR',
    //     ...devices['Desktop Safari'],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     locale: 'pt-BR',
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     locale: 'pt-BR',
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     locale: 'pt-BR',
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     locale: 'pt-BR',
    //     channel: 'chrome',
    //   },
    // },
  ]
};

module.exports = config;
