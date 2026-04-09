import type { FeedPlugin } from "../../packages/feed-types/src/types";
import fixture from "./fixtures/astronomy.ics";

const plugin: FeedPlugin & { fixture: string } = {
  id: "astronomy",
  name: "Moon Phases & Solar Events",
  binding: "ASTRONOMY",
  endpoint: "/feeds/astronomy.ics",
  prodUrl: "https://astronomy-calendar.seaofclouds.workers.dev",
  category: "astronomy",
  renderMode: "day-marker",
  fixture,
  includeTokens: {
    "lunar:full": "lunar-full",
    "lunar:new": "lunar-new",
    "lunar:quarter": "lunar-quarter",
    "solar:season": "solar",
  },
  tokenAliases: {
    "lunar:phases": ["lunar:full", "lunar:new", "lunar:quarter"],
  },
  defaultInclude: ["lunar:full", "lunar:new", "lunar:quarter", "solar:season"],
  signIcons: {
    "Full Moon": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/></svg>`,
    "New Moon": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="black" stroke="black" stroke-width="2"/></svg>`,
    "First Quarter": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/><path d="M10 1.5 A8.5 8.5 0 0 0 10 18.5 Z" fill="black"/></svg>`,
    "Last Quarter": `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/><path d="M10 1.5 A8.5 8.5 0 0 1 10 18.5 Z" fill="black"/></svg>`,
    "Vernal Equinox": `<div class="day-marker-equinox"></div>`,
    "Summer Solstice": `<div class="day-marker-solstice"></div>`,
    "Autumnal Equinox": `<div class="day-marker-equinox"></div>`,
    "Winter Solstice": `<div class="day-marker-solstice"></div>`,
  },
};

export default plugin;
