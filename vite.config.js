import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// qwertxynet.github.io is a GitHub "user site", so it is served from the root.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
