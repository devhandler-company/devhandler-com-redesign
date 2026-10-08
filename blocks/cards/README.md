# Cards block

`cards` supports the existing generic card layout and every card component used on the Figma Redesign v2.2 page: `Card / Case`, `Card / Service`, `Card / Insight`, `Card / Featured post`, and `Card / Model`. Author the section header as a separate component; the card variants do not parse or style section-heading content.

## Case variant

Name the block `Cards (case)`. Every content row represents one case card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Case image with meaningful alt text | Zero or more taxonomy tags (list, separate paragraphs, or comma-separated text) | Required linked case title | Optional statistic 1 | Optional statistic 2 |

The Figma card includes the image. The decorator tolerates an empty image cell so incomplete authoring does not break the page, but the image is required for a design-complete card. Each statistic cell contains two text elements: the value first, then its label. The rendered card uses a semantic `article`, a list for tags, and a definition list for statistics.

For the working Services Root mockup, `Cards (case, placeholder-media)` reserves
an empty image area when the first cell is blank. No placeholder file is loaded.
An unlinked title in Cell 3 remains a heading until the real case URL is supplied.

## Service variant

Name the block `Cards (service)`. Every content row represents one service card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Card number | Service title | Service description | Relevance label followed by relevance body | Required CTA link |

The service title remains plain text. The CTA retains its authored destination and receives the arrow treatment from the component.

Use `Cards (service, light-panel)` for the Services-page variation whose “Relevant when” panel has the light surface shown in Figma. `Cards (service)` retains the darker mint-tinted panel from the base component.

## Insight variant

Name the block `Cards (insight)`. Every content row represents one article card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 |
| --- | --- | --- | --- |
| Article image with meaningful alt text | Category, date and reading time on separate lines | Required linked article title | Summary |

The Insight card always reserves its media area, including when the authored
image cell is empty. An empty media slot keeps the card geometry without loading
a placeholder file. The summary may be
omitted, but a title is required. Cell 2 contains the category first, then the date
and reading time in separate paragraphs or lines. Details render with a centered
dot separator. The older five-cell form (image, category, details, title, summary)
and a three-cell form without the image cell remain supported.

When the title has an article link, that native link covers the whole Insight
card, including its media area. It remains a single keyboard target with a focus
ring around the card, and retains normal open-in-new-tab behavior. Unlinked
authored titles remain static until an article URL is supplied.

## Featured post variant

Name the block `Cards (featured)`. The first authored row is normally the only featured card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 | Cell 6 |
| --- | --- | --- | --- | --- | --- |
| Main article image with meaningful alt text | Category, then publication details on following lines | Required linked article title | Summary | Author portrait and author text | Required CTA link |

The Figma card contains two images: the main article image in Cell 1 and the author portrait in Cell 5. The decorator tolerates either image being omitted, but both are required for a design-complete card. The card is stacked on mobile and becomes the Figma 50/50 media-and-content layout on desktop.

## Model variant

Name the block `Cards (model)`. Every content row represents one engagement model.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Model label or number | Model title | Description | Benefits as a list or separate paragraphs | Required CTA link |

Benefits render as a semantic list with the Figma mint bullet treatment.

A CTA cell without a usable destination retains its label as static text. Invalid
link schemes are not made clickable; valid new-tab links receive safe rel values.

## Responsive behavior

- Case cards render in one column on mobile, two on tablet, and three on desktop.
- Service cards render in one column on mobile, two on tablet, and three on desktop.
- Insight and model cards render in one, two, and three columns at the same breakpoints as case cards.
- Featured cards are stacked on mobile and switch to a 50/50 layout from 900px upward.
- All variants share the card surface, border, radius, interaction, and focus styles.

## Service Detail variants

`Cards (challenge)`, `Cards (outcome)`, and `Cards (reason)` accept label/value,
required title, optional description, and optional impact text per row. They reuse
the Cards grid and semantic articles without changing existing variants.

`Cards (case, featured-case, placeholder-media)` renders one large case proof
from labelled two-column rows: Image, Topics, Title, Summary, repeated Metric
rows (value and label in separate paragraphs), and Link. All except Title are
optional; unlinked titles and CTA labels remain static. The placeholder reserves
space without requesting an image. This modifier does not change regular cases.

See [Service Detail authoring](../../styles/service-detail.md) for the full page
contract. `Card / Review` and `Card / Change` remain outside these variants.

## Index-driven Insight cards

`Cards (insight)` can render authored rows or load articles from a query index.
Both modes use the same Insight card renderer; Featured remains `Cards (featured)`.
One table serves every width, with six articles initially and six more per click.
Tags are multi-select OR filters. All articles clears all selections; clearing
the last selected topic also returns to all articles. Changing filters resets
the visible batch. Newest first / Oldest first sorting sits to the right of the
topic pills and also resets the batch while retaining selected topics. Load more
focuses the first newly revealed article. No visible heading or result count is
added; result counts are announced to screen readers.

## Google Docs contract

Keep **one** two-column table headed **Cards (insight)** (merged heading cells):

| Label | Value |
| --- | --- |
| queryIndexLink | /blog/query-index.json |
| pageTemplate | blog-page-template |
| countOfArticles | 6 |

Use these labelled configuration rows instead of the authored card rows.
An explicit `queryIndexLink` or `Source` enables index loading. No heading row is needed.
`Source` and `Page size` are aliases for `queryIndexLink` and `countOfArticles`.
Optional `Path prefix` defaults to `/blog/`; `Load more` customizes its label.
URLs can be plain text or links. Remote index endpoints must permit CORS.

Delete the second **Blog Cards (mobile-hidden)** table and its `offset: 6` row.
For safe rollout, the page adapter removes a duplicate mobile-hidden table with
the same source, and `offset` is intentionally ignored: this is one complete
listing whose pagination works at every width. No second mobile document is needed.

## Index fields

Required: `path`, `title`. Optional: `image`, `description`, `category`, `tags`,
`lastModified`, `readingTime` (or `reading-time`), `template`, `robots`.
`tags` accepts a JSON array/string or
comma/semicolon-separated labels. Numeric reading time is rendered as minutes.
Dates must be parseable ISO dates or epoch timestamps; display is UTC.

The Insight cells map to `image`, metadata (`category`, `lastModified` and `readingTime`),
linked `title` using `path`, and `description`. If `category` is absent, the first
tag supplies the card label. All categories/tags still participate in filtering;
they are not concatenated into the card label. `lastModified` is the single date
field for both display and sorting. Its displayed value means last updated;
the date element has a Last updated tooltip. No manually authored publication
date is needed. AEM extracts this timestamp from the document's Last-Modified
response header and refreshes the index when the page is published or reindexed.
Editing a Doc without publishing does not refresh its published index record.
Reading time must be present in the index to appear in the card's details row.

The listing excludes the folder landing page, `/blog/index`, `/blog/search`,
duplicate paths, invalid URLs, external article paths, rows without titles,
and rows marked `noindex`. `pageTemplate` restricts matching templates when set.
It defaults to newest first by lastModified. Undated records stay last in both
sorting directions. Missing timestamps/reading times are not invented.
Missing tags leave All articles as the only filter; populate article
metadata and add its extraction to the index to enable topic controls.

### Enable real topic filters

Topic labels come from article records, not from the landing page's Cards (insight)
table. Records without `category` or `tags` produce only All articles.

1. Add a **Metadata** table at the end of each article Doc. For a single topic,
   add a row `Category | AEM architecture` (use the article's actual topic).
2. In the site's **Index Admin** configuration for `/blog/query-index.json`,
   add the `category` property, extracted from `meta[name="category"]`.
   For multiple topics, use `article:tag` metadata and the built-in `tags`
   property, which extracts `meta[property="article:tag"]` values as an array.
3. Preview/publish the changed articles and run **Reindex**. If the Google Sheets
   query index has a custom output sheet/formula, also include the new fields in
   that output. The indexer writes to `raw_index`; adding an empty column alone
   does not supply topic metadata.
4. Check `/blog/query-index.json`: each article must expose populated `category`
   or `tags`. The block then creates the topic pills automatically.

Sources: [Page metadata](https://www.aem.live/docs/metadata) and
[Indexing](https://www.aem.live/developer/indexing).

The loader follows JSON offset/limit pagination before applying filters. It
handles an empty index, invalid responses, timeout and network failure, and
offers Try again. Values are inserted as text/DOM nodes rather than raw HTML.
Only HTTP(S) image/link URLs are accepted. Hidden cards do not remain keyboard
focusable; images retain native lazy loading. Grid breakpoints stay those of
Insight cards: 1 column below 600px, 2 from 600px, 3 from 1200px.

## Existing document migration

The Blog page loader supports `Hero (blog)` and the older Blog tables.
On `/blog/`, the new `Cards (insight)` composition also loads Blog page spacing.
It loads `styles/blog.css` and supports the legacy document in `index.pdf`:

- Old **Blog Hero** becomes the shared text Hero, preserving authored title/copy.
  For the new composition, replace that table with **Hero (blog)** using the
  [Hero authoring contract](../hero/README.md).
- Keep the authored **Section Intro** / **Cards (featured)** section after Hero.
- Keep one index-configured **Cards (insight)** after the featured section, separated with `---`.
- Old **Blog Cards** is adapted to **Cards (insight)** before block loading;
  no separate Blog Cards component is registered. Rename the table when updating the Doc.
- Old **Blog Lets Talk** becomes shared **CTA**, preserving its heading, body
  and actual link. Prefer a normal **CTA** table for new content.
- Header/Footer stay shared fragments; no tables for them belong in this Doc.

Edit `blog/index` for `/blog/`. A root-level Doc named `blog` serves a separate
`/blog` page. Move the authored new Hero/Featured section into `blog/index` when
ready. Existing article detail pages are not changed by the listing adapter.

## Publishing

The authored page requires a working `/blog/query-index.json` endpoint. Configure
it through the site's Index Admin / Drive settings before publishing the
integrated page. No production fallback, static index data, or inferred tags are
silently substituted by the block. Run `npm run lint` before committing code.
