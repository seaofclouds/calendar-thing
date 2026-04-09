import type { FeedPlugin } from "../../packages/feed-types/src/types";
import fixture from "./fixtures/moon.ics";

const plugin: FeedPlugin & { fixture: string } = {
  id: "moon",
  name: "Moon Phases & Solar Events",
  binding: "MOON_PHASE",
  endpoint: "/feeds/moon.ics",
  prodUrl: "https://moon-phase-calendar.seaofclouds.workers.dev",
  category: "moon",
  renderMode: "day-marker",
  fixture,
  includeTokens: {
    "moon:full": "full_moon",
    "moon:new": "new_moon",
    "solar:season": "solar",
  },
  defaultInclude: ["moon:full", "solar:season"],
  signIcons: {
    "Full Moon": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/></svg>`,
    "New Moon": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="black" stroke="black" stroke-width="2"/></svg>`,
    "Vernal Equinox": `<div class="day-marker-equinox"></div>`,
    "Summer Solstice": `<div class="day-marker-solstice"></div>`,
    "Autumnal Equinox": `<div class="day-marker-equinox"></div>`,
    "Winter Solstice": `<div class="day-marker-solstice"></div>`,
  },
};

export default plugin;
