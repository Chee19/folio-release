import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../assets/site.css", import.meta.url),
  "utf8",
);

function token(name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  assert.ok(match, `missing --${name}`);
  return match[1];
}

function luminance(hex) {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((part) => parseInt(part, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test("text colours meet WCAG AA on the backgrounds they are used on", () => {
  const pairs = [
    ["ink", "paper"],
    ["ink", "card"],
    ["muted", "paper"],
    ["muted", "card"],
    ["accent-ink", "paper"],
    ["accent-ink", "card"],
    ["accent-ink", "accent-tint"],
    ["gain", "card"],
    ["loss", "card"],
    ["paper", "ink"],
    ["accent-soft", "ink"],
    ["on-ink-muted", "ink"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= 4.5, `--${fg} on --${bg} is ${ratio.toFixed(2)}`);
  }
});

test("fonts are local files that exist and nothing loads from another host", () => {
  const urls = [...css.matchAll(/url\("([^"]+)"\)/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith("data:"));
  assert.equal(urls.length, 4);
  for (const url of urls) {
    assert.doesNotMatch(url, /^(https?:)?\/\//);
    assert.ok(
      existsSync(new URL(url, new URL("../assets/", import.meta.url))),
      `${url} is missing`,
    );
  }
});

test("reduced motion switches off transitions", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
