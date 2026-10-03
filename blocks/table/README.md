# Table

Author a Google Docs table headed **Table (comparison)** or **Table (results)**.
Merge the block-name row across all columns. The next row contains column
headings; every later row is one complete comparison. Use native paragraphs,
lists and links inside cells. The block preserves that content in a semantic
HTML table and uses the section's Heading 2 as its accessible caption.

Comparison has three columns: The problem, What we changed, The result. On
mobile each row becomes a card, with the authored column names next to their
values. Results has four columns: Metric, Before, After, Why it mattered. Its
first column becomes a row heading. Desktop visually hides metric names to
match the supplied layout; assistive technology retains them. Mobile shows
the metric name above its before/after values and business explanation.

Keep all four Results columns even when a value is unavailable. Missing metric
names use the column label so row headers are never empty. Data values remain
empty; completely blank rows are omitted. A shortened row is padded
with empty cells. Decoration tolerates an omitted table and repeated loading.
Links retain safe destinations and new-tab links receive `noopener noreferrer`.
There is no pagination, sorting, horizontal scroll handler or external data API.

Case Study typography and page placement live in the
[page stylesheet and authoring guide](../../styles/case-study.md).
