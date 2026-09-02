# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

## Avoid
- `scripts/aem.js` is vendored. Never edit.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- `buildAutoBlocks` rewrites content before your block runs.
- Authors omit and add cells. Decorate defensively.
- No build step; devDependencies only.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- `fragment/fragment.js` is the only cross-block import. Otherwise use `/scripts/`.

## Outdated
- `fstab.yaml`, `helix-query.yaml`, `paths.json` are retired. Config lives at tools.aem.live.

## Figma tokens
- Use semantic properties from `styles/tokens.css` and type properties from `styles/typography.css`; avoid raw values and primitive tokens when a semantic token exists.
- Use `tokens/figma-variables.json` and `tokens/figma-text-styles.json` only to trace Figma names, modes, and source IDs. These files and their CSS outputs are generated; do not hand-edit them.
- Token exports do not describe component layout. For components such as `Case/Services`, inspect the selected Figma node or screenshot and the authored `.plain.html` markup.
- Re-export only when Figma variables or text styles change.

## Remember
- `npx -y @adobe/aem-cli up`: local code, previewed content.
- Merging `main` ships code; content publishes separately.
- A PR without a `{branch}--{repo}--{owner}.aem.page/{path}` link is rejected.
- All committed files are served. Use `.hlxignore`.
- Skills: `/plugin marketplace add adobe/skills`, then `aem-edge-delivery-services` (24 skills, incl. `docs-search`).
