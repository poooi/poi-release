import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

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
        // Both Chinese headings in this release commit mistakenly repeated v10.2.3.
        // Its English notes and latest.json identify the new first section as v10.2.4.
        if (
          repository === 'poi-server' &&
          revision === 'b93238331b89ac77a3f63c97c6a2ae31c410815d' &&
          (language === 'zh-CN' || language === 'zh-TW')
        ) {
          markdown = markdown.replace(/^## POI v10\.2\.3 /, '## POI v10.2.4 ')
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
      notes[language] = {
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
  return { version, publishedAt: release?.publishedAt ?? null, notes }
})
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
