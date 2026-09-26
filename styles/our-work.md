# Our Work gallery authoring

The page is a native Google Doc named `our-work` at the site root. Set its EDS
Metadata table to `Template | our-work-page` and a meaningful Title. Preview the
document in Sidekick; code alone cannot create or publish the page.

Separate the following sections with standalone `---` paragraphs. Each Style is
an ordinary Section Metadata table with `Style` in the first column. The EDS
pipeline exposes it as `data-style` on the section.

| Section | Authoring |
| --- | --- |
| Introduction | H1 `Our work`, plain paragraph for the description; Style `our-work-hero` |
| Gallery | H2 `Case studies` for screen readers, then `Cards (case, placeholder-media)` with one row per case; Style `our-work-cases` |
| Clients | Existing `Client Logos` with 13 names and assets; Style `our-work-clients` |
| Adobe solutions | H2 with the highlighted phrase italicized, then `Client Logos (compact)` with solution names and optional icon images; Style `our-work-solutions` |
| Contact | Existing `Form` table, using the shared homepage configuration; Style `our-work-form` |

Use the existing [Case card contract](../blocks/cards/README.md): image,
taxonomy, title, and two optional statistic cells. A card with no image may use
`placeholder-media`; without a verified case destination its title remains
plain text. Replace repeated working-design examples with approved cases before
publication. Author real images and accessible descriptions when available.

The solutions list uses the shared Client Logos block: column 1 is the solution
name, column 2 is an optional image or image URL, column 3 is an optional `Light`
surface. A missing image leaves the solution name readable. Do not invent
branding or destinations from the working desktop mockup.

The seven small icon PNGs under `blocks/client-logos/solution-*.png` are
temporary 1x crops derived from the supplied full-page desktop export. Replace
them with approved original assets when available. Two icons have no identified
product label in the reference; confirm their names before final publication.

Header and Footer remain shared fragments. The gallery does not include Case
Study detail pages. Only a desktop Our Work design export exists; mobile and
tablet are responsive adaptations and require browser verification rather than
claims of pixel parity with an absent mobile design.
