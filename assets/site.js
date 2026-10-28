export const RATES = { GBP: 1, EUR: 1.1712, USD: 1.3398 };

export const DOWNLOADS = {
  mac: "https://github.com/Chee19/folio-release/releases/latest/download/Folio-mac-universal.dmg",
  windows:
    "https://github.com/Chee19/folio-release/releases/latest/download/Folio-win-x64.exe",
};

const OS_NAMES = { mac: "macOS", windows: "Windows" };

const FORM_ENDPOINT = "https://api.web3forms.com/submit";
// Web3Forms keys are public by design; they map to the inbox without exposing it.
const FORM_KEY = "83d848bd-db78-4bf3-a3da-3366561679b6";
const REGISTERED = "folio-registered";

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

export function registration(fields, download) {
  const { newsletter, ...rest } = fields;
  return {
    ...rest,
    access_key: FORM_KEY,
    subject: "New Folio beta sign-up",
    // Explicit yes or no, so each email doubles as the consent record.
    newsletter: newsletter ? "yes" : "no",
    download: download.split("/").pop(),
  };
}

// Runs when the form service fails; status is the HTTP status, or 0 if no answer came back.
// Return true to start the download anyway, or false to keep them on the form to retry.
export function letThroughOnFailure(status) {
  // TODO(you): decide the failure policy.
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

function isRegistered() {
  try {
    return localStorage.getItem(REGISTERED) === "1";
  } catch {
    return false;
  }
}

function setupGate(dialog) {
  const form = dialog.querySelector("form");
  const submit = form.querySelector('[type="submit"]');
  const error = dialog.querySelector("[data-gate-error]");
  // Remembered so the app's update link to this page doesn't ask again.
  let cleared = isRegistered();
  let pending = null;

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a");
      if (cleared || !link || !Object.values(DOWNLOADS).includes(link.href))
        return;
      event.preventDefault();
      // Capture phase, so the home page's "Downloading" hint waits for the form.
      event.stopPropagation();
      pending = link;
      error.hidden = true;
      dialog.showModal();
    },
    true,
  );

  dialog
    .querySelector("[data-gate-close]")
    .addEventListener("click", () => dialog.close());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    let status = 0;
    let ok = false;
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          registration(Object.fromEntries(new FormData(form)), pending.href),
        ),
      });
      status = response.status;
      ok = (await response.json()).success === true;
    } catch {}
    submit.disabled = false;
    if (!ok && !letThroughOnFailure(status)) {
      error.hidden = false;
      return;
    }
    if (ok) {
      try {
        localStorage.setItem(REGISTERED, "1");
      } catch {}
    }
    cleared = true;
    dialog.close();
    pending.click();
  });
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
  const gate = document.querySelector("[data-gate]");
  // Browsers without <dialog> skip the form and download directly.
  if (gate?.showModal) setupGate(gate);
}
