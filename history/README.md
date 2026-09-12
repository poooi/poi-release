# Stable release history

`stable.json` is the website's permanent archive of normal stable tags (`vX.Y.Z`). It is additive across major versions; beta, alpha and special compatibility builds are not included. The current channel Markdown files and `latest.json` remain the source of current release information and are not changed by rebuilding this archive.

Each entry has a version, the original GitHub publication timestamp when one exists, and notes keyed by language. Each note retains its source URL and an explicit `reconstructed` flag. A missing translation means the original was unavailable; consumers should use that entry's English notes, not hide the version or pretend it was translated.

## Sources and reconstruction

- For versions covered by this repository, the newest committed revision of each language's stable Markdown section wins. Sources are pinned to the exact Git commit, preserving later corrections and translations.
- Next, the archived `poooi/website` repository supplies original stable notes and translations from `packages/data/update`, `packages/web/public/update` and `public/update`, in that order. This restores notes back to `v10.3.0`, including the original English, Simplified Chinese and Traditional Chinese `v10.6.0` notes whose GitHub Release body is empty. Sources are pinned to exact commits on `origin/master`; local feature branches are not used.
- The earlier `poooi/poi-server` stable files in `public/update` restore original English, Simplified Chinese and Traditional Chinese notes back to `v7.7.0` (May 2017). These also use exact source commits on `origin/master`. Its older headings use lowercase `poi`, which is accepted alongside `POI`.
- One documented heading correction is applied: in `poi-server` commit `b93238331b89ac77a3f63c97c6a2ae31c410815d`, the new first section of both Chinese files repeats `v10.2.3`. The English file and `latest.json` in that same commit identify it as `v10.2.4`. The importer assigns that section to `v10.2.4`, preserves all prose, and keeps the real `v10.2.3` section intact. Other unresolved duplicate headings fail the import rather than silently dropping text. Older duplicates already superseded by a newer source are ignored; for example, the old website's `v10.9.1` title was corrected in its next release and in `poi-release`.
- Remaining older entries use the original published GitHub Release body from `poooi/poi`. Only a leading heading naming that same version is removed because the website supplies the version heading.
- `v6.0.0` has an empty published release body, including its betas. `v10.2.1` has a normal stable Git tag but no GitHub Release record. Neither has notes in the old website or poi-server stable Markdown history. The server update pointer moves from `v10.2.0` to `v10.2.2`; no original `v10.2.1` publication is inferred. `v10.2.1` states that its update contents are the same as `v10.2.2`, which fixed the build issue without changing product code. This clarification and the concise `v6.0.0` summary live in `reconstructed.json`, with reviewed commit evidence and all four translations. They are explicitly reconstructed summaries, not recovered original text or exhaustive commit lists.
- Publication dates are kept as published, even where an old GitHub Release appears to have been republished later. Ordering is by version, not timestamp. The missing publication timestamp for `v10.2.1` is `null`; no publication date is invented from a Git commit date.
- The original `v4.2.0` body includes a `v4.2.1` subsection. It remains within that original text; no separate tagged release is invented.

## Rebuild

Requirements: Node.js, Git, full local `poi`, `website` and `poi-server` checkouts, the `poi` tags, the remote branch `origin/master` in both historical website repositories, and GitHub CLI access to the public `poooi/poi` releases. The old website and server checkouts default to `../website` and `../poi-server`; optional third and fourth arguments override those paths.

From the repository root:

```sh
node scripts/rebuild-history.mjs ../poi
```

An optional second argument accepts saved JSON Lines containing `tag`, `publishedAt`, `draft`, `url` and `body`, so a reconstruction can be reproduced without another API request:

```sh
gh api 'repos/poooi/poi/releases?per_page=100' --paginate --jq '.[] | {tag: .tag_name, publishedAt: .published_at, draft: .draft, url: .html_url, body: .body}' > releases.jsonl
node scripts/rebuild-history.mjs ../poi releases.jsonl
```

The generator reads committed stable Markdown history, selects the latest text for each version and language, merges it with published release bodies, and applies reviewed reconstructions only where the English original is missing. It fails for unaccounted-for stable tags rather than silently dropping a release. Review and commit the regenerated archive after release notes have been committed, especially at major-version resets. Never reset the archive with the current-major Markdown files.

The website reads `history/stable.json` from `main`. Publish this data before deploying the website consumer; until it is available, the website keeps current notes visible and reports that some history could not be loaded.
