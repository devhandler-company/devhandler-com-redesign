# Router

Compact navigation rows for the Services page. This is a content block, not a
client-side routing system. Each linked row is one native anchor; there are no
click handlers, nested links or dependencies.

## Google Docs authoring

Use a three-column table with a merged first row named **Router**.
Each following row contains:

1. Optional number, such as `01`.
2. Required title, with its destination applied as a normal hyperlink.
3. Optional short description.

Do not add a separate column-heading row. Use ordinary paragraphs, not headings.
Values are plain text; bold/italic formatting is not required. Soft breaks,
paragraph breaks and nonbreaking spaces are normalized for natural wrapping.
Numbering is authored, not generated. Rows without a title are omitted.

The title's first link supplies the destination for the whole row. HTTP(S),
relative paths and fragment links are supported. A missing or invalid destination
renders a static row without an arrow or tab stop, so incomplete authoring never
creates a fake link. The optional number and arrow are decorative; assistive
technology reads the linked title and description. New-tab links retain their
authored target and receive `noopener noreferrer`.

For DOCX handoffs use complete **HTTPS URLs**, not relative URLs: Google Docs
conversion can turn relative destinations into malformed `http:///...` links.
The block rejects that malformed form. Confirm destinations in the resulting
EDS HTML after importing and converting to a native Google Doc.

## Section heading and layout

Use the existing **Section Intro** table for the overline, H2, description and
optional section CTA. Its four content rows, in order, are: overline, H2,
description, and linked CTA. Keep Section Intro and Router in the **same EDS
section**, with no `---` between their tables. Put an ordinary `---` paragraph
before the section and after Router. Do not duplicate a separator already present.

Router-scoped styles align Section Intro to the 1200 px site grid, allow the
heading to span the available width, and set the heading-to-list spacing. Other
Section Intro instances and component source are unchanged. Router also works
without an intro.

Rows use one column below 900 px and two above, following authored row order.
Long text grows the rows rather than being clipped. Hover, active and keyboard
focus states are visible; reduced-motion preferences disable the existing intro
CTA's arrow movement within this section. The mobile composition is an adaptation
of the supplied desktop design, not a separate mobile Figma export.

Preview the native Google Doc with Sidekick, inspect `/services.plain.html`, and
verify actual destinations and layout on the code branch before publishing.
Repeated sample copy in the design is not a final six-item content plan.
