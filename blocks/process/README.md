# Process

Static numbered steps, authored as one two-column Google Docs table. Merge the
first row and name it **Process**. Each following row contains a required title
and an optional description. Do not add a column-heading row or number column.

Numbers are generated from the visible row order: 01, 02, 03 and so on. Moving,
adding or removing rows keeps the sequence correct. Rows without titles are
omitted. Paragraphs, soft breaks and nonbreaking spaces normalize to spaces;
formatting and links inside the cells become plain text. Authors do not need to
apply heading styles inside the table; step titles render as H3.

Use an existing **Section Intro** table immediately before Process in the same
EDS section. Its four content rows are the overline, H2, description and optional
linked CTA. Keep both tables together, with no `---` between them. Use an ordinary
`---` paragraph before the section and after Process, avoiding duplicate separators.
An existing H2 in the section can replace Section Intro when no intro is needed.

Section Intro layout overrides apply only within the Process section. Other
intro instances, Hero, Stats, Router, Cards and AEM Context source are unchanged.
The grid has one column below 600 px, two from 600 px and four from 900 px, with
a centered 1200 px desktop content area. Longer titles/descriptions grow cards
instead of being clipped; additional steps wrap in normal reading order.

The numbered list uses native OL/LI semantics. Visual numbers are hidden from
assistive technology to avoid duplicating list numbering. Steps have no links,
click handlers, tab stops, hover affordance, connector arrows or animation. The
optional Section Intro CTA is a separate link with visible keyboard focus; its
existing arrow movement is disabled here for reduced-motion preferences.

The supplied desktop working design repeats `Discovery` and truncates its
description. Sample content is not a verified company process: authors must supply
the final step titles and descriptions before publication. The mobile composition
is a responsive adaptation, not a supplied mobile Figma export.

For DOCX imports, convert to a native Google Doc before Sidekick Preview. Any
optional intro CTA should use a complete HTTPS destination, since relative links
can be corrupted during Google Docs conversion. Inspect the real EDS markup and
branch preview after authoring; local fixture checks do not prove that roundtrip.
