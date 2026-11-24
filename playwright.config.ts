import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.TEST_PORT || 4399);

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 4,
	reporter: [['list']],
	use: {
		baseURL: `http://127.0.0.1:${PORT}`,
		trace: 'off',
	},
	webServer: {
		command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
		url: `http://127.0.0.1:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
