export type SectionKey = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact' | 'admin'
export type ProductKind = 'men' | 'women' | 'accessories'
export type TextMode = 'light' | 'dark'

export type CatalogItem = {
  id: string
  section: ProductKind
  subsection: string
  name: string
  label: string
  caption: string
  description: string
  priceTop: string
  priceBottom: string
  background: string
  glow: string
  text: TextMode
  imageUrl: string
  published: boolean
  sortOrder: number
}

export type SubsectionConfig = { id: string; label: string }

export const subsectionConfig: Record<ProductKind, SubsectionConfig[]> = {
  men: [
    { id: 'suits', label: 'Suits' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'tuxedos', label: 'Tuxedos' },
    { id: 'overcoats', label: 'Overcoats' },
    { id: 'ceremonial', label: 'Ceremonial' },
  ],
  women: [
    { id: 'pantsuits', label: 'Pantsuits' },
    { id: 'skirt-suits', label: 'Skirt Suits' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'blouses', label: 'Blouses' },
    { id: 'coats', label: 'Coats' },
  ],
  accessories: [
    { id: 'shoes', label: 'Shoes' },
    { id: 'ties', label: 'Ties' },
    { id: 'cuffs', label: 'Cuffs' },
    { id: 'belts', label: 'Belts' },
    { id: 'pocket-squares', label: 'Pocket Squares' },
    { id: 'lapel-pins', label: 'Lapel Pins' },
  ],
}

const item = (
  id: string,
  section: ProductKind,
  subsection: string,
  name: string,
  label: string,
  caption: string,
  description: string,
  priceTop: string,
  priceBottom: string,
  background: string,
  glow: string,
  text: TextMode,
  imageUrl: string,
  sortOrder: number,
): CatalogItem => ({
  id, section, subsection, name, label, caption, description, priceTop, priceBottom,
  background, glow, text, imageUrl, published: true, sortOrder,
})

export const seedCatalog: CatalogItem[] = [
  item('men-suit-black','men','suits','Black Open Suit','Black Suit','Clean line.\nQuiet power.','A clean black open-collar suit finished with lapel jewellery and a confident silhouette.','FROM $1,250','BESPOKE SUIT','#111827','rgba(255,255,255,0.18)','light','/looks/look-06-navy-open-suit.webp',10),
  item('men-suit-pink','men','suits','Pastel Pink Suit','Pastel Suit','Soft tone.\nStrong cut.','A blush tailored jacket styled with dark trousers and a statement flower finish.','FROM $1,350','CUSTOM SUIT','#efc5c9','rgba(255,255,255,0.58)','dark','/looks/look-03-pastel-pink-suit.webp',20),
  item('men-shirt-leopard','men','shirts','Leopard Emblem Shirt','Graphic Shirt','Bold print.\nTailored base.','A clean white shirt with a strong graphic front, styled for a confident statement look.','FROM $320','STATEMENT SHIRT','#f3eadf','rgba(255,255,255,0.65)','dark','/looks/look-01-leopard-shirt.webp',10),
  item('men-shirt-blue','men','shirts','Blue Scarf Shirt','Blue Shirt','Silk movement.\nSharp finish.','A vivid blue shirt with scarf styling, jewellery and polished runway energy.','FROM $240','CUSTOM SHIRT','#0d72ad','rgba(255,255,255,0.20)','light','/looks/look-04-blue-shirt-scarf.webp',20),
  item('men-shirt-teal','men','shirts','Teal Shirt Vest','Teal Shirt','Color shirt.\nClean vest.','A bright teal shirt layered under a black vest with a red floral lapel accent.','FROM $260','CUSTOM SHIRT','#057894','rgba(255,255,255,0.18)','light','/looks/look-07-teal-shirt-vest.webp',30),
  item('men-tuxedo-textured','men','tuxedos','Textured Tuxedo','Tuxedo','Black tie.\nPatterned finish.','A black textured tuxedo jacket with crisp white lapels and formal runway structure.','FROM $1,450','EVENING WEAR','#111111','rgba(255,255,255,0.18)','light','/looks/look-02-textured-tuxedo.webp',10),
  item('men-tuxedo-pattern','men','tuxedos','Diamond Pattern Tuxedo','Pattern Tuxedo','Diamond pattern.\nFormal finish.','A patterned black-and-white tuxedo jacket built for eveningwear, ceremonies and standout entrances.','FROM $1,550','EVENING WEAR','#1a1a1a','rgba(255,255,255,0.18)','light','/looks/look-09-blue-scarf-shirt.webp',20),
  item('men-coat-plaid','men','overcoats','Plaid Long Blazer','Plaid Coat','Layered look.\nModern heritage.','A long plaid tailored layer over denim, finished with a strong floral accent.','FROM $1,600','OUTERWEAR','#25334a','rgba(255,255,255,0.18)','light','/looks/look-05-plaid-blazer.webp',10),
  item('men-coat-leather','men','overcoats','Leather Sleeve Coat','Mixed Coat','Texture mix.\nStrong craft.','A textured coat with leather sleeves, clean shirt styling and bespoke finishing details.','FROM $1,650','OUTERWEAR','#b89a78','rgba(255,255,255,0.38)','dark','/looks/look-08-leather-sleeve-coat.webp',20),
  item('men-ceremony','men','ceremonial','Pattern Ceremony Tuxedo','Ceremony','Formal pattern.\nEvent presence.','A patterned tuxedo direction for ceremonial entrances, formal evenings and statement dressing.','FROM $1,800','CEREMONY','#1a1a1a','rgba(255,255,255,0.18)','light','/looks/look-09-blue-scarf-shirt.webp',10),

  item('women-pantsuit-burgundy','women','pantsuits','Burgundy Tailored Set','Pantsuit','Sharp shape.\nRich tone.','A burgundy tailored women’s look with embroidered layers and polished editorial attitude.','FROM $1,100','CUSTOM FIT','#7f172b','rgba(255,255,255,0.25)','light','/looks/look-10-gold-couture.webp',10),
  item('women-skirt-burgundy','women','skirt-suits','Burgundy Skirt Set','Skirt Suit','Structured skirt.\nLuxury layer.','A burgundy skirt-suit direction with a tailored jacket and embroidered statement detailing.','FROM $980','BESPOKE SET','#7f172b','rgba(255,255,255,0.25)','light','/looks/look-10-gold-couture.webp',10),
  item('women-dress-burgundy','women','dresses','Burgundy Dress Styling','Dress','Rich color.\nEvent ready.','A dress-led women’s look inspired by the burgundy tailored set and ceremonial detailing.','FROM $1,200','OCCASION WEAR','#7f172b','rgba(255,255,255,0.25)','light','/looks/look-10-gold-couture.webp',10),
  item('women-blouse-burgundy','women','blouses','Printed Burgundy Blouse','Blouse','Patterned top.\nClean polish.','A blouse-and-jacket styling direction using the burgundy patterned top as the focal detail.','FROM $260','MADE TO FIT','#7f172b','rgba(255,255,255,0.25)','light','/looks/look-10-gold-couture.webp',10),
  item('women-coat-burgundy','women','coats','Burgundy Embroidered Coat','Coat','Luxury layer.\nCeremony ready.','A structured burgundy embroidered coat for statement entrances and formal occasions.','FROM $1,450','OUTERWEAR','#7f172b','rgba(255,255,255,0.25)','light','/looks/look-10-gold-couture.webp',10),

  item('acc-shoes','accessories','shoes','Formal Shoes','Shoes','Grounded finish.\nPolished step.','A polished footwear finish for complete bespoke styling.','FROM $280','PAIR','#111827','rgba(255,255,255,0.18)','light','/looks/look-06-navy-open-suit.webp',10),
  item('acc-tie-scarf','accessories','ties','Silk Scarf Tie','Tie / Scarf','Neck detail.\nSoft movement.','Scarf and tie styling for shirts, tuxedos and relaxed evening dressing.','FROM $120','SILK','#0d72ad','rgba(255,255,255,0.20)','light','/looks/look-04-blue-shirt-scarf.webp',10),
  item('acc-bow-tie','accessories','ties','Black Bow Tie','Bow Tie','Formal knot.\nBlack-tie finish.','A black bow-tie look for tuxedos, ceremonies and polished evening styling.','FROM $140','SILK','#111111','rgba(255,255,255,0.18)','light','/looks/look-09-blue-scarf-shirt.webp',20),
  item('acc-cuffs','accessories','cuffs','Gold Detail Cuffs','Cuffs','Small detail.\nBig finish.','Cuff and wrist styling details for shirts, tuxedos and ceremonial dressing.','FROM $160','PAIR','#f3eadf','rgba(255,255,255,0.55)','dark','/looks/look-01-leopard-shirt.webp',10),
  item('acc-belt','accessories','belts','Leather Belt Styling','Belt','Clean waist.\nFinished fit.','Belts selected to complete trousers, suiting and casual bespoke looks.','FROM $180','LEATHER','#b89a78','rgba(255,255,255,0.35)','dark','/looks/look-08-leather-sleeve-coat.webp',10),
  item('acc-pocket','accessories','pocket-squares','White Lapel Finish','Pocket Square','Clean fold.\nFormal contrast.','Pocket-square-style details and white accents for tuxedo and eveningwear finishing.','FROM $95','SILK SET','#111111','rgba(255,255,255,0.18)','light','/looks/look-02-textured-tuxedo.webp',10),
  item('acc-lapel-white','accessories','lapel-pins','White Flower Lapel','Lapel Flower','Soft accent.\nClean finish.','A white floral lapel detail for lighter jackets and softer formal styling.','FROM $95','DETAIL','#efc5c9','rgba(255,255,255,0.45)','dark','/looks/look-03-pastel-pink-suit.webp',10),
  item('acc-lapel-red','accessories','lapel-pins','Red Flower Lapel','Lapel Pin','Statement flower.\nLuxury touch.','Floral lapel accents, brooches and finishing pieces for suits and ceremonial looks.','FROM $85','DETAIL','#057894','rgba(255,255,255,0.18)','light','/looks/look-07-teal-shirt-vest.webp',20),
]

export const sectionSizes: Record<ProductKind, string[]> = {
  men: ['S','M','L','XL'],
  women: ['XS','S','M','L'],
  accessories: ['One','Pair','Set','Custom'],
}

export function itemsFor(catalog: CatalogItem[], section: ProductKind, subsection: string) {
  return catalog
    .filter((item) => item.published && item.section === section && item.subsection === subsection)
    .sort((a,b) => a.sortOrder - b.sortOrder)
}


export type ProductRow = {
  id: string
  section: ProductKind
  subsection: string
  name: string
  label: string
  caption: string
  description: string
  price_top: string
  price_bottom: string
  background: string
  glow: string
  text_mode: TextMode
  image_url: string
  published: boolean
  sort_order: number
}

export function fromProductRow(row: ProductRow): CatalogItem {
  return {
    id: row.id,
    section: row.section,
    subsection: row.subsection,
    name: row.name,
    label: row.label,
    caption: row.caption || '',
    description: row.description || '',
    priceTop: row.price_top,
    priceBottom: row.price_bottom,
    background: row.background,
    glow: row.glow,
    text: row.text_mode,
    imageUrl: row.image_url,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export function toProductRow(item: CatalogItem) {
  return {
    section: item.section,
    subsection: item.subsection,
    name: item.name,
    label: item.label,
    caption: item.caption,
    description: item.description,
    price_top: item.priceTop,
    price_bottom: item.priceBottom,
    background: item.background,
    glow: item.glow,
    text_mode: item.text,
    image_url: item.imageUrl,
    published: item.published,
    sort_order: item.sortOrder,
  }
}
