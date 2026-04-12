import type { FeedPlugin } from "../../shared/src/types";
import fixture from "./fixtures/holidays-us.ics";

const plugin: FeedPlugin = {
  id: "holidays-us",
  name: "US Holidays",
  endpoint: "/feeds/holidays-us.ics",
  category: "holidays",
  renderMode: "event-list",
  fixture,
  dedupeKeys: {
    "New Year's Day": "us-new-years-day",
    "Martin Luther King Jr. Day": "us-mlk-day",
    "Presidents' Day": "us-presidents-day",
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
  },
  icon: `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7 0C3.134 0 0 3.134 0 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7Zm0 1.5c1.13 0 2.176.345 3.05.93L3.43 10.05A5.47 5.47 0 0 1 1.5 7c0-3.038 2.462-5.5 5.5-5.5Zm0 11c-1.13 0-2.176-.345-3.05-.93l6.62-7.62A5.47 5.47 0 0 1 12.5 7c0 3.038-2.462 5.5-5.5 5.5Z"/></svg>`,
};

export default plugin;
