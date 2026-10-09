# Case Study

This template presents one case as a business problem, decision, change and
measured result. Authors edit ordinary Google Docs tables, headings, bullet
lists and links. The same content flows into both desktop and mobile layouts.
Header, Footer, Section Intro, Cards, Stats, Columns and CTA reuse the site's
existing blocks. Table and Quote supply the two missing content patterns.

Set document Metadata `Template` to `case-study-page` and `Theme` to
`default-background`. The theme reuses the site's continuous desktop
background. Mobile uses the normal page surface and a dark Hero. Page rules
are scoped to the template; legacy Hero variants keep their existing layout.

## Document location and rollout

In the configured site-root Drive folder, create a folder named `our-work`
alongside the existing `our-work` document. Place a native Google Doc named
`Agribusiness Analytics` in the folder. Its expected route is
`/our-work/agribusiness-analytics`. The existing root document remains the
`/our-work` gallery. Importing DOCX alone is insufficient: open it as Google
Docs, save the native document, then Preview with AEM Sidekick.

Code and content ship independently. Local fixture checks prove decoration
and layout. After native Docs Preview, inspect the real
`/our-work/agribusiness-analytics.plain.html` for block rows, images, lists,
headings and metadata, then repeat browser checks against that markup. A local
feature branch becomes an AEM code preview only after it is pushed.

## Page composition

Each row below describes one section. Use an unformatted `---` paragraph
between sections and a **Section Metadata** table with a `Style` row. A block
table starts with its name merged across the full first row. Headings and link
formatting must be native Docs formatting, not literal Markdown characters.

| Section Style | Authored content |
| --- | --- |
| `case-hero` | Hero (case); see the [Hero guide](../blocks/hero/README.md#case-study-variant). |
| `case-glance` | Native Heading 2 “At a glance”; Cards (outcome, case-metrics), with Label / Value / Description per row; Stats (case-details), with Value / Label per row. |
| `case-problem` | Section Intro: eyebrow / native Heading 2 / description; Columns (case-problem): context and core job in two cells, then a merged row with a native constraint list. |
| `case-decision` | Section Intro; Columns (case-decision): findings with native Heading 3s and paragraphs in the first cell, optional architecture image in the second. |
| `case-changes` | Section Intro; [Table (comparison)](../blocks/table/README.md), with three headings and one full story per row. |
| `case-results` | Section Intro; Table (results), four columns; Columns (case-result-media) with optional image; ordinary measurement note; Columns (case-outcomes) with Heading 3 and list; [Quote](../blocks/quote/README.md). Optional Section Metadata `Id`: `case-results`. |
| `case-cta` | CTA with native Heading 2, description and linked paragraphs. Bold link is primary, italic link secondary. Authors supply approved destinations. |
| `case-related` | Section Intro; Cards (case), using the existing [Case Cards contract](../blocks/cards/README.md). |

Section Intro uses three one-cell rows. Stats uses value first and label second.
Keep the At a glance Heading 2: it supplies the hierarchy for metric Heading 3s
and is visually hidden at all widths. Do not add another Heading 1. Metadata
should also contain an approved Title and Description.

## Media and provisional content

The supplied exports contain different stories: desktop has an agribusiness
headline, a Haleon breadcrumb and pharmaceutical sample metadata. The selected
story remains agribusiness. Mobile uses that same
authored story with the supplied mobile composition. Related cases likewise
remain the same at every width. Shared site Header/Footer and the approved
continuous background are retained.

The development document contains design sample copy, repeated `+18%` and LCP
values, an example testimonial and an independently assembled Haleon reference
mockup using previously supplied product artwork. These are not approved claims about agribusiness.
Replace them with verified case copy, actual measurements and their source,
approved attribution, project artwork and real case destinations before
publishing. Unknown metadata is explicitly “To be confirmed”.

Images belong in Docs, not hardcoded page assets. Hero and testimonial portraits
use the existing EDS optimizer at their component sizes; give each image
meaningful alt text in Docs. The page loader preloads the Hero module for this
template and the display/body font faces for the reviewed templates, alongside
their page and shared CSS.
The Hero illustration is visible at both widths. Desktop waits for the foreground
image; mobile keeps it lazy below the first viewport so it does not delay navigation.

Ordinary links in Hero descriptions, Columns and Table use a brighter semantic
color, underline and visible keyboard focus. Table headings use secondary text
to retain small-text contrast over the page gradient. Buttons keep their own
existing styles and destinations.

`placeholder-media` and
`placeholder-portrait` modifiers support the draft's empty media areas. A
mobile results placeholder reserves the same area as an authored image. The current
document omits Hero's `desktop-media`, displaying its reference artwork on mobile.
Cards without destinations remain informational; add authored case links only
when those documents exist. No fake link or test image URL belongs in a live Doc.

## Verification

Run `npm run lint`. Check at 320, 390, 768 and 1440 px, with long headings,
empty optional cells, missing images and real replacement images. Verify
keyboard focus, mobile navigation, new-tab link safety, heading hierarchy,
native table headers, 200% text sizing and forced colors. Compare every
section with the supplied exports, separating the chosen story and shared
site elements from layout defects. Recheck existing pages when modifying
shared Hero, Columns or the page loader. Performance checks need the final
image assets and real Preview markup before public integration is complete.
