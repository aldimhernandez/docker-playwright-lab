import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
    features: 'src/tests/features/**/*.feature',
    steps: 'src/tests/steps/**/*.ts',
    importTestFrom: "src/fixtures/Fixtures.ts",
    disableWarnings: { importTestFrom: true },
    statefulPoms: true,
    language: 'en',
});

export default defineConfig({
    testDir,
    retries: 0,
    reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
    use: {
        baseURL: 'https://playwright.dev',
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'off',
    },
    projects: [
        { name: 'chromium', use: devices['Desktop Chrome'] },
        { name: 'firefox', use: devices['Desktop Firefox'] },
        { name: 'webkit', use: devices['Desktop Safari'] },
    ]
});