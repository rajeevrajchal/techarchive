import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: mdsvex({ extensions: ['.md'] }),
	kit: {
		adapter: adapter(),
		alias: {
			'@styles': './src/styles',
			'@theme': './src/styles/theme',
			'@components': './src/lib/components',
			'@assets': './src/lib/assets',
			'@modules': './src/lib/modules'
		}
	}
};

export default config;
