# Form

Use the existing key/value table headed **Form (labelled)** for the current Home,
Services and Our Work layouts. The optional `labelled` modifier adds visible field
labels and the design's brace placeholders; ordinary Form tables retain their
earlier appearance. Keep Title, Labels, After Label Text, Submit Label, Endpoint,
Schedule Link and thank-you rows in the document. Endpoint and scheduling URLs
accept HTTP(S) URLs or relative paths. Use a complete URL such as
`https://example.com/contact` or `/api/contact`. Empty links, brace placeholders
and malformed HTTP(S) URLs leave submission disabled and omit the scheduling link.

Required name, phone, email and consent fields use native validation. A failed
submission announces an alert and allows retry. Success replaces the panel with
the authored confirmation and moves focus to its heading. Test those states with
an intercepted endpoint; local checks do not prove production lead delivery.

## Automatic inclusion

Pages do not author the form. `loadContactForm` in `scripts/scripts.js` loads the
`/fragments/contact-form` document and adds its section to every page, placed
above a closing CTA section when there is one and at the end of the content
otherwise. Edit the form once, in that fragment.

It is skipped for the `/fragments/` and `/tools/` paths, error pages, and pages
whose Template metadata includes `no-form` (for example `case-study-page, no-form`).
A page that still authors its own Form table, or includes the fragment itself,
keeps a single form.

The section takes the template's existing style and anchor id: `home-form` /
`contact-us-form` on Home, `services-form` / `services-contact`,
`our-work-form` / `our-work-contact` and `service-detail-form` /
`service-contact` on those templates, and `contact-us-form` elsewhere.
