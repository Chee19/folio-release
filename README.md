# Folio

**Download Folio:** https://chee19.github.io/folio-release/download/

Folio is a free desktop app for tracking stocks and crypto, with your records kept on your own computer. Installers for macOS and Windows are published under [Releases](https://github.com/Chee19/folio-release/releases).

---

## About this repository

This repository holds Folio's release installers and the source of its website: plain HTML, CSS and one small JavaScript module, with no build step and no dependencies.

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
