# Cards block

`cards` supports the existing generic card layout and every card component used on the Figma Redesign v2.2 page: `Card / Case`, `Card / Service`, `Card / Insight`, `Card / Featured post`, and `Card / Model`. Author the section header as a separate component; the card variants do not parse or style section-heading content.

## Case variant

Name the block `Cards (case)`. Every content row represents one case card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Case image with meaningful alt text | Zero or more taxonomy tags (list, separate paragraphs, or comma-separated text) | Required linked case title | Optional statistic 1 | Optional statistic 2 |

The Figma card includes the image. The decorator tolerates an empty image cell so incomplete authoring does not break the page, but the image is required for a design-complete card. Each statistic cell contains two text elements: the value first, then its label. The rendered card uses a semantic `article`, a list for tags, and a definition list for statistics.

## Service variant

Name the block `Cards (service)`. Every content row represents one service card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Card number | Service title | Service description | Relevance label followed by relevance body | Required CTA link |

The service title remains plain text. The CTA retains its authored destination and receives the arrow treatment from the component.

Use `Cards (service, light-panel)` for the Services-page variation whose “Relevant when” panel has the light surface shown in Figma. `Cards (service)` retains the darker mint-tinted panel from the base component.

## Insight variant

Name the block `Cards (insight)`. Every content row represents one article card.

| Cell 1 | Cell 2 | Cell 3 | Cell 4 | Cell 5 |
| --- | --- | --- | --- | --- |
| Article image with meaningful alt text | Category | Publication details, such as date and reading time | Required linked article title | Summary |

The Figma card includes the article image. The decorator tolerates an empty image cell, but the image is required for a design-complete card. The summary may be omitted, but a title is required. Keep the date and reading time in separate paragraphs when you want the component to insert the centered dot separator.

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

## Responsive behavior

- Case cards render in one column on mobile, two on tablet, and three on desktop.
- Service cards render in one column on mobile, two on tablet, and three on desktop.
- Insight and model cards render in one, two, and three columns at the same breakpoints as case cards.
- Featured cards are stacked on mobile and switch to a 50/50 layout from 900px upward.
- All variants share the card surface, border, radius, interaction, and focus styles.

`Card / Review`, `Card / Result`, and `Card / Change` are present on the UI Kit page but are not used on Redesign v2.2, so they are intentionally not production variants.
