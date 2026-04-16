import type { FeedPlugin } from "../../shared/src/types";
import { FEED_ICONS, eventIcon } from "../../shared/src/icons";

const plugin: FeedPlugin = {
  id: "birthdays",
  name: "Birthdays",
  endpoint: "/feeds/birthdays.ics",
  category: "birthday",
  renderMode: "event-list",
  defaultInclude: [],
  sourceUrlEnv: "BIRTHDAY_FEED_URL",
  stripSummarySuffix: "'s Birthday",
  icon: eventIcon(FEED_ICONS.cake.path, FEED_ICONS.cake.viewBox),
};

export default plugin;
