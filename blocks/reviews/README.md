# Reviews carousel

The `reviews` block renders a responsive, touch-friendly carousel. Every content
row becomes one review card.

| Reviews | | | |
| --- | --- | --- | --- |
| Review title | Date or engagement period | Review copy | Reviewer photo, followed by name and role in separate paragraphs |

In Google Docs, merge all cells in the `Reviews` row. That structural row
names the block; every row beneath it maps to a card.

Each review row accepts:

1. Review title (required)
2. Date or engagement period (optional)
3. Review copy (optional)
4. Reviewer (optional): photo, followed by name and role in separate paragraphs
   or separated by a line break. `Name - Role` also works. The photo sits beside
   the name and role at the bottom of the card. Use an empty cell when omitted.
   Alternatively, use Cell 4 for the photo and Cell 5 for name/role, or Cells 4,
   5, and 6 for photo, name, and role separately.

The decorator tolerates missing optional cells. Keep the section heading and
other section-level configuration outside this block. Mobile exposes the next
and previous card edges around one primary card. Desktop uses the fixed 421px
card width to show either one or two full cards, with a maximum of four cards in
the viewport when the two dimmed edge cards are included. Initial order starts
with the last card peeking before card one, so four authored cards appear as
`4, 1, 2, 3` on a wide screen. The carousel loops continuously and supports
mouse drag, touch, wheel/trackpad scrolling, and left/right arrow keys when
focused.

Clicking a card advances the carousel by one review, including at the loop
boundary. Each card also has a keyboard-accessible next-review button (Enter or
Space). Dragging does not trigger a click. A block with only one review has no
next-review button.

## Layout configuration

All carousel geometry and behavior is controlled by
`REVIEWS_CAROUSEL_CONFIG` at the top of `reviews.js`. The decorator exposes the
geometry to CSS as `--reviews-*` custom properties and applies `is-mobile` or
`is-desktop`, so the CSS contains no duplicated viewport breakpoint logic.

The main controls are `cardWidth`, `cardHeight`, `gap`, `fadeWidth`,
`desktopBreakpoint`, `wideFullCards`, `compactFullCards`, and
`minimumWideEdgeRatio`. With the defaults, a 1440px track resolves to two fully
visible 421px cards and two partial edge cards beneath the 274px fades.

The block surface is transparent so its section controls the background. Edge
fades default to `--bg-page`; a section with a different surface can set
`--reviews-fade-color` on the block or an ancestor without changing the
carousel logic.

## Local preview

With `npm start` running, open `http://localhost:3000/test/cards-preview.html`.
The fixture uses sample content and covers all reviewer structures above, an
existing three-cell review, and the case-card title font. Files in `test/` are
excluded from deployment by `.hlxignore`.

The regular homepage still uses backend-authored content. Add reviewer data to
that source table and preview the content before expecting the footer there.
