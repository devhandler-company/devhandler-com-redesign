# Footer

The shared footer loads the Google Doc published at `/footer`. Page metadata
`footer` can point to another fragment. Use ordinary document content, not a
table named **Footer**: a Footer block inside its own fragment would recurse.

Create four sections separated by standalone `---` paragraphs. Start each with
an exact **Heading 2**: `Brand`, `Social`, `Contacts`, or `Legal`. These headings
identify the sections and are removed from the rendered footer. Sections can be
reordered or omitted without shifting the remaining roles. Unrecognized sections
and legacy unstructured fragments remain visible.

- **Brand:** link `:header-logo: DevHandler home`, then a copyright paragraph.
  The existing site logo always links to the local homepage. Copyright is authored,
  not generated from the browser date.
- **Social:** a bulleted list of links such as `:footer-instagram: Instagram`,
  `:footer-facebook: Facebook`, `:footer-linkedin: LinkedIn`, and `:footer-x: X`. Link the entire
  icon token and label. Labels remain available to assistive technology. Links
  without icons display their text, so additional networks do not require JS changes.
  Unlinked icons and labels remain noninteractive tiles until a destination is supplied.
- **Contacts:** a bulleted list of addresses or other contact links. Optional
  `:footer-location:` icons can precede address text inside the link;
  `:footer-email:` and `:footer-phone:` can precede email and phone text. Ordinary
  `mailto:` and `tel:` links are supported without icons. Content and destinations
  are authored; the block does not supply sample phone numbers or email addresses.
- **Legal:** a bulleted list of legal-page links. No hardcoded destinations.

Use full HTTPS URLs in Word import files; relative URLs can be corrupted by Google
Docs import. Convert the imported file into a native Google Doc and preview
`/footer` separately from `/` and `/services`. Code and fragment content deploy
independently. A missing or failed fragment request leaves existing content intact.
Only HTTP(S), email and telephone destinations are accepted. Missing, malformed
or unsupported URLs render as static content; new-tab links receive safe rel values.

Desktop layout follows the detailed 1440px footer export. Mobile uses the same
content in a vertical layout, without accordions, as agreed for this implementation.
The homepage (`/`, `/index`, `/index.html`) uses the blue gradient from the full
homepage export. Other pages, including Services, retain the solid footer surface.
This is a page-specific background; all pages still share the same `/footer` content.
The older full-page mobile export has a different navigation structure and is not
a pixel-parity target. As explicitly agreed, the supplied document retains the
desktop design's sample address, email, phone, copyright and three legal entries,
including the repeated Terms label. These are placeholders, not verified company
contacts. Instagram and LinkedIn use known company destinations; Facebook and X
remain unlinked because their account URLs have not been supplied.
Desktop column spacing and lower-row alignment follow the design.

Instagram and LinkedIn SVG paths are adapted from the read-only reference site's
`icons/social-networks/` assets; colors are adjusted for the white icon tiles.
