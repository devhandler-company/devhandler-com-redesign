# AEM context

The lower AEM Services composition: problem/solution panels, two engagement
steps and a company quote. This is not a service catalogue or reviews carousel.
Use the existing Section Intro block above it when a section heading is needed.

## Google Docs authoring

Create a two-column table. Merge the first row and name it **AEM Context**.
The remaining rows have a label on the left and content on the right:

| Label | Right-hand cell |
| --- | --- |
| Problem | Normal paragraph for the eyebrow, Heading 3 for the title, then a normal description paragraph. |
| Solution | Normal eyebrow paragraph, Heading 3 title, normal description paragraph. |
| Step | Heading 3 title and normal description. Repeat this row for each step. |
| Step | The second step. Numbers are generated from row order; do not type them into the cell. |
| Quote | Normal quote paragraph(s), including any desired quotation marks. |
| Attribution | Author name and role as a normal paragraph. |
| Portrait | Plain text `/blocks/aem-context/ceo-portrait.webp`, a link to an approved image, or an inserted image. Optional. |
| Link | A link with a meaningful label and the approved destination. Optional. |

Labels are case-insensitive and tolerate repeated spaces and line breaks.
Empty optional rows are omitted. Do not put the title, label and description
into one paragraph: use actual Heading 3 formatting and separate paragraphs.
Do not type Markdown `###` or formatting characters into Google Docs.

Use **Section Intro** separately for the section eyebrow, Heading 2, subtitle
and optional All services link. Place both tables in the same EDS section;
use a normal `---` paragraph outside the tables if a section break is needed.
The EDS-generated `aem-context-container` section owns the shared background and
spacing. Within this section only, Section Intro aligns to the same content grid
as the cards. Other Section Intro instances retain their normal styling; no
cross-block JS import is needed.

Use one Section Intro immediately followed by one AEM Context in a dedicated
section. Do not insert a section break between these tables or add empty paragraphs
as spacers. The section has 40 px top padding and a 40 px intro-to-cards gap below
900 px; both become 64 px on desktop. The unusually large blank space in the mobile
export is not hardcoded as a 200 px spacer. Text can wrap naturally. Without an
intro the section still has its top padding, but no extra intro-to-cards gap.
Keep unrelated content in its own section so it does not inherit this background.

Suggested general copy, independent of any named client:

- Problem or opportunity / **Enterprise scalability**: As corporate global needs
  expand, continuous updates and overhauls can slow down internal delivery pipelines.
- Our solution / **Dedicated AEM engineering**: A dedicated AEM team supports
  component updates, integrations, and ongoing platform improvements.
- **Start the conversation**: Tell us about your platform, priorities, and current
  delivery challenges.
- **Let's talk about goals**: Together, we'll define the scope, delivery approach,
  and next steps.

Use an approved quote and attribution. Do not add promises such as a 24-hour
response unless those are approved business commitments. The sample Read more
destination is not a production booking/contact contract; author the real URL.

## Responsive contract

One table serves all widths. DOM reading order is problem, solution, ordered
steps, then quote and attribution. The desktop layout has two columns; the
content grid is capped at the 1200 px semantic grid, within the 1440 px design
composition. A small bounded portrait/CTA overhang stays inside the viewport.
The background is full-width CSS, not a flattened image.

Below 900 px, the panels and steps stack and the quote uses its compact layout.
The portrait and quote CTA are hidden, matching the supplied mobile reference.
The quote itself is not shortened or duplicated at breakpoints. Cards are static
content, not buttons. Author links remain keyboard-accessible where visible.

The numbered cards are an ordered list. The quote uses blockquote and figcaption
inside a figure. Link focus is visible and new-tab links retain authored rel
values while adding noopener/noreferrer. A quote link without an explicit aria-label
gets its visible label plus the attribution as an accessible name.

## Portrait and loading

`ceo-portrait.webp` is derived from the supplied transparent 3x portrait. Only
fully transparent outer padding and metadata are removed before downsampling;
the person is not recreated or upscaled. The supplied image is 1169x1370 after
trimming. The bundled path automatically selects 1x (390x457), 2x (780x914) or
3x (1169x1370) WebP through srcset; the maximum display size is approximately
390x457 CSS px. Authors continue to use only the base path in the table.

Prefer the plain-text Portrait path: the block generates a responsive picture
with an empty mobile source and lazy loading. This avoids a portrait request on
mobile and defers desktop loading until near the viewport. An image inserted in
Docs also works, but the browser may preload it before the block can replace its
mobile source. The portrait is decorative because the adjacent attribution names
the person. Omitting it does not hide the quote.

## Validation and rollout

Run repository lint and browser checks at narrow mobile, 900 px, 1440 px and an
ultrawide viewport. Check long text/link wrapping, missing rows, repeated decorate,
image failures, keyboard focus and tab order, and absence of horizontal overflow.
No dependencies, animation loop or shared stylesheet changes are required.

After entering the table into a native Google Doc, Preview it with Sidekick and
inspect the actual plain HTML before declaring authoring integration complete.
HTML/DOCX samples are authoring aids, not proof of a Google Docs round-trip.
The block's own images/text must be approved before publishing content.
