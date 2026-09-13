# Stable release history

`stable.json` is the website's permanent archive of normal stable tags (`vX.Y.Z`). It is additive across major versions; beta, alpha and special compatibility builds are not included. The current channel Markdown files and `latest.json` remain the source of current release information and are not changed by rebuilding this archive.

Each entry has a version, the original GitHub publication timestamp when one exists, and notes in en-US, ja-JP, zh-CN and zh-TW. Each note retains its source URL and an explicit `reconstructed` flag. Newly translated notes also record `translatedFrom`, identifying the source language; translation alone does not make a note reconstructed. `stable.json` is generated output, not the place to edit release-note prose.

## Sources and reconstruction

- For versions covered by this repository, the newest committed revision of each language's stable Markdown section wins. Sources are pinned to the exact Git commit, preserving later corrections and translations.
- Next, the archived `poooi/website` repository supplies original stable notes and translations from `packages/data/update`, `packages/web/public/update` and `public/update`, in that order. This restores notes back to `v10.3.0`, including the original English, Simplified Chinese and Traditional Chinese `v10.6.0` notes whose GitHub Release body is empty. Sources are pinned to exact commits on `origin/master`; local feature branches are not used.
- The earlier `poooi/poi-server` stable files in `public/update` restore original English, Simplified Chinese and Traditional Chinese notes back to `v7.7.0` (May 2017). These also use exact source commits on `origin/master`. Its older headings use lowercase `poi`, which is accepted alongside `POI`.
- One documented heading correction is applied: in `poi-server` commit `b93238331b89ac77a3f63c97c6a2ae31c410815d`, the new first section of both Chinese files repeats `v10.2.3`. The English file and `latest.json` in that same commit identify it as `v10.2.4`. The importer assigns that section to `v10.2.4`, preserves all prose, and keeps the real `v10.2.3` section intact. Other unresolved duplicate headings fail the import rather than silently dropping text. Older duplicates already superseded by a newer source are ignored; for example, the old website's `v10.9.1` title was corrected in its next release and in `poi-release`.
- Remaining older entries use the original published GitHub Release body from `poooi/poi`. Only a leading heading naming that same version is removed because the website supplies the version heading.
- `v6.0.0` has an empty published release body, including its betas. `v10.2.1` has a normal stable Git tag but no GitHub Release record. Neither has notes in the old website or poi-server stable Markdown history. The server update pointer moves from `v10.2.0` to `v10.2.2`; no original `v10.2.1` publication is inferred. `v10.2.1` states that its update contents are the same as `v10.2.2`, which fixed the build issue without changing product code. This clarification and the concise `v6.0.0` summary live in `reconstructed.json`, with reviewed commit evidence and all four translations. They are explicitly reconstructed summaries, not recovered original text or exhaustive commit lists.
- Publication dates are kept as published, even where an old GitHub Release appears to have been republished later. Ordering is by version, not timestamp. For `v10.2.1`, use the annotated tag timestamp, `2019-02-11T03:07:39+09:00` (`2019-02-10T18:07:39Z`), because no GitHub Release record exists. This date is maintained in `reconstructed.json`; its evidence includes tag object `c6d3896070d622b9ad29e7d3ced9299e6183dff0`.
- The original GitHub `v4.2.0` body includes a `v4.2.1` subsection; no separate tagged release is invented. The localized archive now uses the recovered v4.2.0 Weibo announcement. The earlier English body remains available in its GitHub Release and the archive's Git history.

## Official Weibo archive

The original Simplified Chinese announcements by 今天poi出新版本了吗 (UID 5726583591) are transcribed in `weibo/vX.Y.Z.md`. `weibo.json` records canonical mobile post links, original image URLs, additional evidence and editorial decisions. Image originals are kept in `weibo/images/`; `weibo/image-sources.json` maps local files to their public sources.

The v6.1.3 cumulative announcement is also transcribed verbatim in `weibo/announcements/3959809202236314.md`. Its changes are assigned to v6.1.1, v6.1.2 and v6.1.3 using the tagged code and original GitHub notes; the broad memory claim is preserved as source text without attributing every memory issue to the resize loop.

Stable notes cover the development cycle since the previous stable version. Beta announcements are source material when a final announcement only lists the final delta; a cumulative final image supersedes repeated beta text. Corrections and removals take precedence. A beta-only regression is not presented as a fix affecting the previous stable. A later patch's changes are not moved into an earlier stable entry. No beta entries are added to `stable.json`.

Original repository translations are retained unless an explicit localization is listed below. Weibo supplies missing Simplified Chinese and the basis for detailed English, Japanese and Traditional Chinese translations. All four v6.0.0 notes now use the recovered announcement, replacing the earlier reconstructed summaries. v7.5.0 combines its beta announcement with a code-verified final resource-display addition and remains explicitly marked reconstructed in all four languages. Transcriptions normalize formatting and remove repeated delta sections; they are not newly invented release notes.

Plugin release details are preserved in each note's optional `pluginMarkdown` field. The website displays only `markdown` (main application changes). Plugin management, compatibility and automatic updating implemented in poi itself remain main application features. The complete source Markdown and images retain the original plugin details.

The currently visible account history begins on 2015-10-17. No Weibo originals for v1–v3 have been recovered. The v4.0.0 release post and screenshots survive, but its linked detailed article no longer opens; its English notes remain in place. See `weibo/unresolved.json` for the surviving sources and the unresolved gap. Publication timestamps remain the original GitHub metadata, not dates inferred from reposts.

## Maintaining translations

Human-maintained translations live in `localized/<version>/<language>.md`, one Markdown file per release and language. `localized/sources.json` lists the source language (`from`) and translated languages for each version. The generator reads these files after collecting originals and inherits the selected original's source URL and reconstruction status. Traditional Chinese is generated from Simplified Chinese using OpenCC; it has no independently maintained Markdown file. Existing original texts and Weibo evidence stay in their original locations; do not duplicate them just to fill a directory.

```text
history/
  localized/
    sources.json
    v6.1.1/
      en-US.md
      ja-JP.md
  weibo/
    v6.1.1.md
    images/
  stable.json
```

The initial localization adds 118 Markdown files across 74 versions: 19 English, 74 Japanese and 25 Simplified Chinese. The 19 Weibo versions use their detailed Chinese announcements rather than the shorter English summaries; other missing languages are translated from the existing Chinese text when available, otherwise English. The earlier English summaries and independent Traditional Chinese translations remain in the source repositories and in [the archive before localization](https://github.com/poooi/poi-release/blob/d03f2831f59a554861a80f65553501f725db489f/history/stable.json).

To correct a translation, edit its Markdown file and rebuild. To add an English, Japanese or Simplified Chinese translation, create its file and add the language to that version's `languages` list in `sources.json`; `from` must name an existing original language, not another translated target. If correcting source wording changes the meaning, update the listed translations in the same change. Reviewers should compare Markdown changes; the JSON diff is the generated result.

Files contain body text only, with `###` section headings; the website supplies the version heading. Keep individual plugin changes under a final `### Plugin updates`, `### プラグイン更新` or `### 插件更新` heading. The generator places that section in `pluginMarkdown`. Keep main application plugin management, compatibility and automatic updates in the main notes. Preserve dates, command-line flags, names, credits and uncertainty in the source; use KanColle terminology for Japanese.

For every archived version, Traditional Chinese is generated directly from the final Simplified Chinese `markdown` and `pluginMarkdown` using the pinned `opencc-js` converter `{ from: 'cn', to: 'twp' }` (Simplified Chinese to Taiwan Traditional Chinese with phrase conversion, corresponding to the s2twp mode). Paragraphs, bullets and wording remain aligned with Simplified Chinese. Do not independently rephrase or manually patch Traditional Chinese, and do not add it to `sources.json`. Correct the Simplified Chinese source and rebuild. The conversion inherits the source URL and reconstruction status and records `translatedFrom: "zh-CN"`.

The 118 initial authored translations were proofread by DeepSeek V4 Flash and checked for bullet completeness, version numbers, command-line flags and source metadata. Traditional Chinese is verified against OpenCC output for every entry. This is a localization of available evidence, not a claim that the missing historical originals have been recovered.

## Rebuild

Requirements: Node.js, Git, full local `poi`, `website` and `poi-server` checkouts, the `poi` tags, the remote branch `origin/master` in both historical website repositories, and GitHub CLI access to the public `poooi/poi` releases. The old website and server checkouts default to `../website` and `../poi-server`; optional third and fourth arguments override those paths.

From the repository root, install the locked conversion dependency once, then rebuild:

```sh
npm ci
node scripts/rebuild-history.mjs ../poi
```

An optional second argument accepts saved JSON Lines containing `tag`, `publishedAt`, `draft`, `url` and `body`, so a reconstruction can be reproduced without another API request:

```sh
gh api 'repos/poooi/poi/releases?per_page=100' --paginate --jq '.[] | {tag: .tag_name, publishedAt: .published_at, draft: .draft, url: .html_url, body: .body}' > releases.jsonl
node scripts/rebuild-history.mjs ../poi releases.jsonl
```

The generator reads committed stable Markdown history, selects the latest text for each version and language, merges it with published release bodies, fills missing Chinese from the reviewed Weibo archive, and applies reviewed reconstructions only where an original is missing. It then applies the explicitly listed localizations from the working tree and derives Traditional Chinese from Simplified Chinese. It fails for unaccounted-for stable tags, missing translation files or incomplete four-language coverage rather than silently dropping a release or language. Review and commit the regenerated archive with translation changes; commit current release notes before rebuilding their archive, especially at major-version resets. Never reset the archive with the current-major Markdown files.

The website reads only `history/stable.json` from `main` for its changelog and version comparisons. This includes current stable releases; it is not an older-version supplement. The root channel files remain the application update feed. Publish the complete archive before deploying the website consumer. If no valid cached archive is available, the website reports a loading error rather than merging a partial history from channel files.

The Release history CI workflow runs `npm test` on pull requests and pushes to main. It checks that the current en-US, ja-JP and zh-CN stable sections match the generated archive (including plugin separation), and that the latest stable pointer has corresponding notes. Archived zh-TW remains derived from zh-CN and is covered by the OpenCC equality check. Update root stable notes, rebuild the archive, and include both in the same pull request; a channel-only change fails this check. No historical checkouts or GitHub API access are needed to run these checks.

Known upstream heading corrections are scoped to exact commits in the generator: poi-server `b9323833` updates v10.2.4 under a v10.2.3 heading; poi-server `a0018c91` updates v7.9.1 under a v7.9.0 heading; website `3e89b290` updates v10.5.0 under a v10.4.0 heading. The English notes and update pointers identify the actual versions. Correct v7.9.0 and v10.4.0 Chinese notes come from `379796c2` and `eabeed42`, respectively. Run `npm test` after rebuilding to check these source assignments and their localized output.
