// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
	site: 'https://v2.sunny.co.th',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const path = new URL(page).pathname;
				return !path.startsWith('/blog/') && path !== '/about/';
			},
		}),
	],
	adapter: cloudflare({
		platformProxy: { enabled: true },
	}),
});
