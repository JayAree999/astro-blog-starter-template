const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_ROOT = 'D:/Furniture pics raw';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSET_ROOT = path.join(PROJECT_ROOT, 'public', 'images', 'catalog');
const DATA_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'raw-products.ts');
const imagePattern = /\.(png|jpe?g|webp)$/i;

function listImages(folder) {
  const images = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const fullPath = path.join(folder, entry.name);
    if (entry.isDirectory()) images.push(...listImages(fullPath));
    else if (imagePattern.test(entry.name)) images.push(fullPath);
  }
  return images.sort((a, b) => {
    const aMain = a.includes(`${path.sep}main_images${path.sep}`) ? 0 : 1;
    const bMain = b.includes(`${path.sep}main_images${path.sep}`) ? 0 : 1;
    return aMain - bMain || a.localeCompare(b, undefined, { numeric: true });
  });
}

function readProductInfo(folder, model) {
  const file = path.join(folder, 'info_product.txt');
  if (!fs.existsSync(file)) return { name: `Sunny Furniture model ${model}`, sourceLink: null, verified: false };
  const text = fs.readFileSync(file, 'utf8');
  const name = text.match(/### Product name\s+([\s\S]*?)\s+### Link/i)?.[1]?.trim().replace(/\s+/g, ' ') || `Sunny Furniture model ${model}`;
  const sourceLink = text.match(/### Link\s+(https?:\/\/\S+)/i)?.[1] || null;
  return { name, sourceLink, verified: true };
}

function categoryFor(name) {
  if (/wardrobe/i.test(name)) return 'Wardrobes';
  if (/bed/i.test(name)) return 'Beds';
  if (/tv/i.test(name)) return 'TV stands';
  if (/shoe/i.test(name)) return 'Shoe cabinets';
  if (/table|desk/i.test(name)) return 'Tables and desks';
  if (/storage|bookshelf/i.test(name)) return 'Storage furniture';
  return 'Sunny Furniture';
}

async function main() {
  const products = [];
  const modelFolders = fs.readdirSync(SOURCE_ROOT, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  fs.rmSync(ASSET_ROOT, { recursive: true, force: true });
  fs.mkdirSync(ASSET_ROOT, { recursive: true });

  for (const folderEntry of modelFolders) {
    const model = folderEntry.name;
    const folder = path.join(SOURCE_ROOT, model);
    const sourceImages = listImages(folder).slice(0, 3);
    if (!sourceImages.length) continue;
    const safeModel = model.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const outputFolder = path.join(ASSET_ROOT, safeModel);
    fs.mkdirSync(outputFolder, { recursive: true });
    const info = readProductInfo(folder, model);
    const gallery = [];
    for (let index = 0; index < sourceImages.length; index += 1) {
      const outputName = `${index + 1}.webp`;
      await sharp(sourceImages[index]).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outputFolder, outputName));
      gallery.push({ src: `/images/catalog/${safeModel}/${outputName}`, alt: `${info.name} - image ${index + 1}` });
    }
    products.push({
      slug: safeModel,
      model,
      name: info.name,
      shortName: info.name,
      description: info.verified ? `${info.name}. Product images and available details from Sunny Furniture.` : `Sunny Furniture model ${model}. Please contact the sales team to confirm specifications and availability.`,
      image: gallery[0].src,
      gallery,
      category: categoryFor(info.name),
      material: 'Please contact the sales team to confirm materials, colour, and dimensions before ordering.',
      features: [`Model ${model}`, 'Product photos from the local catalogue', 'Contact sales to confirm details before ordering'],
      availability: 'https://schema.org/InStock',
      indexable: info.verified,
      sourceLink: info.sourceLink,
    });
  }

  products.sort((a, b) => a.model.localeCompare(b.model, undefined, { numeric: true }));
  const source = `// Generated from D:/Furniture pics raw by scripts/importRawCatalog.cjs.\nexport const rawProducts = ${JSON.stringify(products, null, 2)} as const;\n`;
  fs.writeFileSync(DATA_FILE, source, 'utf8');
  console.log(`Imported ${products.length} models and ${products.reduce((total, product) => total + product.gallery.length, 0)} optimized images.`);
}

main().catch((error) => { console.error(error); process.exit(1); });
