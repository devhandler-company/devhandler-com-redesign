# Header authoring

The header reads one `/nav` document and supports distinct, fully authored
desktop and mobile navigation. Keep the sections in this order:

1. Brand: link the `:header-logo:` icon to the home page.
2. Desktop navigation: add the `Desktop navigation` marker followed by its list.
3. Mobile navigation: add the `Mobile navigation` marker followed by its list.
4. Metadata: keep `Robots` set to `noindex, nofollow`.

Use nested list items for dropdown entries. Bold a linked top-level list item to
turn it into an action. The first action in a navigation group is primary and
later actions are secondary.

The markers are authoring labels and are removed before rendering. For a safe
content rollout, a legacy document containing only one unlabelled navigation
list remains supported; that list is used for both desktop and mobile until the
two labelled groups are previewed.

The current design content is:

```text
:header-logo: -> /
---
Desktop navigation
- Adobe Services -> /services
- Services
  - Implementation -> /services/aem-project-implementation
  - Support -> /services
- Blog -> /blog/
- Our Work -> /our-work
- About Us -> https://www.devhandler.com/about
- Contact us -> /#contact-us-form [bold]
---
Mobile navigation
- Adobe Services -> /services
- Services -> /services
- Blog -> /blog
- Our Work -> /our-work
- About Us -> https://www.devhandler.com/about
- Contact us -> /#contact-us-form [bold]
---
Metadata
Robots | noindex, nofollow
```

The mobile menu locks page scrolling and makes the main/footer inert while open.
Tab and Shift+Tab stay inside the menu; Escape closes it and returns focus to the
toggle. Following a link restores page interaction. Desktop dropdowns support
ArrowDown and Escape in addition to pointer and Tab navigation.
