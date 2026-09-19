# FAQ

Use a two-column Google Docs table named **FAQ**. Each following row contains a
question and its answer. Use **FAQ (first-open)** to initially expand the first
item, as in the Services Root design. Put the section heading in Section Intro.

Questions render as H3 headings inside native details/summary controls. Enter
and Space toggle an item; Tab moves between controls and any answer links.
Multiple answers can remain open. There are no custom keyboard handlers, generated
IDs, animation dependencies or duplicated ARIA expanded states.

Answer cells retain paragraphs, lists and links. Unsupported or malformed link
destinations become plain text; new-tab links receive safe rel attributes. Rows
without questions are ignored. A question without an answer remains static text,
not an empty toggle. Repeated decoration does not duplicate the content.
