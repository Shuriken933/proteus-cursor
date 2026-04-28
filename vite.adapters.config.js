import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/**
 * Separate build config for the framework adapter entry points.
 * Each adapter is built as a standalone ES module that:
 *   - externalises its framework peer dependency (react / vue / svelte)
 *   - externalises the core library (proteuscursor)
 *   - emits a single .js file per adapter into dist/
 *
 * The user's own bundler (Vite, webpack, etc.) resolves the externals at
 * app-build time, so no framework code is ever bundled into these files.
 */
export default defineConfig({
   plugins: [
      viteStaticCopy({
         targets: [
            { src: 'src/react.d.ts',   dest: '.' },
            { src: 'src/vue.d.ts',     dest: '.' },
            { src: 'src/svelte.d.ts',  dest: '.' },
         ]
      })
   ],
   build: {
      lib: {
         entry: {
            react:   'src/react.js',
            vue:     'src/vue.js',
            svelte:  'src/svelte.js',
         },
         formats: ['es'],
      },
      rollupOptions: {
         external: ['react', 'vue', 'svelte', 'proteuscursor'],
         output: {
            entryFileNames: '[name].js',
         }
      },
      outDir: 'dist',
      emptyOutDir: false,   // Keep the main library build intact
      minify: true,
   }
});
