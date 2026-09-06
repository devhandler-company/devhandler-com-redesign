# Hero

Home-page hero with one Google Docs table for every viewport. Content remains
in the document; JavaScript only groups it for layout. No animation, video,
carousel, external API, or cross-block dependency is required.

## Authoring

Create a two-column table headed **Hero (home)** (merge the heading cells). Each row
below has a plain-text label in the first cell and content in the second:

| Label | Content |
| --- | --- |
| Background | Paste `/blocks/hero/hero-sphere.webp` as plain text; a hyperlink is not required. A full HTTPS image URL or link also works. An inserted image works too, but the browser may preload it on mobile before decoration. |
| Content | One Heading 1, a normal paragraph, then CTA links in separate paragraphs. Bold links are primary; italic or unformatted standalone links are secondary. |
| Badges | Insert the partner and certification images, in order, with meaningful alt text. Optional. |
| Trust (desktop) | Bold title **Adobe**, then a normal paragraph `Bronze Solution Partner`. This optional row is omitted on mobile, where the badge already conveys the same claim. |
| Trust | Bold title **Clutch**, then `5.0 · 10 reviews`. |
| Trust | Bold title **Certified**, then `Adobe-certified engineers`. |
| Trust | Bold title **NDA**, then `Signed before discovery`. |

The `home` variant is opt-in: plain **Hero** tables retain their original
decoration and styling on other pages. Home selectors are scoped to `.hero.home`;
the wrapper reset applies only to a wrapper containing that variant.

Repeat `Trust` rows as needed. Labels are case-insensitive and tolerate extra
whitespace, line breaks and nonbreaking spaces. Empty optional rows
are omitted. Keep the background in its own row; there is no need for a
second mobile document or duplicated heading. The old single-cell image plus
heading structure remains supported during content rollout.

Heading copy:

> Hey there. We’re {DevHandler}.
> The Adobe consulting company.

Use a soft line break after the first sentence. Bold `{DevHandler}` for the
blue accent. Italic `Adobe` is blue on desktop and white on mobile, as in the
design. Optionally italicize the braces inside the bold phrase for the desktop
blue-to-mint treatment. Formatting affects only the heading, not body copy.

Description:

> We take AEM off your critical path — architecture, delivery and day-to-day
> operations, run by Adobe-certified engineers.

Suggested CTA labels: **Discuss your AEM challenge** and *Book a free AEM audit*.
Set their real destinations in the document. The block does not invent contact
or booking URLs. Use the same labels at all widths; the mobile design omits
“your”, but keeping a single authored link avoids duplicate accessible controls
and responsive content configuration for one word.

Badge assets supplied with this implementation:

- `/blocks/hero/adobe-partner.png`: alt `Adobe Bronze Solution Partner`, 414 × 132
  source pixels, displayed at 138 × 44 CSS pixels.
- `/blocks/hero/adobe-certified.png`: alt `Adobe Certified Expert`, 132 × 132
  source pixels, displayed at 44 × 44 CSS pixels.

Insert images in Docs rather than pasting their URLs as body text. Authors can
replace them with higher-resolution approved assets without changing the code.
The PNGs are separately supplied 3× Figma exports, with metadata stripped but no
resampling. They are not screenshot crops or recreated logos. The sphere WebP
is derived from the separately supplied `circle_1.png`: its dark matte is removed
and the monochrome relief is encoded as transparency. It uses normal compositing,
without CSS masks or blend modes, so rectangular asset edges cannot tint the
page gradient.

Place a normal paragraph containing `---` outside and after the Hero table when
the next block needs its own EDS section. Keep it unformatted. Do not add a
second H1 on the page or use headings for descriptions.

For Google Docs, use actual Heading 1 and bold/italic formatting, not literal
Markdown `#`, `**`, or `*` characters. Insert each badge as an inline image (not
a drawing, floating image, or smart chip), set its alt text, and preserve its
aspect ratio. CTA destinations must be real approved URLs; the local sample
destinations are placeholders. Use a native Google Doc and Preview with Sidekick;
uploading an HTML/DOCX file alone does not publish EDS content.

## Responsive and accessibility contract

- Mobile: badges, heading, description, stacked CTAs, then trust rows. With the
  recommended Background URL row, the desktop image is not fetched below 900 px.
- Tablet: CTAs share a row and trust items use three columns from 600 px.
- Desktop: heading and CTAs first, then badges and four trust columns from
  900 px. Background is full-width, content is capped at the 1200 px semantic
  grid (1440 px composition with 120 px margins). The sphere keeps its natural
  1156 × 793 px frame on ultrawide screens; replacement images fit within that
  decorative frame without stretching.
- Content determines height; longer text wraps without fixed-height clipping.
- Links retain authored URLs, labels and `rel`; new-tab links get `noopener
  noreferrer`. Keyboard focus is visible. There are no scripted key handlers.
- The background is decorative. Provide meaningful alt text for badges; trust
  markers are decorative CSS squares, matching the supplied design.
- Mobile reading order places heading/content before badges in the DOM; badges
  are visually above it. There are no duplicated links or viewport JS listeners.

## Verification and rollout

When this variant is in the first section, the page loader starts only its
above-the-fold font faces early and preloads an authored Background URL for
desktop. Inserted pictures retain their normal responsive sources. A malformed
URL or failed font request must not prevent the page from rendering. Header
space is reserved by the eager stylesheet at its final responsive height.

Run `npm run lint`, then verify the same document at 390 and 1440 px, intermediate
widths, and an ultrawide viewport. Check Tab/Shift+Tab, focus/hover, long copy,
missing optional rows, original single-cell markup, and image failures.

Local fixture screenshots prove layout and decoration, not Google Docs parsing.
After authoring and Preview, inspect `/index.plain.html` and repeat the browser checks
against that actual markup before calling content integration complete. Code
and content publish independently; a local branch is not an AEM branch preview
until it has been pushed.
