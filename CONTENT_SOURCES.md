# Sunny Furniture content sources

This Astro catalog uses only local Sunny source material. The files below were checked on 29 July 2026.

## Product photographs

The catalog images in `public/images/` are byte-for-byte matches for images in `D:\Furniture pics raw`:

| Published image | Raw source file |
| --- | --- |
| `b5009-bed.png` | `D:\Furniture pics raw\B5009\main_images\2.png` |
| `b5012-bed-detail.png` | `D:\Furniture pics raw\B5012\main_images\7.png` |
| `b6055-bed.png` | `D:\Furniture pics raw\B6055\main_images\สมม+ครีม\_.png` |
| `c284-dressing-table.png` | `D:\Furniture pics raw\C284\main_images\_whiteoak.png` |
| `c290-dressing-table.png` | `D:\Furniture pics raw\C290\main_images\4.png` |
| `d1044-wardrobe.png` | `D:\Furniture pics raw\D1044\main_images\2.png` |
| `d4201-wardrobe.png` | `D:\Furniture pics raw\D4201\main_images\New folder\_teak.png` |
| `d4901-wardrobe-black-oak.png` | `D:\Furniture pics raw\D4901\main_images\New folder\6.png` |
| `d4901-wardrobe-detail.png` | `D:\Furniture pics raw\D4901\main_images\New folder (3)\8.png` |
| `d6124-wardrobe.png` | `D:\Furniture pics raw\D6124\main_images\_teak.png` |
| `e4012-tv-stand.png` | `D:\Furniture pics raw\E4012\main_images\New folder\_solidoak.png` |
| `e6201-tv-stand.png` | `D:\Furniture pics raw\E6201\main_images\New folder (2)\4.png` |
| `f302-bookshelf.png` | `D:\Furniture pics raw\F302\main_images\New folder (3)\5.png` |
| `f805-storage-cabinet.png` | `D:\Furniture pics raw\F805\main_images\New folder (3)\_teak.png` |
| `g357-shoe-cabinet.png` | `D:\Furniture pics raw\G357\main_images\5.png` |
| `gs424-shoe-cabinet.png` | `D:\Furniture pics raw\GS424\main_images\New folder (2)\7.png` |
| `tc110-desk.png` | `D:\Furniture pics raw\TC110\main_images\7.png` |
| `tc150-desk.png` | `D:\Furniture pics raw\TC150\main_images\3.png` |

For page-speed delivery, each of these preserved PNG source images has a matching `.webp` derivative in `public/images/`. The catalog and product templates serve WebP; PNG remains the auditable raw-source copy and the social-preview fallback.

## Product copy and pricing reference

- Product names, features, specifications, and image references: `src/data/products.ts`.
- Raw product listing text was verified in `D:\Furniture pics raw\<model>\info_product.txt` where supplied.
- Historic price-list reference (not published as an on-site price because it is dated): `C:\Users\Administrator\Desktop\simplefrontendonlymobileapp-sunny\true_price\P1_pricelist_230626.json`.

## Previous version used for comparison

`C:\Users\Administrator\Desktop\simplefrontendonlymobileapp-sunny\sunnyprice_mobile_optimized_responsive.html` was reviewed. It is a price/booking interface; this Astro version now adds crawlable product URLs, a complete category catalog, descriptive metadata, and structured catalog data.
