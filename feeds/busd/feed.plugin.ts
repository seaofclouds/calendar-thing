import type { FeedPlugin } from "../../shared/src/types";
import { FEED_ICONS, eventIcon } from "../../shared/src/icons";
import fixture from "./fixtures/busd-2025-2026.ics";

const plugin: FeedPlugin = {
  id: "busd",
  name: "BUSD School Calendar",
  endpoint: "/feeds/busd.ics",
  category: "school",
  renderMode: "event-list",
  defaultInclude: ["busd"],
  fixture,
  stripSummarySuffix: " Holiday",
  dedupeKeys: {
    "Independence Day": "us-independence-day",
    "Labor Day": "us-labor-day",
    "Veterans' Day": "us-veterans-day",
    "Memorial Day": "us-memorial-day",
    "Martin Luther King Jr. Birthday": "us-mlk-day",
    "Presidents Day": "us-presidents-day",
    "Indigenous Peoples Day (No school)": "us-indigenous-peoples-day",
    "Juneteenth": "us-juneteenth",
  },
  icon: eventIcon(FEED_ICONS.school.path, FEED_ICONS.school.viewBox),
};

export default plugin;
