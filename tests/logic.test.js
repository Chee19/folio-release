import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DOWNLOADS,
  convertHoldings,
  detectPlatform,
  formatMoney,
} from "../assets/site.js";

const SAMPLE = [4120.55, 9880.1, 2410.33, null];
const UA = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  linux:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

test("conversion rounds each row and totals the rounded rows, skipping unpriced holdings", () => {
  assert.deepEqual(convertHoldings(SAMPLE, "GBP"), {
    values: [4120.55, 9880.1, 2410.33, null],
    total: 16410.98,
  });
  assert.deepEqual(convertHoldings(SAMPLE, "EUR"), {
    values: [4825.99, 11571.57, 2822.98, null],
    total: 19220.54,
  });
  assert.deepEqual(convertHoldings(SAMPLE, "USD"), {
    values: [5520.71, 13237.36, 3229.36, null],
    total: 21987.43,
  });
});

test("money uses narrow currency symbols", () => {
  assert.equal(formatMoney(16410.98, "GBP"), "£16,410.98");
  assert.equal(formatMoney(19220.54, "EUR"), "€19,220.54");
  assert.equal(formatMoney(21987.43, "USD"), "$21,987.43");
});

test("platform detection orders downloads without guessing wrong on tablets", () => {
  assert.equal(detectPlatform(UA.mac), "mac");
  assert.equal(detectPlatform(UA.windows), "windows");
  assert.equal(detectPlatform(UA.iphone), "mobile");
  assert.equal(detectPlatform(UA.android), "mobile");
  assert.equal(detectPlatform(UA.mac, false, 5), "mobile");
  assert.equal(detectPlatform(UA.windows, true), "mobile");
  assert.equal(detectPlatform(UA.linux), "other");
  assert.equal(detectPlatform(""), "other");
});

test("download links are the permanent release links", () => {
  assert.equal(
    DOWNLOADS.mac,
    "https://github.com/Chee19/folio-release/releases/latest/download/Folio-mac-universal.dmg",
  );
  assert.equal(
    DOWNLOADS.windows,
    "https://github.com/Chee19/folio-release/releases/latest/download/Folio-win-x64.exe",
  );
});
