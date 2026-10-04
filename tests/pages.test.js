import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DOWNLOADS } from "../assets/site.js";

function page(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const flat = (html) => html.replace(/\s+/g, " ");
const home = flat(page("index.html"));
const download = flat(page("download/index.html"));

const HOME_COPY = [
  "Folio · Free stock and crypto portfolio tracker",
  "Now in free public beta",
  "Your portfolio.",
  "On your machine.",
  "All your stocks and crypto in one place, in pounds, euros or dollars. Free, private, and no account to create.",
  "Free for macOS and Windows · No account · No tracking",
  "Downloading. The first time, macOS asks you to confirm.",
  "Downloading. The first time, Windows asks you to confirm.",
  "Folio is a desktop app. Open this page on your Mac or PC to download.",
  "Portfolio value",
  "3 of 4 priced",
  "Price unavailable",
  "Sample portfolio. Tap £ € $ to switch currency.",
  "All in one place",
  "Your stocks and crypto side by side, with charts, a watchlist and performance over time.",
  "Every currency",
  "Buy in dollars, think in pounds. Every trade keeps the currency you paid, converted at official ECB rates.",
  "Private by design",
  "No sign-up, no cloud, no tracking. Your portfolio lives on your computer, not on someone else’s server.",
  "AI research desk",
  "Your own research desk, every day.",
  "Folio reads the market for you once a day: what moved your holdings, the news that matters, and ideas worth a closer look, with sources linked.",
  "Market backdrop",
  "The big picture in one read: rates, trade, geopolitics and sentiment.",
  "Your holdings, researched",
  "News, analyst rating trends and earnings notes for everything you own or watch.",
  "New ideas",
  "Up to eight a day, with the reasoning shown and one tap to your watchlist.",
  "Ask anything",
  "Ask about your portfolio in plain English and get answers built from your own numbers.",
  "Optional. Runs through the Codex CLI on your computer with your own ChatGPT plan, and sends your holdings to it for research. Machine-generated research, not financial advice.",
  "Daily brief",
  "What matters now",
  "Idea to research",
  "Sample brief. Your report covers what you own and watch.",
  "Built for the details.",
  "The small things that make a tracker worth trusting.",
  "Import your history",
  "Bring in past trades from a CSV file in one go.",
  "Performance over time",
  "See how your portfolio has grown, not just what it’s worth today.",
  "A watchlist",
  "Keep an eye on ideas before you buy.",
  "Pro-grade charts",
  "TradingView charts for every stock and coin.",
  "Honest totals",
  "Missing prices are flagged, never counted as zero.",
  "Automatic backups",
  "Folio backs up your data before an update changes it.",
  "How it works",
  "From download to dashboard in minutes.",
  "No subscription. No bank or broker logins. Just your portfolio, on your terms.",
  "Download free",
  "Download Folio",
  "Free for macOS and Windows. No Folio account needed.",
  "Turn on price updates",
  "Two free sign-ups, Alpaca for stocks and CoinMarketCap for crypto, keep your prices fresh.",
  "Add what you own",
  "Search a ticker or coin and enter what you paid. Folio works out your value, gains and currencies.",
  "Under the hood",
  "Runs locally on your machine · One local SQLite file · ECB exchange rates · No telemetry · Optional AI via your own Codex CLI",
  "Why I built it",
  "I kept adding tools to simplify my investing.",
  "Eventually, I had to simplify the tools.",
  "I was paying for investing tools I barely used, and still switching between apps to understand my own portfolio. Trades, holdings, performance, watchlists and research were scattered everywhere.",
  "So I built Folio around how I actually manage my stocks and crypto, with my records on my own computer from day one. I’ve since cancelled the subscriptions it replaced.",
  "I built it solo: a couple of days working out the product and its rules first, then AI did much of the coding while I steered.",
  "Inside Folio, AI powers the insights on your portfolio, while your numbers come from your recorded trades and fixed calculation rules.",
  "Now I’d like to find where your habits expose something I’ve missed. Try one of your usual workflows and tell me the first thing that feels confusing, cumbersome or missing.",
  "Tell me what you find",
  "Sean, Folio",
  "Your whole portfolio,",
  "in one place.",
  "Free while in beta · macOS and Windows",
  "Folio is not financial advice.",
  "© 2026 Folio",
];

const DOWNLOAD_COPY = [
  "Download Folio",
  "Free public beta for macOS and Windows.",
  "Universal · Apple silicon and Intel",
  "Windows 10 and 11 · 64-bit",
  "For this computer",
  "Download .dmg",
  "Download .exe",
  "Folio isn’t code-signed during the beta, so your computer asks you to confirm it once.",
  "Open the .dmg and drag Folio into Applications.",
  "When macOS says it can’t verify the app, choose",
  "Open System Settings, then Privacy &amp; Security, and choose",
  "You’ll confirm again after each update until Folio is signed.",
  "Comfortable with Terminal?",
  "xattr -dr com.apple.quarantine /Applications/Folio.app",
  "Run it after installing, then open Folio as usual.",
  "Run the installer.",
  "If you see “Windows protected your PC”, choose",
  "Folio opens when the installation finishes.",
  "PCs with Smart App Control switched on block unsigned apps, so Folio can’t run there yet.",
  "Then add your free keys",
  "account and generate paper-trading API keys.",
  "Get a free Basic API key from",
  "Paste them into Settings in Folio. They stay on your computer.",
  "Folio tells you when a new version is ready. Install it over the old one; your data stays.",
  "All versions and release notes",
  "Folio is not financial advice.",
];

test("pages contain every line of spec copy", () => {
  for (const line of HOME_COPY)
    assert.ok(home.includes(line), `home is missing: ${line}`);
  for (const line of DOWNLOAD_COPY)
    assert.ok(download.includes(line), `download page is missing: ${line}`);
});

test("pages use relative paths, load nothing from another host, and claim nothing false", () => {
  for (const [name, html] of [
    ["home", home],
    ["download", download],
  ]) {
    assert.doesNotMatch(
      html,
      /\s(?:href|src)="\//,
      `${name} has a root-absolute path`,
    );
    assert.doesNotMatch(
      html,
      /<(?:script|link|img|iframe|source)\b[^>]*\s(?:src|href)="(?:https?:)?\/\//i,
      `${name} loads a remote resource`,
    );
    assert.doesNotMatch(html, /open[- ]source/i, `${name} claims open source`);
    // Marketing buy or sell calls to the public can count as a financial promotion.
    assert.doesNotMatch(
      html,
      /\b(?:buy|sell) signals?\b/i,
      `${name} promises trade signals`,
    );
    assert.doesNotMatch(
      html,
      /GPT-\d|Opus \d|Astra|Chee Hong/,
      `${name} names a specific AI model or the owner`,
    );
  }
});

test("the story's feedback link opens a new issue on the public releases repository", () => {
  assert.match(
    home,
    /href="https:\/\/github\.com\/Chee19\/folio-release\/issues\/new"[^>]*>\s*Tell me what you find/,
  );
});

test("without JavaScript the home page offers the download page and hides interactive extras", () => {
  assert.match(home, /<a [^>]*href="download\/"[^>]*data-cta-primary/);
  assert.match(home, /data-cta-alt\s+hidden/);
  assert.match(home, /data-switch\s+hidden/);
});

test("every in-page link on both pages lands on a section that exists", () => {
  const anchors = [...home.matchAll(/href="#([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const id of ["research", "features", "how"])
    assert.ok(anchors.includes(id), `nav has no link to #${id}`);
  for (const id of anchors)
    assert.match(home, new RegExp(`id="${id}"`), `#${id} is missing`);
  for (const [, id] of download.matchAll(/href="\.\.\/#([^"]+)"/g))
    assert.match(
      home,
      new RegExp(`id="${id}"`),
      `../#${id} is missing on home`,
    );
});

test("home download hints point to the first-launch steps, which exist", () => {
  assert.equal((home.match(/href="download\/#first-launch"/g) || []).length, 2);
  assert.match(download, /id="first-launch"/);
});

test("download page links both permanent installers and orders mac before windows by default", () => {
  assert.ok(download.includes(`href="${DOWNLOADS.mac}"`));
  assert.ok(download.includes(`href="${DOWNLOADS.windows}"`));
  assert.match(
    download,
    /data-downloads[\s\S]*data-os="mac"[\s\S]*data-os="windows"/,
  );
  assert.match(
    download,
    /data-steps[\s\S]*data-os="mac"[\s\S]*data-os="windows"/,
  );
});

test("replica holds four rows and leaves the unpriced holding out of the total", () => {
  assert.equal((home.match(/data-row[\s>]/g) || []).length, 4);
  assert.equal((home.match(/data-gbp="/g) || []).length, 3);
  assert.ok(home.includes("£16,410.98"));
});
