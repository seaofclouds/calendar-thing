import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'compile',
    functionPerRoute: true
  }),
  trailingSlash: 'never'
});
