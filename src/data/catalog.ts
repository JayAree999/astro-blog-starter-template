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
const importedProducts: CatalogProduct[] = rawProducts
	.filter((product) => !existingModels.has(product.model))
	.map((product) => ({ ...product, raw: true }));

export const catalogProducts = [...existingProducts, ...importedProducts].sort((a, b) => a.model.localeCompare(b.model, undefined, { numeric: true }));
