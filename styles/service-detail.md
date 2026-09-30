# Service Detail

Author one native Google Doc named `aem-project-implementation` in the site's
`services` folder. Its preview path is `/services/aem-project-implementation`.
Set page Metadata **Template** to `service-detail-page`. Code and content ship
separately; uploading a DOCX alone does not create an EDS page.

Use the existing Hero (services), Section Intro, Client Logos (compact), Columns,
Process, FAQ (first-open), Cards (service, light-panel), Form, and CTA contracts.
Shared Header/Footer are loaded as usual. The template supplies layout, spacing,
and background; other pages do not load its stylesheet.

## Page order and section metadata

Separate sections with a normal `---` paragraph outside the tables. Add a
two-column Section Metadata table after each section's blocks:

| Section | Style |
| --- | --- |
| Hero + snapshot | service-detail-hero |
| Client Logos | service-detail-clients |
| Overview | service-detail-overview |
| Problems | service-detail-challenges |
| Scope | service-detail-scope |
| Process | service-detail-process |
| Outcomes | service-detail-outcomes |
| Case proof | service-detail-proof |
| Why us | service-detail-reasons |
| FAQ | service-detail-faq |
| Related services | service-detail-next |
| Form | service-detail-form |
| Final CTA | service-detail-cta |

Also set **Id** to `service-proof` for the case section and `service-contact` for
the form section. The template reads their rendered `data-id` attributes. These
IDs provide stable destinations for the hero and final audit links. The process
heading is a native Heading 2, giving the final CTA its heading anchor.
Use full preview/live URLs for links in Google Docs, including the page path
before a fragment. EDS adjusts links within the site to relative URLs.

## Snapshot

Use a two-column **Stats (snapshot)** table in the hero section. An optional
`Heading | Engagement snapshot` row precedes the normal `Value | Label` rows.
Example: `8-16 weeks | Typical timeline`. Missing values or labels are skipped.
The heading row is specific to this variant; normal Stats behavior is retained.
Snapshot layout is part of this page template.

## Problems, outcomes, and reasons

Each content row in **Cards (challenge)**, **Cards (outcome)**, or
**Cards (reason)** uses these cells:

| Label or value | Title | Description | Optional impact |
| --- | --- | --- | --- |
| Challenge 01 / -60% / 01 | Plain-text title | Plain-text description | Impact text |

The title is required. Optional cells may be empty; rows without a title are
skipped. Numbers, values, and commercial claims are authored content, not
generated promises. All three variants reuse Cards' responsive grid and semantic
articles. Impact text is informational and does not act as a link.

## Large case proof

Use one two-column **Cards (case, featured-case, placeholder-media)** table:

| Field | Content |
| --- | --- |
| Image | Optional inline image with meaningful alt text |
| Topics | Plain text, for example client and industry |
| Title | Required plain or linked title |
| Summary | Plain-text summary |
| Metric | Value, then label in separate paragraphs |
| Metric | Repeat for additional metrics |
| Link | Optional CTA with an approved destination |

The card supports any number of metrics. Empty optional fields are omitted.
Metric rows need both a value and a label; incomplete metrics are skipped.
Without an image, `placeholder-media` reserves the media area without downloading
a fake image. Omit that modifier to let an imageless case use the full card width.
Desktop images crop to the content height, so portrait images do not stretch the
card. Without a usable CTA destination, the label remains static text.
Add an actual case URL when it exists; do not link a case CTA to an unrelated page.
Invalid URL schemes are rejected, and new-tab links receive safe rel values.

## Overview and scope

**Columns (service-overview)** has one row with two rich-text cells: service
definition, then deliverables. Use Heading 3 for panel headings and native lists
for deliverables. The second panel has the light surface.

**Columns (service-scope)** has a two-cell first row for Architecture & build and
Delivery & run. Merge the cells of a second row for the product heading and native
product list. Keep these as ordinary lists, not manual checkmarks or typed bullets.
Do not put another EDS block table inside either table.

## Responsive behavior and validation

Mobile places the hero before the snapshot, stacks panels/cards, and uses the
existing responsive process and form. Desktop uses a 1200px grid, a side snapshot,
three-column information cards, and a split case proof. Content sets height; long
copy must wrap without clipping. FAQ uses native details/summary controls.

Only a desktop Service Detail export is supplied. Mobile is an adaptation, not a
verified match to a missing mobile frame. The shared header/footer follow their
established authoring documents.

Before release, Preview the native Doc and verify its `.plain.html`: block names,
cell order, separate sections, Template, Style, Id, links, and image alt text.
Then repeat browser checks on the real branch preview. Local fixture checks do
not prove the Google Docs import. Confirm provisional copy, claims, related-page
URLs, and the case image before publishing content.
