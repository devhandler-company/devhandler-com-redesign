# Blog articles

Existing articles under `/blog/<slug>` are adapted automatically. The shared
`blog-page-template` metadata can stay unchanged. `/blog` remains the listing.
For another path, set page metadata `Template` to `blog-article`.

The old **Blog Hero** table supplies the cover and, when present, its title.
A native Heading 1 in the body takes precedence and moves into the shared
**Hero (blog, article)**. The description comes from the existing page metadata;
intro paragraphs remain in the article. Breadcrumbs are generated as Home / Blog /
the article title. No new breadcrumb table, body block or contents table is needed.

Keep using native headings, paragraphs, links, lists, images, quotes and code.
Consecutive dash-prefixed paragraphs are presented as native bullet lists automatically.
For a boxed note, use a **Callout** table with `Label` and `Body` rows; the body can
contain formatted text and links. No callout conversion is required for existing articles.
Existing Table and Quote blocks still load normally. Native H2 headings generate
the contents links; H3–H6 remain subsections. Existing heading IDs and deep links
are preserved. Images keep their authored sources and aspect ratios; a paragraph
beginning `Figure:` after a standalone image becomes its caption. Tables scroll
within the article on narrow screens. Below 900px, Contents becomes a collapsed
panel above the article; tapping its summary reveals all section links. Selecting
a link collapses the panel and focuses the destination heading. A blue audit
button stays fixed at the bottom, with safe-area padding and space after the footer.
Desktop keeps the sticky contents/share/contact sidebar; share/contact cards are
hidden on mobile. The old Blog Table of Contents placeholder is removed automatically.
The old Blog Lets Talk block reuses the existing CTA decorator and authored copy.

## Attribution

An existing `By Name | Published January 27, 2026` paragraph directly after the H1
moves into the hero. For articles without a byline, add optional page metadata:

| Metadata key | Value |
| --- | --- |
| Author | The actual author’s name |
| Author Image | Optional portrait URL |
| Publication Date | `2026-01-27` (or a full ISO timestamp) |
| Category | Optional topic label |

Metadata takes precedence over the byline. `Published Date`, `article:published_time`,
`article:author`, `article:tag` and `Tags` are also accepted. Author and publication
date are never inferred from a title, writing voice or modification date.
The hero loads the same `/blog/query-index.json` record as Insight cards, matched
by the article's canonical path. The record's first category (or first tag when
category is empty) appears first in the hero metadata row. Indexed reading time
also takes precedence so it agrees with the cards. `Blog Index` metadata can
override the index URL. If that request fails or has no matching record, authored
category/tags and body reading time at 200 words per minute remain available.
An unavailable category is omitted. No portrait
placeholder or invented attribution is displayed.

For a newly authored table, use **Hero (blog, article)** with `Content` (H1 and lead)
and optional `Image` rows. `Breadcrumbs` and `Metadata` rows can override their
automatic counterparts. Place the article body in following EDS sections.

## Local verification

The unstaged `/test/blog-article-ai.html` and `/test/blog-article-headless.html`
fixtures use snapshots of the two existing authored articles, with no body rewrites.
`/test/blog-article-elements.html` covers native lists, figures, quotes, code,
duplicate headings and missing headings. Test files remain excluded from EDS by
the existing `.hlxignore` rule. Run `node test/blog-article.test.cjs` to check content
preservation, hero attribution, desktop/mobile layout, navigation and regressions.
The runner uses Playwright from the installed Codex runtime (or local dependencies).
