import type { FeedPlugin } from "../../shared/src/types";
import fixture from "./fixtures/bhs-cheer-2026.ics";

const plugin: FeedPlugin = {
  id: "bhs-cheer",
  name: "BHS Cheer",
  endpoint: "/feeds/bhs-cheer.ics",
  category: "school",
  renderMode: "event-list",
  defaultInclude: [],
  fixture,
  icon: `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0M4.5 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M4 8a3 1.75 0 1 0 6 0 3 1.75 0 0 0-6 0" clip-rule="evenodd"/></svg>`,
};

export default plugin;
