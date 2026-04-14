/**
 * Config sidebar event handling and layout management.
 * Handles user interactions with paper size, orientation, margins,
 * layout mode, feed toggles, and export buttons.
 */

import { buildHref } from "./url-utils";
import { getConfigParams } from "./config-helpers";
import { scalePages, saveVisibleMonth, restoreScrollPosition } from "./scaling";
import { clearSpreads, initSpreadLayout, initMonthSpreadLayout } from "./spreads";
import { exportCurrentView, exportAllMonths, exportPDF } from "./export";
import {
  loadState,
  saveState,
  saveConfig,
  saveInclude,
  addCustomFeed,
  removeCustomFeed,
  toggleCustomFeed,
  appendCustomFeeds,
} from "./local-state";

// ─── URL helper ───────────────────────────────────────────────────

/** Build a reload URL, preserving custom feed ?feed= params from localStorage */
function buildReloadUrl(url: URL): string {
  appendCustomFeeds(url);
  return buildHref(url);
}

// ─── Layout management ─────────────────────────────────────────────

/** Apply a layout mode: single, facing-photo, or facing-month */
function applyLayout(config: HTMLElement, layout: string) {
  // Save current scroll position before rebuilding
  saveVisibleMonth();

  const url = new URL(window.location.href);
  url.searchParams.set("layout", layout);
  history.replaceState(null, "", buildHref(url));
  config.dataset.layout = layout;
  saveConfig({ layout });

  // Show/hide scaling and gutter sections
  const scalingSection = document.querySelector(".config-scaling") as HTMLElement | null;
  if (scalingSection) {
    scalingSection.style.display = layout === "facing-photo" ? "" : "none";
  }
  const gutterSection = document.querySelector(".config-gutter") as HTMLElement | null;
  if (gutterSection) {
    gutterSection.style.display = (layout === "facing-photo" || layout === "facing-month") ? "" : "none";
  }

  // Disable 14mo for month+month (odd target-year pairing)
  const len14btn = document.querySelector('[data-length="14"]') as HTMLElement | null;
  if (len14btn) {
    if (layout === "facing-month") {
      len14btn.classList.add("disabled");
      len14btn.setAttribute("aria-disabled", "true");
      // If currently 14mo, switch to 16mo
      if (getConfigParams().length === "14") {
        saveConfig({ length: "16" });
        const url = new URL(window.location.href);
        url.searchParams.set("length", "16");
        saveVisibleMonth();
        window.location.href = buildReloadUrl(url);
      }
    } else {
      len14btn.classList.remove("disabled");
      len14btn.removeAttribute("aria-disabled");
    }
  }

  // Clear existing spreads first
  clearSpreads();

  const afterLayout = () => {
    scalePages();
    requestAnimationFrame(() => restoreScrollPosition());
  };

  if (layout === "facing-photo") {
    initSpreadLayout().then(afterLayout);
  } else if (layout === "facing-month") {
    initMonthSpreadLayout().then(afterLayout);
  } else {
    afterLayout();
  }
}

// ─── Config sidebar ────────────────────────────────────────────────

export function initConfigSidebar() {
  const sidebar = document.querySelector(".config-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("config-option")) {
      // Layout top-level toggle: Single Sheets / Facing Pages
      if (target.dataset.layout) {
        const isFacing = target.dataset.layout === "facing";
        const config = document.querySelector(".config") as HTMLElement;

        // Toggle active pill
        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        // Show/hide facing sub-toggle
        const facingSub = document.querySelector(".config-facing-sub") as HTMLElement | null;
        if (facingSub) facingSub.style.display = isFacing ? "" : "none";

        if (isFacing) {
          // Determine which facing mode is active (default to photo)
          const activeFacing = facingSub?.querySelector(".config-option.active") as HTMLElement | null;
          const facingMode = activeFacing?.dataset.facing ?? "facing-month";
          applyLayout(config, facingMode);
        } else {
          applyLayout(config, "single");
        }

        return;
      }

      // Facing sub-toggle: Photo + Month / Month + Month
      // Reload required — DOM state after month-pairing can't be cleanly
      // converted to photo-spreading (or vice versa)
      if (target.dataset.facing) {
        saveVisibleMonth();
        saveConfig({ layout: target.dataset.facing });
        const url = new URL(window.location.href);
        url.searchParams.set("layout", target.dataset.facing);
        window.location.href = buildReloadUrl(url);
        return;
      }

      // Scaling toggle — client-side only, no reload
      if (target.dataset.scaling) {
        saveConfig({ scaling: target.dataset.scaling });
        const url = new URL(window.location.href);
        url.searchParams.set("scaling", target.dataset.scaling);
        history.replaceState(null, "", url.toString());

        // Toggle active pill
        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        // Update data attribute
        const config = document.querySelector(".config") as HTMLElement;
        config.dataset.scaling = target.dataset.scaling;

        // Update all spread-image scaling classes
        document.querySelectorAll(".spread-image:not(.empty)").forEach((el) => {
          el.classList.remove("scaling-fit", "scaling-crop");
          el.classList.add(`scaling-${target.dataset.scaling}`);
        });
        return;
      }

      // URL-reloading options: size, orientation, margin, length
      if (
        target.dataset.size ||
        target.dataset.orientation ||
        target.dataset.margin !== undefined ||
        target.dataset.length
      ) {
        // Save current visible month before navigating
        saveVisibleMonth();

        const updates: Record<string, string> = {};
        const url = new URL(window.location.href);
        if (target.dataset.size) { url.searchParams.set("size", target.dataset.size); updates.size = target.dataset.size; }
        if (target.dataset.orientation) { url.searchParams.set("orientation", target.dataset.orientation); updates.orientation = target.dataset.orientation; }
        if (target.dataset.margin !== undefined) { url.searchParams.set("margin", target.dataset.margin); updates.margin = target.dataset.margin; }
        if (target.dataset.length) { url.searchParams.set("length", target.dataset.length); updates.length = target.dataset.length; }
        saveConfig(updates);
        window.location.href = buildReloadUrl(url);
        return;
      }

      // Gutter toggle — client-side only
      if (target.dataset.gutter !== undefined) {
        saveConfig({ gutter: target.dataset.gutter });
        const url = new URL(window.location.href);
        url.searchParams.set("gutter", target.dataset.gutter);
        history.replaceState(null, "", buildHref(url));

        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        const config = document.querySelector(".config") as HTMLElement;
        config.dataset.gutter = target.dataset.gutter;
        scalePages();
        return;
      }

      // DPI pills — client-side toggle only
      if (target.dataset.dpi) {
        sidebar.querySelectorAll("[data-dpi]").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");
        return;
      }

      // Feed toggles — update include param and reload
      if (target.dataset.feed) {
        saveVisibleMonth();

        const url = new URL(window.location.href);
        const includeParam = url.searchParams.get("include");
        const defaults = ["lunar:phases", "solar:season"];
        let tokens: string[];
        if (includeParam !== null) {
          tokens = includeParam ? includeParam.split(",") : [];
        } else {
          tokens = [...defaults];
        }

        const feed = target.dataset.feed;
        const isActive =
          tokens.includes(feed) ||
          (feed === "lunar:phases" && tokens.some((t) => t.startsWith("lunar:"))) ||
          (feed === "movies" && tokens.some((t) => t.startsWith("movies")));

        if (isActive) {
          if (feed === "lunar:phases") {
            tokens = tokens.filter((t) => !t.startsWith("lunar:"));
          } else if (feed === "movies") {
            tokens = tokens.filter((t) => !t.startsWith("movies"));
          } else {
            tokens = tokens.filter((t) => t !== feed);
          }
        } else {
          tokens.push(feed);
        }

        const includeStr = tokens.join(",");
        url.searchParams.set("include", includeStr);
        saveInclude(includeStr);
        window.location.href = buildReloadUrl(url);
        return;
      }
    }

    // Export buttons
    if (target.classList.contains("config-button")) {
      if (target.dataset.action === "save") exportCurrentView();
      if (target.dataset.action === "save-all") exportAllMonths();
      if (target.dataset.action === "save-pdf") exportPDF();
    }

    // My Feeds: remove custom feed (check before toggle — × is inside pill)
    const removeBtn = target.closest("[data-remove-feed]") as HTMLElement | null;
    if (removeBtn) {
      saveVisibleMonth();
      removeCustomFeed(removeBtn.dataset.removeFeed!);
      const url = new URL(window.location.href);
      appendCustomFeeds(url);
      window.location.href = buildHref(url);
      return;
    }

    // My Feeds: toggle custom feed
    const feedPill = target.closest("[data-custom-feed]") as HTMLElement | null;
    if (feedPill) {
      saveVisibleMonth();
      const id = feedPill.dataset.customFeed!;
      const isActive = feedPill.classList.contains("active");
      toggleCustomFeed(id, !isActive);
      const url = new URL(window.location.href);
      appendCustomFeeds(url);
      window.location.href = buildHref(url);
      return;
    }
  });

  // My Feeds: add custom feed via input
  const addBtn = sidebar.querySelector(".my-feed-add-btn");
  const addInput = sidebar.querySelector(".my-feed-input") as HTMLInputElement | null;
  if (addBtn && addInput) {
    const doAdd = () => {
      const url = addInput.value.trim();
      if (!url) return;

      // Derive a short name from the URL hostname
      try {
        const hostname = new URL(url).hostname;
        const name = hostname.replace(/^(www|p\d+-caldav)\./, "").split(".")[0];
        addCustomFeed(name, url);
      } catch {
        addCustomFeed("Custom Feed", url);
      }
      addInput.value = "";

      saveVisibleMonth();
      const reloadUrl = new URL(window.location.href);
      appendCustomFeeds(reloadUrl);
      window.location.href = buildHref(reloadUrl);
    };

    addBtn.addEventListener("click", doAdd);
    addInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); doAdd(); }
    });
  }
}

// ─── My Feeds hydration ───────────────────────────────────────────

/** Update custom feed names from server-provided ICS calendar names */
function updateFeedNames() {
  const config = document.querySelector(".config") as HTMLElement | null;
  const raw = config?.dataset.feedNames;
  if (!raw) return;

  let feedNames: Record<string, string>;
  try { feedNames = JSON.parse(raw); } catch { return; }

  const state = loadState();
  if (!state) return;

  let changed = false;
  for (const cf of state.customFeeds) {
    const serverName = feedNames[cf.url];
    if (serverName && cf.name !== serverName) {
      cf.name = serverName;
      changed = true;
    }
  }
  if (changed) saveState(state);
}

/** Populate the My Feeds list from localStorage */
export function hydrateMyFeeds() {
  updateFeedNames();

  const list = document.querySelector(".my-feeds-list");
  if (!list) return;

  const state = loadState();
  if (!state?.customFeeds.length) return;

  const items = state.customFeeds.map((cf) => {
    const active = cf.enabled ? " active" : "";
    return `<button class="config-option my-feed-pill${active}" data-custom-feed="${cf.id}">${cf.name}<span class="my-feed-remove" data-remove-feed="${cf.id}" title="Remove">&times;</span></button>`;
  });
  list.innerHTML = items.join("\n");
}
