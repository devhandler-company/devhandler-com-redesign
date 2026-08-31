# DevHandler Redesign

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

`fstab.yaml` also records the Google Drive mount for compatibility with the
traditional document-mode setup. The Configuration Service remains
authoritative for a site registered through AEM Site Admin.

The Drive folder must be shared with `helix@adobe.com` as **Editor** and should
contain native Google Docs named `index`, `nav`, and `footer`. Preview and
publish each document separately with AEM Sidekick before testing the site URL.

Before the first preview, convert the uploaded `index.docx` and `footer.docx`
files to native Google Docs and create a native Google Doc named `nav`. Keep the
names extensionless in Drive: `index`, `nav`, and `footer`.

## First deployment

1. Push `main`. The first commit containing `fstab.yaml` lets AEM Code Sync
   bootstrap the site and its Google Drive content source.
2. Confirm the AEM Code Sync GitHub App explicitly has access to
   `devhandler-company/devhandler-com-redesign`. If the repository was renamed,
   open the app configuration and save its repository selection again.
3. Wait for this code URL to return CSS instead of `404`:
   `https://main--devhandler-com-redesign--devhandler-company.aem.page/styles/styles.css`.
4. In [AEM Site Admin](https://tools.aem.live/tools/site-admin/index.html),
   confirm the site uses this GitHub repository and the intended Google Drive
   folder.
5. Open the preview URL, invoke AEM Sidekick, and select **Add this project**.
6. In Google Drive, preview `nav`, `footer`, and `index`, then publish all three.

If step 3 still returns `404`, Code Sync has not provisioned the renamed
repository. Reconfigure the GitHub App before troubleshooting document content.

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
- `fstab.yaml`: compatibility Google Drive mount

Do not edit `scripts/aem.js`; it is vendored from the Adobe boilerplate.

## Documentation

- [Developer tutorial](https://www.aem.live/developer/tutorial)
- [Set up Google Drive](https://www.aem.live/developer/setup-google-drive)
- [Project anatomy](https://www.aem.live/developer/anatomy-of-a-project)
- [Markup, sections, and blocks](https://www.aem.live/developer/markup-sections-blocks)
