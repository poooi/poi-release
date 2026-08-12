# AI Agent Instructions for poi-release Repository

This document contains poi-specific context and constraints that cannot be inferred
reliably from general coding-agent instructions. Prefer repository evidence over
this document if they diverge, and update this file when a convention changes.

## Repository Overview

This repository stores the changelog and the latest-version pointer of
[poi](https://github.com/poooi/poi). The poi website proxies these files directly from
the repository, so a merged change to `main` is effectively a publish.

There are 2 release channels: beta & stable.

### Files

| File            | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `latest.json`   | `version` (stable tag) and `betaVersion` (beta tag) |
| `en-US.md`      | Stable channel changelog, English                   |
| `ja-JP.md`      | Stable channel changelog, Japanese                  |
| `zh-CN.md`      | Stable channel changelog, Simplified Chinese        |
| `zh-TW.md`      | Stable channel changelog, Traditional Chinese       |
| `*-beta.md`     | Beta channel counterpart of each language file      |

4 languages are maintained: en-US, ja-JP, zh-CN, zh-TW. All language files must be
updated together — never leave a translation missing for a released version.

## Update Rule

When updating the changelog, follow these rules:

1. Only accept stable version tags matching `/^v\d+\.\d+\.\d+$/` and beta version tags
   matching `/^v\d+\.\d+\.\d+-beta\.\d+$/`. Any other tag is a special version and
   should be ignored.
2. Update only the channel the tag belongs to:
   - beta tag → `*-beta.md` files and `betaVersion` in `latest.json`
   - stable tag → `en-US.md`, `ja-JP.md`, `zh-CN.md`, `zh-TW.md` and `version` in
     `latest.json`
   - When a stable version ships without any preceding beta of that version, add the
     same entry to the `*-beta.md` files too, so both channels stay in sync (rule 5).
3. The changelog should cover changes between the tag being released and the previous
   stable tag. The raw list may be very long, so focus on major changes only; fold small
   ones into a single misc entry (e.g. "misc UI tweak").
4. A stable release consolidates the beta entries of that version into a single
   `## POI vX.Y.Z changelog` section — beta pre-release headings never appear in the
   stable files.
5. Keep the changelog consistent between the beta and stable channels.
6. The changelog should be user-oriented and avoid technical expressions. Include
   technical changes only when they affect the user experience.
7. Always bump `latest.json` in the same commit as the changelog entry; the version
   pointer and the changelog must never disagree.

## Changelog Format

- Newest version first, at the top of the file.
- Version heading: `## POI vX.Y.Z changelog` (en-US), `## POI vX.Y.Z 更新履歴` (ja-JP),
  `## POI vX.Y.Z 更新日志` (zh-CN), `## POI vX.Y.Z 更新日誌` (zh-TW). Keep the `v` prefix.
- Section headings are `###`, in this order, omitting any that are empty:

  | en-US      | ja-JP    | zh-CN  | zh-TW  |
  | ---------- | -------- | ------ | ------ |
  | `Breaking` | `破壊的変更` | `破坏性` | `破壞性` |
  | `Features` | `新機能`   | `功能`  | `功能`  |
  | `Changes`  | `変更`    | `变更`  | `變更`  |
  | `Fixes`    | `修正`    | `修复`  | `修復`  |

- Entries are `- ` bullets, one change per line, no trailing period.
- Platform-specific entries are prefixed with tags: `- [Windows] [Linux] ...`.
- Credit external contributors inline:
  `(Thanks to [name](https://github.com/name))` / `(協力: [name](https://github.com/name))` /
  `(感谢 [name](https://github.com/name) 的贡献)`.
- ja-JP uses KanColle community terminology rather than literal translation
  (e.g. 対空 CI, 先制対潜, 制空値, 任務, 基地航空隊).
- zh-TW is Traditional Chinese with Taiwan vocabulary, not a character-level conversion
  of zh-CN (e.g. 网络 → 網路, 文件 → 檔案, 数据 → 資料, 支持 → 支援, 默认 → 預設).
- Keep every entry of the current major version in the file. A new major version
  release resets the file: drop all entries of previous major versions so the file
  starts fresh from the new major version.

## Commits

- Release commits use the message `release: vX.Y.Z` (exactly the tag being released).
- Do not commit or push unless asked.
