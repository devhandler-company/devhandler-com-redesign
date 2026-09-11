# Stats

Static statistics in a bordered container. No counter animation, images, links,
or configuration rows are required.

## Google Docs authoring

Insert a two-column table. Merge the first row and name it **Stats**.
Every following row contains a value in the first cell and its label in the
second. Do not add a separate column-heading row.

| Value | Label |
| --- | --- |
| 10+ | Years of experience |
| 7 | Industries of Expertise |
| 45+ | Long-term projects |
| 30+ | Successful projects |

These are sample values from the Services design, not verified company claims.
Authors control the values, labels and order. Use ordinary text, not headings.
Paragraphs, soft breaks and nonbreaking spaces are normalized to spaces so the
same content can wrap naturally at every viewport width. Formatting and links
inside cells become plain text. Rows missing either a value or label are omitted.

Place this table after the Services Hero, outside the Hero table. Use an
unformatted `---` paragraph before Stats to begin its own EDS section and another
after Stats to separate the next section. Keep section-wide decoration separate
from unrelated content. Existing Hero and card blocks need no changes.

The typical four metrics use two columns on small screens and four from 900 px.
Fewer metrics use fewer desktop columns; a single metric centers. Additional metrics wrap. Long values and
labels grow the container rather than being clipped. An empty list has no border.
The centered container uses the site's 1200 px grid with 20 px minimum gutters.
The mobile layout is a responsive adaptation, not a supplied mobile Figma frame.

The output is a definition list, with each label followed by its value in reading
order. CSS presents values above labels. Static metrics add no tab stops or live
announcements; forced-colors mode uses system text instead of the gradient.

For DOCX imports, convert the uploaded file to a **native Google Doc** before
using Sidekick Preview. Inspect the resulting `/services.plain.html` and verify
the branch page before publishing. Local HTML checks alone do not establish a
completed Google Docs roundtrip.
