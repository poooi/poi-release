import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import OpenCC from 'opencc-js'

const root = fileURLToPath(new URL('../', import.meta.url))
const poi = path.resolve(root, process.argv[2] ?? '../poi')
const website = path.resolve(root, process.argv[4] ?? '../website')
const poiServer = path.resolve(root, process.argv[5] ?? '../poi-server')
const git = (repo, ...args) =>
  execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  }).trim()
const languages = ['en-US', 'ja-JP', 'zh-CN', 'zh-TW']
const stableTag = /^v\d+\.\d+\.\d+$/
const releasesText = process.argv[3]
  ? await readFile(path.resolve(process.argv[3]), 'utf8')
  : execFileSync(
      'gh',
      [
        'api',
        'repos/poooi/poi/releases?per_page=100',
        '--paginate',
        '--jq',
        '.[] | {tag: .tag_name, publishedAt: .published_at, draft: .draft, url: .html_url, body: .body}',
      ],
      { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
    )
const releases = new Map(
  releasesText
    .trim()
    .split(/\r?\n/)
    .map(JSON.parse)
    .filter((release) => !release.draft && stableTag.test(release.tag))
    .map((release) => [release.tag, release]),
)
const reconstructed = JSON.parse(
  await readFile(
    new URL('../history/reconstructed.json', import.meta.url),
    'utf8',
  ),
)
const weibo = JSON.parse(
  await readFile(new URL('../history/weibo.json', import.meta.url), 'utf8'),
)
const notesByVersion = new Map()

// Newest snapshot wins: later corrections and translations supersede old text.
function collectNotes(repo, repository, ref, directories) {
  for (const directory of directories) {
    for (const language of languages) {
      const filename = path.posix.join(directory, `${language}.md`)
      const revisions = git(
        repo,
        'log',
        '--diff-filter=AM',
        '--format=%H',
        ref,
        '--',
        filename,
      )
        .split('\n')
        .filter(Boolean)
      for (const revision of revisions) {
        let markdown = git(repo, 'show', `${revision}:${filename}`).replaceAll(
          '\r\n',
          '\n',
        )
        // These release commits updated the Chinese body but retained the previous
        // version heading. Their English notes and latest.json identify the release.
        const correction = {
          "poi-server/b93238331b89ac77a3f63c97c6a2ae31c410815d": [
            "v10.2.3",
            "v10.2.4",
          ],
          "poi-server/a0018c919d819049883e762db23f4fbeaf21fab1": [
            "v7.9.0",
            "v7.9.1",
          ],
          "website/3e89b2904f1e5fbc3dd4bba967051611cb93ff69": [
            "v10.4.0",
            "v10.5.0",
          ],
        }[repository + "/" + revision];
        if (correction && (language === "zh-CN" || language === "zh-TW")) {
          markdown = markdown.replace(
            new RegExp(
              "^(## poi )" + correction[0].replaceAll(".", "\\.") + " ",
              "i",
            ),
            "$1" + correction[1] + " ",
          );
        }
        const headings = [
          ...markdown.matchAll(/^## POI (v\d+\.\d+\.\d+) [^\n]+$/gim),
        ]
        const unresolvedHeadings = headings.filter(
          (heading) => !notesByVersion.get(heading[1])?.[language],
        )
        if (
          new Set(unresolvedHeadings.map((heading) => heading[1])).size !==
          unresolvedHeadings.length
        ) {
          throw new Error(
            `Duplicate version heading in ${repository}/${revision}/${filename}; inspect the original before importing`,
          )
        }
        for (const [index, heading] of headings.entries()) {
          const version = heading[1]
          const notes = notesByVersion.get(version) ?? {}
          notes[language] ??= {
            markdown: markdown
              .slice(
                heading.index + heading[0].length,
                headings[index + 1]?.index,
              )
              .trim(),
            source: `https://github.com/poooi/${repository}/blob/${revision}/${filename}`,
            reconstructed: false,
          }
          notesByVersion.set(version, notes)
        }
      }
    }
  }
}
collectNotes(root, 'poi-release', 'HEAD', [''])
// The old website moved its stable files twice; scan newest locations first.
collectNotes(website, 'website', 'origin/master', [
  'packages/data/update',
  'packages/web/public/update',
  'public/update',
])
collectNotes(poiServer, 'poi-server', 'origin/master', ['public/update'])
for (const [version, entry] of Object.entries(weibo)) {
  const notes = notesByVersion.get(version) ?? {}
  notes['zh-CN'] ??= {
    markdown: (
      await readFile(
        new URL('../history/weibo/' + version + '.md', import.meta.url),
        'utf8',
      )
    ).trim(),
    source: entry.source,
    reconstructed: entry.reconstructed ?? false,
  }
  notesByVersion.set(version, notes)
}

const versions = [
  ...new Set([
    ...git(poi, 'tag', '--list')
      .split('\n')
      .filter((tag) => stableTag.test(tag)),
    ...releases.keys(),
  ]),
]
versions.sort((a, b) => {
  const left = a.slice(1).split('.').map(Number)
  const right = b.slice(1).split('.').map(Number)
  return right[0] - left[0] || right[1] - left[1] || right[2] - left[2]
})
// Keep recovered plugin history in the archive, outside the website's main notes.
function splitPluginNotes(markdown) {
  const main = []
  const plugins = []
  let pluginDepth = 0
  let pluginBullet = false
  for (const line of markdown.split('\n')) {
    const boldHeading = /^\*\*(.+)\*\*$/.exec(line)
    const heading =
      /^(#{1,6})\s+(.+)$/.exec(line) ??
      (boldHeading ? [line, '##', boldHeading[1]] : null)
    if (heading) {
      if (pluginDepth && heading[1].length <= pluginDepth) pluginDepth = 0
      if (
        /^(插件更新|外掛更新|プラグイン更新|Plugins|Plugin updates(?:.*)?|New plugin:.*)$/i.test(
          heading[2],
        )
      )
        pluginDepth = heading[1].length
      pluginBullet = false
    }
    if (/^- /.test(line))
      pluginBullet =
        /^- (?:Add new plugin(?:[(:]|\s)|New plugin:|(?:新插件|新外掛)(?:[:：]|\s)|新プラグイン(?:\s|[「:：])|.*KCwiki Quotes Translator|.*kcwiki 語音字幕)/i.test(
          line,
        ) ||
        /^- \[(?:Prophet|Battle detail|Expedition|Quests?|Hensei Nikki|Report|Ship info|Fleet info|Akashic records)\]/i.test(
          line,
        )
    ;(pluginDepth || pluginBullet ? plugins : main).push(line)
  }
  const result = { markdown: main.join('\n').trim() }
  if (plugins.some((line) => line.trim()))
    result.pluginMarkdown = plugins.join('\n').trim()
  return result
}
const history = versions.map((version) => {
  const release = releases.get(version)
  const notes = notesByVersion.get(version) ?? {}
  if (!notes['en-US'] && release?.body?.trim()) {
    // Remove only a leading title for this exact version; keep all prose intact.
    const title = new RegExp(
      `^#{1,6}\\s+(?:poi\\s+)?v?${version.slice(1).replaceAll('.', '\\.')}\\b[^\\n]*\\n*`,
      'i',
    )
    notes['en-US'] = {
      markdown: release.body
        .replaceAll('\r\n', '\n')
        .trim()
        .replace(title, '')
        .trim(),
      source: release.url,
      reconstructed: false,
    }
  }
  if (!notes['en-US'] && reconstructed[version]) {
    for (const language of languages) {
      const entry = reconstructed[version]
      if (!entry.notes[language])
        throw new Error(`Missing reconstructed ${language} for ${version}`)
      notes[language] ??= {
        markdown: entry.notes[language],
        source: entry.source,
        reconstructed: true,
      }
    }
  }
  if (!notes['en-US']?.markdown)
    throw new Error(
      `No release notes for ${version}; inspect the tagged code and add an explicitly reconstructed entry`,
    )
  for (const note of Object.values(notes)) {
    Object.assign(note, splitPluginNotes(note.markdown))
  }
  return { version, publishedAt: release?.publishedAt ?? reconstructed[version]?.publishedAt ?? null, notes }
})
// Human-maintained translations override the selected source only where listed.
// Keep the source URL and reconstruction status: translation is not reconstruction.
const localized = JSON.parse(
  await readFile(
    new URL('../history/localized/sources.json', import.meta.url),
    'utf8',
  ),
)
for (const [version, { from, languages: targets }] of Object.entries(
  localized,
)) {
  const entry = history.find((release) => release.version === version)
  const source = entry?.notes[from]
  if (!source) throw new Error(`Missing localization source ${version}/${from}`)
  for (const language of targets) {
    if (!languages.includes(language) || language === from || language === 'zh-TW')
      throw new Error(`Invalid localization target ${version}/${language}`)
    const markdown = (
      await readFile(
        new URL(
          `../history/localized/${version}/${language}.md`,
          import.meta.url,
        ),
        'utf8',
      )
    ).trim()
    if (!markdown) throw new Error(`Empty localization ${version}/${language}`)
    entry.notes[language] = {
      ...splitPluginNotes(markdown),
      source: source.source,
      reconstructed: source.reconstructed,
      translatedFrom: from,
    }
  }
}
// Traditional Chinese is derived from Simplified Chinese, never rewritten.
const toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' })
for (const entry of history) {
  const simplified = entry.notes['zh-CN']
  if (!simplified) throw new Error(`Missing Simplified Chinese ${entry.version}`)
  entry.notes['zh-TW'] = {
    markdown: toTraditional(simplified.markdown),
    ...(simplified.pluginMarkdown
      ? { pluginMarkdown: toTraditional(simplified.pluginMarkdown) }
      : {}),
    source: simplified.source,
    reconstructed: simplified.reconstructed,
    translatedFrom: 'zh-CN',
  }
  for (const language of languages) {
    if (!entry.notes[language]?.markdown)
      throw new Error(`Missing translation ${entry.version}/${language}`)
  }
}
await writeFile(
  new URL('../history/stable.json', import.meta.url),
  JSON.stringify(history, null, 2) + '\n',
)
console.log(
  `Archived ${history.length} stable versions: ${history.at(-1).version} through ${history[0].version}`,
)
for (const language of languages)
  console.log(
    `${language}: ${history.filter((release) => release.notes[language]).length} entries`,
  )
