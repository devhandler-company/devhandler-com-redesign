# Client Logos

A client-logo list with two full-width desktop marquee rows and a static mobile
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
| BMW AG | bmw.webp | |
| Prinova | prinova.webp | |
| Six Flags | six-flags.webp | |

Prefix these filenames with `/blocks/client-logos/`. Vectors come from supplied
exports, with empty canvas margins trimmed. Complete existing artwork replaces
clipped strip exports. Raster sources use transparent 192x64, 384x128 and 576x192
WebP canvases without upscaling the source artwork. The base path selects 1x/2x/3x
automatically through srcset. SVGs containing raster payloads are not shipped
as fake vector assets. Original artwork is not recolored or recreated.

BMW, Prinova and Six Flags reuse the existing public site's artwork, served by
the reference site as `media_113b8ce2d692d30d325b3bd25f0aec215ce63c334.png`,
`media_1c997017781b8971090954504a2125a2ad23842e5.png` and
`media_140724897e852d2719f0c5175c4d262c060e93445.png`, respectively. The bundled
WebP versions use the same 1x/2x/3x canvas convention as the existing raster roster.

## Compact variant

Use **Client Logos (compact)** for Services Root. It always uses a static grid,
including rosters with 12 or more clients: two columns on mobile, three from
600px, five from 900px. It has no marquee duplicates or blue section background.
The default homepage variant is unchanged. The same three-cell authoring contract
and optional Light surface remain available.

## Layout, motion and accessibility

- Below 600 px: a static two-column grid with an odd last item centered.
- 600–899 px: a static four-column grid.
- From 900 px: lists of at least 12 clients form two continuous rows moving in
  opposite directions at 40 CSS px/second. Fixed 224 px slots and 40 px gaps keep
  logos readable instead of squeezing every brand into one viewport.
- Shorter lists and reduced-motion mode stay static: four columns at 600–1199 px,
  seven columns from 1200 px. The static roster always includes every client.
- From 900 px the rows reach both viewport edges without a width cap or wrapper
  padding, including ultrawide screens. Mobile keeps its 20 px side gutters;
  the desktop heading also retains a text inset independently of the rows.
- Desktop rows clip at the viewport edges. Each visual group repeats its roster
  enough times to cover the container, then repeats once for a seamless loop.
  A ResizeObserver updates copies only when the required repetition count changes.
  There are no duplicate
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
uses CSS transforms, without timers or animation-frame callbacks.
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
