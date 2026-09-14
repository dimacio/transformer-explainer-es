import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				// loadPaths: necesario desde Vite 7, que ya no resuelve las
				// rutas de sass relativas a la raíz del proyecto.
				loadPaths: ['.'],
				// @use en lugar de @import, que Dart Sass 3 elimina.
				additionalData: `@use 'src/styles/variables.scss' as *;`
			}
		}
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	}
});
