import type { FeedPlugin } from "../../shared/src/types";
import { FEED_ICONS, eventIcon } from "../../shared/src/icons";
import fixture from "./fixtures/holidays-us.ics";

const plugin: FeedPlugin = {
  id: "holidays-us",
  name: "US Holidays",
  endpoint: "/feeds/holidays-us.ics",
  sourceUrl:
    "https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics",
  category: "holidays",
  renderMode: "event-list",
  fixture,
  dedupeKeys: {
    // Our fixture names
    "New Year's Day": "us-new-years-day",
    "Martin Luther King Jr. Day": "us-mlk-day",
    "Presidents' Day": "us-presidents-day",
    "Presidents Day": "us-presidents-day",
    "Valentine's Day": "us-valentines-day",
    "St. Patrick's Day": "us-st-patricks-day",
    "Easter": "us-easter",
    "Mother's Day": "us-mothers-day",
    "Cinco de Mayo": "us-cinco-de-mayo",
    "Memorial Day": "us-memorial-day",
    "Juneteenth": "us-juneteenth",
    "Father's Day": "us-fathers-day",
    "Independence Day": "us-independence-day",
    "Labor Day": "us-labor-day",
    "Indigenous Peoples' Day": "us-indigenous-peoples-day",
    "Halloween": "us-halloween",
    "Veterans Day": "us-veterans-day",
    "Election Day": "us-election-day",
    "Thanksgiving": "us-thanksgiving",
    "Black Friday": "us-black-friday",
    "Christmas Day": "us-christmas",
    "New Year's Eve": "us-new-years-eve",
    // Google Calendar name variants
    "Easter Sunday": "us-easter",
    "Thanksgiving Day": "us-thanksgiving",
    "Columbus Day": "us-indigenous-peoples-day",
    "Christmas Eve": "us-christmas-eve",
    "Washington's Birthday": "us-presidents-day",
    "Juneteenth National Independence Day": "us-juneteenth",
  },
  icon: eventIcon(FEED_ICONS.star.path, FEED_ICONS.star.viewBox),
};

export default plugin;
