import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command }) => ({
   // Dev server serves docs/ — single source of truth for the demo site.
   // Run `npm run dev` and open http://localhost:5173 to see the same page
   // that GitHub Pages publishes at https://shuriken933.github.io/proteus-cursor/
   // Only set for `vite`/`vite serve`: the production lib build (`vite build`)
   // needs the default project root so `build.lib.entry` below still resolves.
   root: command === 'serve' ? 'docs' : undefined,
   server: {
      open: true,
   },

   plugins: [
      viteStaticCopy({
         targets: [
            { src: 'src/proteus-cursor.d.ts', dest: '.' }
         ]
      })
   ],
   build: {
      lib: {
         entry: 'src/proteus-cursor.js',
         name: 'ProteusCursor',
         fileName: (format) => `proteus-cursor.${format === 'es' ? 'es' : 'umd'}.js`,
      },
      rollupOptions: {
         output: {
            banner: `/*! Proteus Cursor v2.2.0 | https://github.com/Shuriken933/proteus-cursor | MIT */`,
            globals: {}
         }
      },
      minify: true
   }
}));
