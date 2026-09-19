# Services Root page composition

The existing EDS Metadata table enables this page layout:

| Metadata | |
| --- | --- |
| Template | services-page |
| Title | Adobe Services \| DevHandler |
| Robots | noindex, nofollow |

The shared loader fetches `styles/services.css` only when the body has the authored
`services-page` template class. The stylesheet scopes every rule to that class.
Homepage and Service Detail layouts are not changed.

Section surfaces, including the Services Hero, stay transparent over the shared
page background. Do not add per-section fills or gradients. Cards, the Form card
and the inset CTA retain their own component surfaces.

## Section order

Separate sections with standalone `---` paragraphs. Section Metadata tables use
the existing `Style` field; EDS delivers it as `data-style` on the section.

| Content | Section style |
| --- | --- |
| Hero (services), including optional Breadcrumbs row | — |
| Stats | — |
| Section Intro + Cards (service) | services-catalog |
| Section Intro + Router | services-router |
| Section Intro + Cards (model) | services-models |
| Section Intro + Process | services-process |
| Section Intro + Cards (case, placeholder-media) | services-cases |
| Client Logos (compact) | services-clients |
| Section Intro + FAQ (first-open) | services-faq |
| Form | services-form |
| CTA | services-cta |

Header and Footer remain shared fragments, not tables in this document. The
Services Footer stays solid; the homepage-only footer gradient remains unchanged.

Breadcrumbs are optional in Hero (services): add a row labelled `Breadcrumbs`
whose second cell has one paragraph per crumb. Link ancestors; leave the final
Services crumb plain text. The final crumb receives `aria-current="page"`.

Cards use the existing documented cell contracts. A five-cell Case row can have
an unlinked title when its destination is not yet known. `placeholder-media`
reserves the design's empty image area only where no image was authored. It does
not download a fake image or announce decorative placeholders to screen readers.
Unlinked Model CTA labels remain text, not fake links.

## Content and handoff

The working design repeats Service, Model, Process and FAQ copy. These examples
are intentionally retained pending final content. Case titles and metrics are
design samples; no real case destinations or images are inferred. Unknown Model
and Case destinations remain unlinked. Contact/audit actions use the existing
public Contact us page until distinct destinations are supplied.

The Services Form reuses the existing Form block and homepage configuration.
Endpoint and scheduling URL must be reviewed by the content owner. Browser tests
intercept submission requests; they do not prove production delivery or send real
leads. Its error message uses a live alert, and the Services-only eyebrow color
meets contrast on the white card without restyling the homepage Form.

Import as a native Google Doc named `services`, then Preview using Sidekick.
Full HTTPS links in DOCX avoid the malformed relative URLs observed in earlier
imports. Check the actual `.plain.html` and page after preview; an offline DOCX
fixture is not a substitute for that final Google Docs roundtrip.

Only a desktop Services Root export is available. Mobile/tablet layouts are
responsive adaptations, not claims of pixel parity with an absent mobile design.
