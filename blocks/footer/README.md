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

The October 2026 Main Page exports define one shared footer at 1440 and 390 px.
Every template uses the same opaque surface and fragment. Desktop places the
logo, social tiles and contacts in three columns, with copyright and legal links
below. Mobile stacks these groups; links have comfortable touch targets.
The document keeps the design's explicit `{phone}`, `{email}` and `{address}`
placeholders and authored copyright. Cookie Policy remains static until its page
destination is supplied. Unknown contacts stay static. Instagram and LinkedIn have known destinations; Facebook and X remain
unlinked until their account URLs are supplied.

Instagram and LinkedIn SVG paths are adapted from the read-only reference site's
`icons/social-networks/` assets; colors are adjusted for the white icon tiles.
