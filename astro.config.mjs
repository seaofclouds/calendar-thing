import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],
  output: 'server',  // Use server output to handle dynamic routes
  adapter: cloudflare(),
  trailingSlash: 'never'
});
