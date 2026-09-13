import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import OpenCC from "opencc-js";
import { splitPluginNotes } from "./split-plugin-notes.mjs";

const archive = JSON.parse(
  await readFile(new URL("../history/stable.json", import.meta.url), "utf8"),
);
const notes = (version) =>
  archive.find((entry) => entry.version === version).notes;
const convert = OpenCC.Converter({ from: "cn", to: "twp" });

test("v10.4.0 retains its Electron 6 notes rather than the stale v10.5.0 heading", () => {
  const entry = notes("v10.4.0");
  assert.equal(
    entry["zh-CN"].source,
    "https://github.com/poooi/website/blob/eabeed42d64882534d5ad0f9f5b75211c105155e/public/update/zh-CN.md",
  );
  for (const note of Object.values(entry)) {
    assert.match(note.markdown, /electron@6/);
    assert.match(note.markdown, /Chromium@76/);
    assert.doesNotMatch(note.markdown, /electron@7|Chromium@78/);
  }
  assert.match(notes("v10.5.0")["zh-CN"].markdown, /electron@7/);
});

test("v7.9.0 retains its titlebar and TouchBar features rather than v7.9.1 fixes", () => {
  const entry = notes("v7.9.0");
  assert.equal(
    entry["zh-CN"].source,
    "https://github.com/poooi/poi-server/blob/379796c22bf37f8eff55ef4876e91dbfd5c4165c/public/update/zh-CN.md",
  );
  for (const note of Object.values(entry)) {
    assert.match(note.markdown, /TouchBar/);
    assert.match(note.markdown, /Windows/);
    assert.match(note.markdown, /Linux/);
    assert.match(note.markdown, /macOS/);
    assert.doesNotMatch(note.markdown, /E6/);
  }
  assert.match(notes("v7.9.1")["zh-CN"].markdown, /E6/);
});

test("the rebuilt archive retains four languages and exact OpenCC output", () => {
  for (const entry of archive) {
    assert.deepEqual(Object.keys(entry.notes).sort(), [
      "en-US",
      "ja-JP",
      "zh-CN",
      "zh-TW",
    ]);
    const cn = entry.notes["zh-CN"],
      tw = entry.notes["zh-TW"];
    assert.equal(tw.markdown, convert(cn.markdown), entry.version);
    assert.equal(
      tw.pluginMarkdown,
      cn.pluginMarkdown ? convert(cn.pluginMarkdown) : undefined,
      entry.version,
    );
  }
});


test("new plugin announcements are archived separately in every language", () => {
  const cases = [
    ["v10.7.0", {
      "en-US": /poi-plugin-quest-info-2/,
      "zh-CN": /任务信息2/,
      "zh-TW": /任務資訊2/,
      "ja-JP": /任务信息2/,
    }],
    ["v10.2.0", {
      "en-US": /New Ship Reminder/,
      "zh-CN": /新舰力保/,
      "zh-TW": /新艦力保/,
      "ja-JP": /新舰力保/,
    }],
  ];
  for (const [version, patterns] of cases) {
    for (const [language, pattern] of Object.entries(patterns)) {
      const note = notes(version)[language];
      assert.doesNotMatch(note.markdown, pattern, version + "/" + language);
      assert.match(note.pluginMarkdown, pattern, version + "/" + language);
    }
  }
  for (const note of Object.values(notes("v10.7.0"))) {
    assert.match(note.markdown, /Electron@15/i);
  }
  assert.match(notes("v7.4.0")["zh-CN"].markdown, /插件自动更新/);
  assert.match(notes("v6.0.0")["en-US"].markdown, /Settings/);
});

test("plugin archive coverage stays consistent across languages", () => {
  for (const entry of archive) {
    const coverage = Object.values(entry.notes).map(note => Boolean(note.pluginMarkdown));
    assert.equal(new Set(coverage).size, 1, entry.version);
  }
});

test("current stable channel notes are included in the website archive", async () => {
  const latest = JSON.parse(await readFile(new URL('../latest.json', import.meta.url), 'utf8'));
  for (const language of ['en-US', 'ja-JP', 'zh-CN']) {
    const markdown = (await readFile(new URL('../' + language + '.md', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
    const headings = [...markdown.matchAll(/^## POI (v\d+\.\d+\.\d+) [^\n]+$/gim)];
    assert.equal(headings[0]?.[1], latest.version, language + ' must start with the latest stable version');
    for (const [index, heading] of headings.entries()) {
      const note = archive.find(entry => entry.version === heading[1])?.notes[language];
      assert.ok(note, 'Rebuild the archive: missing ' + heading[1] + '/' + language);
      const body = markdown.slice(heading.index + heading[0].length, headings[index + 1]?.index).trim();
      const expected = splitPluginNotes(body);
      assert.equal(note.markdown, expected.markdown, 'Rebuild the archive: stale ' + heading[1] + '/' + language);
      assert.equal(note.pluginMarkdown, expected.pluginMarkdown, 'Rebuild the archive: stale plugins for ' + heading[1] + '/' + language);
    }
  }
});
