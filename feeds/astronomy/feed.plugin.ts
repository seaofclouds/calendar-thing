import type { FeedPlugin } from "../../shared/src/types";
import { ASTRONOMY_ICONS } from "../../shared/src/icons";
import fixture from "./fixtures/astronomy.ics";

const plugin: FeedPlugin = {
  id: "astronomy",
  name: "Moon Phases & Solar Events",
  binding: "ASTRONOMY",
  endpoint: "/feeds/astronomy.ics",
  prodUrl: "https://calendar-astronomy.seaofclouds.workers.dev",
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
  signIcons: ASTRONOMY_ICONS,
};

export default plugin;
