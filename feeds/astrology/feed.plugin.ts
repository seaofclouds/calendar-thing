import type { FeedPlugin } from "../../shared/src/types";
import { ZODIAC_ICONS } from "../../shared/src/icons";
import fixture from "./fixtures/astrology.ics";

const plugin: FeedPlugin = {
  id: "astrology",
  name: "Astrology",
  binding: "ASTROLOGY",
  endpoint: "/feeds/astrology.ics",
  prodUrl: "https://calendar-astrology.seaofclouds.workers.dev",
  category: "astrology",
  renderMode: "event-list",
  defaultInclude: ["astrology"],
  fixture,
  signIcons: ZODIAC_ICONS,
};

export default plugin;
