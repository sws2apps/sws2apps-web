import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from '@nabla/vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), eslintPlugin()],
	server: {
		port: 4000,
	},
	preview: {
		port: 4000,
	},
});
