import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const page = (name: string) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        about: page('about.html'),
        artists: page('artists.html'),
        artwork: page('artwork.html'),
        collection: page('collection.html'),
        sell: page('sell.html'),
      },
    },
  },
});
