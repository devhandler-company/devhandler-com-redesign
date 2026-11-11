# Map

A static world map for the About page: the map artwork with its location pins is one
SVG (`/blocks/map/world.svg`) exported from Figma. There is no script, API or tiles.

## Google Docs authoring

Create a two-column table headed **Map** (merge the heading cells). Rows:

| Label | Content |
| --- | --- |
| Image | Plain text `/blocks/map/world.svg` (or an inserted image). |
| Description | Short text for screen readers, e.g. "World map marking client locations in Europe, the UK, the US and the Middle East." |

An empty Image row renders nothing. Without a Description the map is decorative.
The artwork is wider than its frame because its glow bleeds outside; keep the Map in
its own section so the page can clip the overflow (`overflow-x: clip` on the section).

Pin positions in the Figma source are approximate, and the highlighted country was lost
when the original vector group was flattened. Replace `world.svg` when the final artwork is ready.
