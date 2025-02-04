import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'server',  // Use server output to handle dynamic routes
  trailingSlash: 'never'
});
