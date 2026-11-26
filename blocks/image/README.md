# Image

Single image with rounded corners from the design system radius tokens.

Create a one-column table headed **Image** and put the picture (with alt text)
in the first row. An optional second row with plain text becomes a caption.
An empty block (no image) renders nothing. Repeated decoration does not
duplicate the figure.

| Variant | Radius |
| --- | --- |
| *(default)* | `--radius-lg` (24px; 16px below 900px) |
| `radius-md` | `--radius-md` |
| `radius-sm` | `--radius-sm` |

The picture is re-optimized through the EDS optimizer (750 px, 2000 px from
600 px viewport width) and loads lazily. Intrinsic width/height are kept to
avoid layout shift.
