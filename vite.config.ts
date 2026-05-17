import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/chess/**/*.ts'],
			exclude: ['src/chess/__tests__/**', 'src/chess/types.ts'],
			thresholds: {
				lines: 80,
			},
		},
	},
});
