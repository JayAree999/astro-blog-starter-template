// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://v2.sunny.co.th",
	integrations: [mdx(), sitemap({ filter: (page) => !page.startsWith('/blog') && page !== '/about' })],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
