# Client Logos

A client-logo list with two bounded desktop marquee rows and a static mobile
grid. One authored roster supplies every viewport. Logos are informational, not
buttons. Client names provide accessible text and image-failure fallbacks.
Decorative motion copies are hidden from assistive technology; the semantic list
announces each client once. Images have empty alt text to avoid repeating names.

## Authoring

Create a three-column Google Docs table. Merge its first row and write
**Client Logos**. Put the section in its own EDS section, normally after case
studies and before services. Use `---` outside the table to separate it from
unrelated section metadata/backgrounds. Do not insert empty spacer rows.

| Client name | Image | Surface (optional) |
| --- | --- | --- |
| Heading | Teams we have delivered AEM for | |
| Whirlpool | /blocks/client-logos/whirlpool.svg | |
| Amana | /blocks/client-logos/amana.svg | Light |

The image cell can contain an inserted image, a link to an image, or a plain asset
path. Image links are asset references, not client website destinations. Prefer
the plain bundled path or an inserted image with responsive EDS sources. The
client name is required; use the company's readable name, not a filename.

`Heading` and `Light` are case-insensitive. The heading is optional. `Light`
provides a light surface for artwork containing dark lettering, without changing
brand colors. Leave it blank for the default surface. Missing or failed images
show the name. Rows without a name are ignored. Reordering rows reorders the
same semantic list at every width.

## Bundled roster

| Name | Asset | Surface |
| --- | --- | --- |
| RX | rx.webp | |
| Whirlpool | whirlpool.svg | |
| KitchenAid | kitchenaid.svg | |
| Amana | amana.svg | Light |
| Maytag | maytag.webp | |
| Helios | helios.webp | |
| Smartcat | smartcat.webp | |
| DHL | dhl.webp | |
| Loterie Nationale | loterie-nationale.svg | |
| SAP | sap.svg | |
| Canadian Tire | canadian-tire.svg | |
| LanguageWire | languagewire.webp | Light |
| Sonova | sonova.webp | |

Prefix these filenames with `/blocks/client-logos/`. Vectors come from supplied
exports, with empty canvas margins trimmed. Complete existing artwork replaces
clipped strip exports. Raster sources use transparent 192x64, 384x128 and 576x192
WebP canvases without upscaling the source artwork. The base path selects 1x/2x/3x
automatically through srcset. SVGs containing raster payloads are not shipped
as fake vector assets. Original artwork is not recolored or recreated.

## Layout, motion and accessibility

- Below 600 px: a static two-column grid with an odd last item centered.
- 600–899 px: a static four-column grid.
- From 900 px: lists of at least 12 clients form two continuous rows moving in
  opposite directions at 40 CSS px/second. Fixed 224 px slots and 40 px gaps keep
  logos readable instead of squeezing every brand into one viewport.
- Shorter lists and reduced-motion mode stay static: four columns at 600–1199 px,
  seven columns from 1200 px. The static roster always includes every client.
- Content width is capped at 1440 px specifically for this block. The desktop
  background fills the section, including ultrawide screens.
- Desktop rows clip at the bounded content area's edges, not the full 4K screen.
  Each visual group repeats once to create a seamless loop. There are no duplicate
  IDs or repeated accessible list entries. Authored order determines row order.
- The design has no animation controls. Hover/focus temporarily pauses the rows;
  movement resumes when the pointer/focus leaves the block.
- `prefers-reduced-motion` disables motion, including when the setting changes
  while the page is open. Mobile never animates.
- There is no persistent pause/stop/hide control, so this design does not satisfy
  WCAG 2.2.2 for continuously moving content. Hover and reduced-motion support do
  not replace that requirement; automated accessibility scores are not proof of it.
- The desktop retains the two-row logo-wall treatment. The mobile design's six
  text placeholders are replaced by the full real-logo list, so its height grows.
  Amana/LanguageWire use light surfaces to keep original dark lettering readable.

All styles are scoped to this block and its EDS container/wrapper. The decorator
imports no other block, adds no dependency and modifies only its input. Animation
uses CSS transforms, without timers, animation-frame callbacks or resize handlers.
Each image has lazy loading, async decoding and a reserved slot. Existing EDS
picture sources are preserved. No client URL click behavior is inferred.

## Validation

Run `npm run lint`, then verify native Google Docs preview as well as browser
fixtures. Check small/wide screens, one/few/many clients, missing names/images,
image failures, long names, repeated decoration, and increased text spacing.
Check both animation directions, loop boundaries, hover/focus,
reduced-motion changes and responsive transitions. Keep both duplicated groups
identical in width so translation by 50% meets the next group without a jump.
Check accessibility for the entire list and section heading. Review shared-page
isolation and above-fold image requests before publishing authored content.
