---
name: aem-preview-publish
description: Preview, publish, unpublish or check status of devhandler-com-redesign content (pages, Sidekick library docs, sheets) through the AEM Admin API, using AEM_ADMIN_KEY from the repo's .env.
---

# AEM preview / publish

Site: org `devhandler-company`, site `devhandler-com-redesign`, ref `main`.
Content source: Google Drive. A path is the site path without extension:
`/services/aem-development`, `/tools/sidekick/blocks/cards`; sheets keep `.json`
(`/tools/sidekick/library.json`).

## Key
- `AEM_ADMIN_KEY` lives in `.env` at the repo root (git-ignored, see `.env.example`).
  `AEM_ADMIN_KEY_ID` and `AEM_ADMIN_KEY_EXPIRATION` sit next to it.
- Load it inside the command (`set -a; . ./.env; set +a`). Never print, echo, log,
  commit, stage or paste the key anywhere (chat, files, URLs, PRs).
- 401/403 → key missing, expired or revoked. Stop and point the user to
  README → "AEM Admin API key". Warn when `AEM_ADMIN_KEY_EXPIRATION` is under 30 days away.
- `.env` must never be staged: if `git status` shows it, run `git rm --cached .env`.

## Commands (repo root)

```bash
set -a; . ./.env; set +a
A=https://admin.hlx.page; S=devhandler-company/devhandler-com-redesign/main
H="X-Auth-Token: $AEM_ADMIN_KEY"
curl -s -H "$H" "$A/status/$S/PATH"                                            # status (JSON)
curl -s -X POST -H "$H" "$A/preview/$S/PATH" -o /dev/null -w '%{http_code}\n'  # preview
curl -s -X POST -H "$H" "$A/live/$S/PATH"    -o /dev/null -w '%{http_code}\n'  # publish
curl -s -X DELETE -H "$H" "$A/live/$S/PATH"  -o /dev/null -w '%{http_code}\n'  # unpublish
```

## Rules
- Preview: fine whenever the user asks to preview / roll out to preview.
- Publish and unpublish change the public site: only for paths the user explicitly
  named in this conversation; confirm first if the set is broader.
- After Google Docs edits wait ~20 s before previewing; Drive needs time to export.
- Verify: `curl -s "https://main--devhandler-com-redesign--devhandler-company.aem.page/PATH.plain.html?x=$RANDOM"`
  (live: `.aem.live`). Report one status code per path.
- Code is not previewed here: a pushed branch syncs automatically to
  `https://{branch-with-dashes}--devhandler-com-redesign--devhandler-company.aem.page/PATH`.

## Sidekick library
- Block Doc changed in Drive `/tools/sidekick/blocks/<name>` → preview `/tools/sidekick/blocks/<name>`.
- Section Doc → `/tools/sidekick/sections/<name>`; library sheet → `/tools/sidekick/library.json`.
