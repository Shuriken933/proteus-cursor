import { defineConfig } from 'vite';

export default defineConfig({
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
