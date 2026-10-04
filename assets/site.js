export const RATES = { GBP: 1, EUR: 1.1712, USD: 1.3398 };

export const DOWNLOADS = {
  mac: "https://github.com/Chee19/folio-release/releases/latest/download/Folio-mac-universal.dmg",
  windows:
    "https://github.com/Chee19/folio-release/releases/latest/download/Folio-win-x64.exe",
};

const OS_NAMES = { mac: "macOS", windows: "Windows" };

export function detectPlatform(
  userAgent = "",
  mobileHint = false,
  touchPoints = 0,
) {
  if (mobileHint || /Android|iPhone|iPad|iPod/i.test(userAgent))
    return "mobile";
  // iPadOS asks for desktop sites with a Mac user agent; touch support gives it away.
  if (/Macintosh|Mac OS X/i.test(userAgent))
    return touchPoints > 1 ? "mobile" : "mac";
  if (/Windows/i.test(userAgent)) return "windows";
  return "other";
}

export function convertHoldings(gbpValues, currency) {
  const rate = RATES[currency];
  const cents = gbpValues.map((gbp) =>
    gbp === null ? null : Math.round(gbp * rate * 100),
  );
  // Summing rounded cents keeps the visible rows adding up to the visible total.
  const totalCents = cents.reduce(
    (sum, value) => (value === null ? sum : sum + value),
    0,
  );
  return {
    values: cents.map((value) => (value === null ? null : value / 100)),
    total: totalCents / 100,
  };
}

export function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

function showHint(cta, os) {
  for (const hint of cta.querySelectorAll("[data-cta-hint]")) {
    hint.hidden = hint.dataset.ctaHint !== os;
  }
}

function setupDownloads(platform) {
  for (const note of document.querySelectorAll("[data-mobile-note]")) {
    note.hidden = platform !== "mobile";
  }
  if (platform !== "mac" && platform !== "windows") return;
  const other = platform === "mac" ? "windows" : "mac";

  for (const cta of document.querySelectorAll("[data-cta]")) {
    const primary = cta.querySelector("[data-cta-primary]");
    const alt = cta.querySelector("[data-cta-alt]");
    primary.href = DOWNLOADS[platform];
    primary.querySelector("[data-cta-label]").textContent =
      `Download for ${OS_NAMES[platform]}`;
    primary.addEventListener("click", () => showHint(cta, platform));
    alt.href = DOWNLOADS[other];
    alt.textContent = `Also on ${OS_NAMES[other]}`;
    alt.hidden = false;
    alt.addEventListener("click", () => showHint(cta, other));
  }

  const cards = document.querySelector("[data-downloads]");
  const card = cards?.querySelector(`[data-os="${platform}"]`);
  if (card) {
    cards.prepend(card);
    card.classList.add("is-recommended");
    card.querySelector("[data-os-tag]").hidden = false;
  }
  const steps = document.querySelector("[data-steps]");
  const group = steps?.querySelector(`[data-os="${platform}"]`);
  if (group) steps.prepend(group);
}

function setupReplica(root) {
  const rows = [...root.querySelectorAll("[data-row]")];
  const gbpValues = rows.map((row) =>
    row.dataset.gbp ? Number(row.dataset.gbp) : null,
  );
  const buttons = [...root.querySelectorAll("[data-currency]")];
  const total = root.querySelector("[data-total]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function render(currency) {
    const converted = convertHoldings(gbpValues, currency);
    rows.forEach((row, index) => {
      const value = converted.values[index];
      if (value === null) return;
      row.querySelector("[data-value]").textContent = formatMoney(
        value,
        currency,
      );
      row.querySelector("[data-ecb]").hidden = row.dataset.paid === currency;
    });
    total.textContent = formatMoney(converted.total, currency);
    for (const button of buttons) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.currency === currency),
      );
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const currency = button.dataset.currency;
      if (reduceMotion.matches) {
        render(currency);
        return;
      }
      root.classList.add("is-updating");
      window.setTimeout(() => {
        render(currency);
        root.classList.remove("is-updating");
      }, 160);
    });
  }
  root.querySelector("[data-switch]").hidden = false;
}

// Browser-only wiring; the tests import the pure functions above under Node.
if (typeof document !== "undefined") {
  setupDownloads(
    detectPlatform(
      navigator.userAgent,
      navigator.userAgentData?.mobile === true,
      navigator.maxTouchPoints || 0,
    ),
  );
  const replica = document.querySelector("[data-replica]");
  if (replica) setupReplica(replica);
}
