# BluBirdy SEO Checklist

Target keyword clusters: **badminton shuttlecocks**, **aeroplane shuttlecocks / aeroplane shuttles**, **feather shuttles**, **badminton birdies / birdies**.

---

## ✅ Done in the theme code (this repo)

- **Product structured data** added to `sections/bb-product.liquid` (Product rich-result schema via Shopify's `structured_data` filter + a `BreadcrumbList`). Previously the live product pages had **no** schema at all.
- **Collection structured data** added to `sections/bb-collection.liquid` (`BreadcrumbList` + `CollectionPage`/`ItemList`).
- **Homepage SEO title + meta description** now always render with keyword-rich fallbacks, configurable under **Theme settings → SEO** (`config/settings_schema.json`, `layout/theme.liquid`).
- **Open Graph / Twitter description** now uses the same fallback (`snippets/meta-tags.liquid`).
- **Organization schema** enriched with a description (`sections/header.liquid`).
- **Copy enrichment** on the homepage (`templates/index.json`) and hero image alt fallback (`sections/bb-hero.liquid`).

> After deploying, validate with Google's Rich Results Test (https://search.google.com/test/rich-results) on a product URL and a collection URL.

---

## 🔧 Must do in Shopify Admin (60–70% of the ranking power lives here)

### 1. Store-wide SEO (Online Store → Preferences)
- **Homepage title** (~60 chars): e.g. `Badminton Shuttlecocks & Aeroplane Feather Shuttles | <Brand>`
- **Meta description** (~155 chars): include *badminton shuttlecocks*, *aeroplane shuttles*, *feather birdies*.
- Verify Google Search Console + Bing Webmaster Tools and submit `/sitemap.xml`.

### 2. Vendor / Brand (so brand shows in Product schema)
- Set each shuttlecock product's **Vendor = `Aeroplane`** (or the real brand). The Product schema pulls `brand` from the vendor.
- Use the brand + model in the **product title**, e.g. `Aeroplane EG1130 Feather Shuttlecocks (Speed 79) – Tube of 12`.

### 3. Product pages (each product → "Edit website SEO")
- **Title tag**: `<Brand> <Model> Badminton Shuttlecocks – Speed XX | <Store>`
- **Meta description**: 1–2 sentences using *badminton shuttlecock / aeroplane shuttle / birdie* naturally.
- **Body description**: 150+ words. Mention feather type (goose), speed, grade, tube quantity, who it's for. Use the words shoppers search ("birdies", "shuttles", "aeroplane").
- **Image ALT text** on every product image: e.g. `Aeroplane EG1130 goose-feather badminton shuttlecock tube`.
- **URL handle**: keep it like `/products/aeroplane-eg1130-feather-shuttlecocks`.

### 4. Collection pages (each collection → "Edit website SEO" + description)
- Add a **real description paragraph** at the top of key collections (badminton shuttlecocks, feather shuttlecocks, aeroplane shuttlecocks). This is huge for ranking collection pages on broad terms.
- In `templates/collection.json`, set `"show_description": true` so that copy renders on-page (currently `false`).
- Give each collection a keyword-rich SEO title + meta description.
- Consider dedicated collections/landing pages for each cluster: *Aeroplane Shuttlecocks*, *Feather Shuttlecocks*, *Nylon/Plastic Shuttlecocks*, *Tournament / Club / Training*.

### 5. Content / blog (builds topical authority + long-tail traffic)
Write a few buyer-intent articles, each targeting a phrase:
- "Best badminton shuttlecocks for club play"
- "Feather vs nylon shuttlecocks – which to buy"
- "What do shuttlecock speed numbers (76–79) mean?"
- "Aeroplane shuttlecocks: speeds, grades and how to choose"
Link from each article to the matching collection/product.

### 6. Technical hygiene
- Make sure products aren't hidden behind out-of-stock auto-redirects.
- Add internal links: footer/menu links to the main collections using anchor text like "Badminton Shuttlecocks" and "Aeroplane Shuttles".
- Get backlinks: list on local club sites, badminton directories, supplier pages.

---

## Quick wins, in priority order
1. Set product **Vendor = Aeroplane** + rewrite product titles/descriptions/alt text. *(admin)*
2. Add **collection descriptions** + flip `show_description` to `true`. *(admin + 1-line theme change)*
3. Fill the **homepage SEO title/description** in Preferences (theme already has fallbacks). *(admin)*
4. Submit sitemap to **Search Console**, then validate **Rich Results**. *(admin)*
5. Publish **2–3 blog posts** on the target phrases. *(admin)*
