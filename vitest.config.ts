import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    maxConcurrency: 5,
    isolate: false,
  },
});
