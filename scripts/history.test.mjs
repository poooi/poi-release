import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import OpenCC from "opencc-js";

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
