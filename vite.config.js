import { defineConfig } from 'vite';
import viteStaticCopy from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'HTML/*', dest: 'html' },
        { src: 'CSS/*', dest: 'css' },
        { src: 'js/*', dest: 'js' },
        { src: 'json/*', dest: 'json' }
      ]
    })
  ],
  base: '/Exosky/', // Adjust the base to your GitHub repository name
});
