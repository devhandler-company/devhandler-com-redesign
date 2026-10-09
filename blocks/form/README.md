# Form

Use the existing key/value table headed **Form (labelled)** for the current Home,
Services and Our Work layouts. The optional `labelled` modifier adds visible field
labels and the design's brace placeholders; ordinary Form tables retain their
earlier appearance. Keep Title, Labels, After Label Text, Submit Label, Endpoint,
Schedule Link and thank-you rows in the document. Endpoint and scheduling URLs
accept only HTTP(S).

Required name, phone, email and consent fields use native validation. A failed
submission announces an alert and allows retry. Success replaces the panel with
the authored confirmation and moves focus to its heading. Test those states with
an intercepted endpoint; local checks do not prove production lead delivery.
