// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { rawProducts } from './src/data/raw-products.ts';

const noindexProductPaths = new Set(rawProducts.filter((product) => !product.indexable).map((product) => `/products/${product.slug}/`));

export default defineConfig({
	site: 'https://catalog.sunny.co.th',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const path = new URL(page).pathname;
			return !path.startsWith('/blog/') && path !== '/about/' && path !== '/updates/' && !noindexProductPaths.has(path);
			},
		}),
	],
	adapter: cloudflare({
		platformProxy: { enabled: true },
	}),
});
