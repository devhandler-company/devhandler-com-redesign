# Home composition

Set Metadata Template to `home-page`. Use native Docs block tables, a standalone
`---` between sections and Section Metadata Style as below. The loader also
recognizes an existing Hero (home). Keep one H1 and native H2/H3 formatting.
Keep an empty paragraph between adjacent block tables and Section Metadata tables:
Google Docs conversion can merge tables that touch. After Preview, check that
`home-services` contains six service cards and `home-blog` contains three insight cards.

| Style | Blocks/content |
| --- | --- |
| home-hero | Hero (home), Content and four Trust rows; omit Background/Badges |
| home-work | Section Intro, Cards (case, placeholder-media) |
| home-clients | Client Logos (roster) |
| home-services | Section Intro, Cards (service) |
| home-partners | Client Logos (roster) |
| home-context | Section Intro, AEM Context (mobile-portrait) |
| home-reviews | Section Intro, Reviews (contained), authored rating paragraph |
| home-blog | Section Intro, Cards (insight, placeholder-media) |
| home-office | Section Intro, inline map image and ordinary legend paragraphs |
| home-process | Section Intro (button), List |
| home-form | Form (labelled), Section Metadata Id `contact-us-form` |

`contained` reviews use the existing scroll/drag/arrow-key carousel without
decorative loop copies or an overlay button. The desktop edge hint clears on
focus or interaction, making every complete testimonial available.
Header and Footer come from their shared documents. Layout follows the October
2026 desktop/mobile originals; unknown copy remains an explicit placeholder.
The office map uses `/icons/office-map.svg`, supplied from the design and kept unchanged.
CSS accounts for its export margins and frames Europe on mobile as in the design.
The home loader replaces the office picture's source with this vector asset;
keep one inline map image in the office section and its meaningful alt text.
Import DOCX as a native Doc, Preview, and inspect actual `.plain.html`
before claiming content integration. Code and document changes ship separately.
