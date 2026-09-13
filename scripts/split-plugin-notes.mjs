// Keep recovered plugin history in the archive, outside the website's main notes.
export function splitPluginNotes(markdown) {
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
