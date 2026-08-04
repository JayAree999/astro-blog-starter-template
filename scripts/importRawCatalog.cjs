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
  if (!fs.existsSync(file)) return { name: `สินค้าเฟอร์นิเจอร์ รุ่น ${model}`, sourceLink: null, verified: false };
  const text = fs.readFileSync(file, 'utf8');
  const name = text.match(/### Product name\s+([\s\S]*?)\s+### Link/i)?.[1]?.trim().replace(/\s+/g, ' ') || `สินค้าเฟอร์นิเจอร์ รุ่น ${model}`;
  const sourceLink = text.match(/### Link\s+(https?:\/\/\S+)/i)?.[1] || null;
  return { name, sourceLink, verified: true };
}

function categoryFor(name) {
  if (/ตู้เสื้อผ้า|wardrobe/i.test(name)) return 'ตู้เสื้อผ้าและตู้เก็บของ';
  if (/เตียง|bed/i.test(name)) return 'เตียงและชุดห้องนอน';
  if (/ทีวี|tv/i.test(name)) return 'ตู้วางทีวีและชั้นวางทีวี';
  if (/รองเท้า|shoe/i.test(name)) return 'ตู้รองเท้า';
  if (/โต๊ะ|table|desk/i.test(name)) return 'โต๊ะและโต๊ะเครื่องแป้ง';
  if (/ชั้น|ตู้เก็บ|storage|bookshelf/i.test(name)) return 'ชั้นวางและตู้เก็บของ';
  return 'เฟอร์นิเจอร์ Sunny Furniture';
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
      gallery.push({ src: `/images/catalog/${safeModel}/${outputName}`, alt: `${info.name} รุ่น ${model} - ภาพ ${index + 1}` });
    }
    products.push({
      slug: safeModel,
      model,
      name: info.name,
      shortName: info.name,
      description: info.verified ? `${info.name} รุ่น ${model} พร้อมภาพสินค้าและรายละเอียดเบื้องต้นจาก Sunny Furniture` : `เฟอร์นิเจอร์ Sunny Furniture รุ่น ${model} พร้อมภาพสินค้า โปรดสอบถามทีมขายเพื่อยืนยันรายละเอียด`,
      image: gallery[0].src,
      gallery,
      category: categoryFor(info.name),
      material: 'สอบถามทีมขายเพื่อยืนยันวัสดุ สี และรายละเอียดของรุ่นก่อนสั่งซื้อ',
      features: [`รุ่น ${model}`, 'มีภาพสินค้าจากแคตตาล็อก', 'ติดต่อทีมขายเพื่อยืนยันรายละเอียดก่อนสั่งซื้อ'],
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
