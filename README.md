<p align="center">
  <img src="assets/icon.svg" alt="Folio logo" width="96" height="96" />
</p>

<h1 align="center">Folio</h1>

<p align="center">
  <strong>Your portfolio. On your machine.</strong><br />
  A free desktop app for tracking stocks and crypto, in pounds, euros or dollars.
</p>

<p align="center">
  <a href="https://github.com/Chee19/folio-release/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/Chee19/folio-release?label=release&color=a9befd&labelColor=172031" /></a>
  <img alt="Platforms: macOS and Windows" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows-a9befd?labelColor=172031" />
  <img alt="Free public beta" src="https://img.shields.io/badge/price-free%20public%20beta-a9befd?labelColor=172031" />
</p>

<p align="center">
  <a href="https://chee19.github.io/folio-release/download/"><strong>Download Folio</strong></a>
  &nbsp;·&nbsp;
  <a href="https://chee19.github.io/folio-release/">Website</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Chee19/folio-release/releases">All versions</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Chee19/folio-release/issues/new">Send feedback</a>
</p>

---

## Why Folio

- **All in one place.** Your stocks and crypto side by side, with charts, a watchlist and performance over time.
- **Every currency.** Buy in dollars, think in pounds. Every trade keeps the currency you paid, converted at official ECB rates.
- **Private by design.** No account, no cloud, no tracking. Your portfolio lives on your computer, not on someone else's server.

## Features

| Feature                    | What you get                                                      |
| -------------------------- | ----------------------------------------------------------------- |
| **Import your history**    | Bring in past trades from a CSV file in one go.                   |
| **Performance over time**  | See how your portfolio has grown, not just what it's worth today. |
| **A watchlist**            | Keep an eye on ideas before you buy.                              |
| **Pro-grade charts**       | TradingView charts for every stock and coin.                      |
| **Honest totals**          | Missing prices are flagged, never counted as zero.                |
| **Automatic backups**      | Folio backs up your data before an update changes it.             |

## AI research desk

Folio can read the market for you once a day: what moved your holdings, the news that matters, and ideas worth a closer look, with sources linked.

- **Market backdrop.** The big picture in one read: rates, trade, geopolitics and sentiment.
- **Your holdings, researched.** News, analyst rating trends and earnings notes for everything you own or watch.
- **New ideas.** Up to eight a day, with the reasoning shown and one tap to your watchlist.
- **Ask anything.** Ask about your portfolio in plain English and get answers built from your own numbers.

> [!NOTE]
> The research desk is optional. It runs through the Codex CLI on your computer with your own ChatGPT plan, and sends your holdings to it for research. It is machine-generated research, not financial advice.

## Get started

1. **Download Folio.** Free for macOS and Windows from the [download page](https://chee19.github.io/folio-release/download/). Just your name and email, no account.
2. **Turn on price updates.** Two free sign-ups, Alpaca for stocks and CoinMarketCap for crypto, keep your prices fresh.
3. **Add what you own.** Search a ticker or coin and enter what you paid. Folio works out your value, gains and currencies.

The first time you open Folio, macOS or Windows asks you to confirm. The [first-launch guide](https://chee19.github.io/folio-release/download/#first-launch) shows how.

## Under the hood

- Runs locally on your machine
- One local SQLite file holds your records
- Official ECB exchange rates
- No telemetry
- Optional AI via your own Codex CLI

## Feedback

Folio is in free public beta. Try one of your usual workflows and [open an issue](https://github.com/Chee19/folio-release/issues/new) with the first thing that feels confusing, cumbersome or missing.

<sub>Folio is not financial advice. See the [privacy notice](https://chee19.github.io/folio-release/privacy/) and [terms of use](https://chee19.github.io/folio-release/terms/).</sub>

---

## About this repository

This repository holds Folio's release installers and the source of its website: plain HTML, CSS and one small JavaScript module, with no build step and no dependencies.

Download buttons open a name and email form first. Each sign-up is emailed to hello@delphi-engine.com through [Web3Forms](https://web3forms.com); the access key is `FORM_KEY` in `assets/site.js`. If what the form collects or who handles it changes, update `privacy/index.html` and its date. Download counts per installer are on each release's assets via the GitHub API.

### Preview locally

```bash
uv run --no-project python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. To preview under the GitHub Pages sub-path:

```bash
mkdir -p /tmp/folio-preview && ln -sfn "$PWD" /tmp/folio-preview/folio-release
uv run --no-project python -m http.server 8765 --bind 127.0.0.1 --directory /tmp/folio-preview
```

Then open http://127.0.0.1:8765/folio-release/.

### Test

```bash
node --test
```

### Deploy

1. Push these files to the `main` branch of `Chee19/folio-release`.
2. In the repository, open **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. The site is served at https://chee19.github.io/folio-release/. The download page, https://chee19.github.io/folio-release/download/, is Folio's `DOWNLOAD_PAGE_URL`.

Publishing a release does not change the site, and editing the site does not change releases.

### Fonts

Instrument Serif, Geist and Geist Mono are self-hosted under the SIL Open Font License; the licences are in `assets/fonts/`.
