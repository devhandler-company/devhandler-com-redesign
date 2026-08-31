# DevHandler v2

Frontend code for the DevHandler website redesign on Adobe Experience Manager
Edge Delivery Services. Page content is authored in Google Docs.

## Environments

- Preview: https://main--devhandler-com-redesign--devhandler-company.aem.page/
- Live: https://main--devhandler-com-redesign--devhandler-company.aem.live/

## Content-source setup

Create or update the canonical site configuration in
[AEM Site Admin](https://labs.aem.live/tools/site-admin/index.html):

- Organization: `devhandler-company`
- Site: `devhandler-com-redesign`
- Code repository: `devhandler-company/devhandler-com-redesign`
- Content source type: Google Drive
- Content source URL: the private DevHandler Google Drive site-root folder

Keep the content-source URL in AEM configuration rather than the public code
repository. The Drive folder must be shared with `helix@adobe.com` as **Editor**
and should contain native Google Docs named `index`, `nav`, and `footer`.
Preview and publish each document separately with AEM Sidekick before testing
the site URL.

## Installation

```sh
npm ci
```

## Linting

```sh
npm run lint
```

## Local development

```sh
npm start
```

This starts the AEM development proxy at `http://localhost:3000`. It serves code
from this checkout and uses previewed content from the configured EDS site.

## Project structure

- `blocks/`: independently loaded EDS block implementations
- `scripts/`: shared page loading and decoration logic
- `styles/`: global and lazy-loaded styles
- `head.html`: site-wide head markup

Do not edit `scripts/aem.js`; it is vendored from the Adobe boilerplate.

## Documentation

- [Developer tutorial](https://www.aem.live/developer/tutorial)
- [Set up Google Drive](https://www.aem.live/developer/setup-google-drive)
- [Project anatomy](https://www.aem.live/developer/anatomy-of-a-project)
- [Markup, sections, and blocks](https://www.aem.live/developer/markup-sections-blocks)
