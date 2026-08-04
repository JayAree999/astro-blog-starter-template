import { products, type Product } from './products';
import { rawProducts } from './raw-products';

export type CatalogProduct = Product & {
	indexable: boolean;
	raw: boolean;
};

const rawByModel = new Map(rawProducts.map((product) => [product.model, product]));
const existingProducts: CatalogProduct[] = products.map((product) => {
	const raw = rawByModel.get(product.model);
	return raw ? { ...product, image: raw.image, gallery: raw.gallery, indexable: true, raw: true } : { ...product, indexable: true, raw: false };
});
const existingModels = new Set(products.map((product) => product.model));
const wardrobeCategory = products.find((product) => product.model === 'D4901')?.category;
const bedCategory = products.find((product) => product.model === 'B5012')?.category;
const importedProducts: CatalogProduct[] = rawProducts
	.filter((product) => !existingModels.has(product.model))
	.map((product) => ({
		...product,
		// The local catalogue uses these model families consistently. Grouping them
		// with the established Thai categories keeps filters and internal links useful.
		category: product.model.startsWith('D') && wardrobeCategory
			? wardrobeCategory
			: product.model.startsWith('B') && bedCategory
				? bedCategory
				: product.category,
		raw: true,
	}));

const categoryPriority = new Map<string, number>([
	[wardrobeCategory ?? '', 0],
	[bedCategory ?? '', 1],
]);

export const catalogProducts = [...existingProducts, ...importedProducts].sort((a, b) => {
	const priorityDifference = (categoryPriority.get(a.category) ?? 2) - (categoryPriority.get(b.category) ?? 2);
	return priorityDifference || a.model.localeCompare(b.model, undefined, { numeric: true });
});
