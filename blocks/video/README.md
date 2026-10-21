# Video

Native inline MP4/WebM video. The existing Google Docs table is supported without
changing its header:

`Video (autoplay, muted, loop, cover, aspect-auto, rounded, shadow, no-interactive, no-keyboard, no-context-menu, no-pause, full-width, height-auto)`

| Field | Value |
| --- | --- |
| Source | `/videos/devhandler-animated-02.mp4` (plain text or link) |
| Controls | `none` to hide native controls; otherwise shown |
| Aspect Ratio | `auto` (natural dimensions), `16:9`, `4:3`, or `1/1` |
| Fit | `cover` or `contain` |
| Preload | `auto`, `metadata` (default), or `none` |
| Poster | Optional image or image URL |
| Title | Optional accessible video name |

Videos fill the content column. A 16:9 surface reserves space until native
dimensions are known. `rounded` and `shadow` add the site's medium radius and a
soft shadow; the surface uses existing background and border tokens.

`autoplay` implies muted inline playback. `loop` repeats playback.
`no-interactive` disables pointer interaction and controls, `no-keyboard` removes
the video from the tab order, and `no-context-menu` disables its context menu.
`no-pause` needs no custom handler: a video without controls does not toggle on
click. Native controls become available if autoplay is blocked or reduced motion
is requested. Reduced motion disables automatic playback and pauses the video.

## Source availability

The block does not upload videos or rewrite their host. Relative paths resolve on
the current site. On 21 October 2026 the article's `/videos/devhandler-animated-02.mp4`
returned 404 on the main AEM preview, while
`https://www.devhandler.com/videos/devhandler-animated-02.mp4` redirected to the
production media asset. Use the full production URL in the Source cell when the
file is not available on the preview host, or preview/publish the video asset on
that host. The same applies to the article's other `/videos/` sources.

Missing/invalid sources and media loading errors display a readable message
instead of a blank frame. A media error also provides the authored source link.
