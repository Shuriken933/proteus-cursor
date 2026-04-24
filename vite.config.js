import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
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
            globals: {
               // Es. se hai dipendenze esterne come 'animejs'
            }
         }
      },
      minify: true
   }
});
