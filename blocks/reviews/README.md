# Reviews carousel

The `reviews` block renders a responsive, touch-friendly carousel. Every content
row becomes one review card.

| Reviews | | |
| --- | --- | --- |
| Successful Magento to AEM Migration with $300K annual savings | July 2024 - April 2025 | DevHandler successfully migrated Magento to AEM as a Cloud Service, ensuring zero data loss and improved web performance. The team optimized load times, redesigned the homepage for better UX, and implemented a fully responsive design. Clear documentation simplified future management. The project streamlined operations and saved $300K annually. |
| Successful Magento to AEM Migration with $300K annual savings | July 2024 - April 2025 | DevHandler successfully migrated Magento to AEM as a Cloud Service, ensuring zero data loss and improved web performance. The team optimized load times, redesigned the homepage for better UX, and implemented a fully responsive design. Clear documentation simplified future management. The project streamlined operations and saved $300K annually. |
| Successful Magento to AEM Migration with $300K annual savings | July 2024 - April 2025 | DevHandler successfully migrated Magento to AEM as a Cloud Service, ensuring zero data loss and improved web performance. The team optimized load times, redesigned the homepage for better UX, and implemented a fully responsive design. Clear documentation simplified future management. The project streamlined operations and saved $300K annually. |
| Successful Magento to AEM Migration with $300K annual savings | July 2024 - April 2025 | DevHandler successfully migrated Magento to AEM as a Cloud Service, ensuring zero data loss and improved web performance. The team optimized load times, redesigned the homepage for better UX, and implemented a fully responsive design. Clear documentation simplified future management. The project streamlined operations and saved $300K annually. |

In Google Docs, merge the three cells in the `Reviews` row. That structural row
names the block; every row beneath it maps to a card.

Each review row accepts:

1. Review title (required)
2. Date or engagement period (optional)
3. Review copy (optional)

The decorator tolerates missing optional cells. Keep the section heading and
other section-level configuration outside this block. Mobile exposes the next
and previous card edges around one primary card. Desktop uses the fixed 421px
card width to show either one or two full cards, with a maximum of four cards in
the viewport when the two dimmed edge cards are included. Initial order starts
with the last card peeking before card one, so four authored cards appear as
`4, 1, 2, 3` on a wide screen. The carousel loops continuously and supports
mouse drag, touch, wheel/trackpad scrolling, and left/right arrow keys when
focused.

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
