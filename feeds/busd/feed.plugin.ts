import type { FeedPlugin } from "../../shared/src/types";
import fixture from "./fixtures/busd-2025-2026.ics";

const plugin: FeedPlugin = {
  id: "busd",
  name: "BUSD School Calendar",
  endpoint: "/feeds/busd.ics",
  category: "school",
  renderMode: "event-list",
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
  icon: `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M9.255.032c-.773-.042-1.47-.042-2.242 0-.357.019-.652.294-.707.659-.054.357-.071.695-.052 1.04-.001.017-.002.034-.002.051v2.297c-1.287.285-2.407 1.331-2.485 3.15-.005.073-.009.147-.013.22v6.52c.728.016 1.483.026 2.246.031V11.92c0-.553.448-1 1-1s1 .447 1 1v2.067L8 14c.763-.005 1.518-.015 2.246-.031V7.394l-.01-.16c-.077-1.8-1.197-2.853-2.485-3.149V2.92c.498.01.983.001 1.503-.028.357-.02.652-.294.707-.659.079-.528.079-1.015 0-1.542-.055-.365-.35-.64-.707-.66ZM11.496 7.697v6.238c.325-.011.64-.023.946-.036.744-.032 1.335-.638 1.427-1.407.085-.712.131-1.192.131-1.68 0-.487-.046-.967-.131-1.679-.092-.77-.683-1.376-1.427-1.407-.243-.01-.583-.02-.946-.03ZM2.504 13.935V7.697c-.363.009-.702.019-.946.029-.743.031-1.334.637-1.426 1.407C.046 9.845 0 10.325 0 10.813c0 .487.046.967.131 1.679.092.77.683 1.376 1.427 1.407.305.013.621.025.946.036ZM7 8.687c.705 0 1.102-.41 1.102-1.138 0-.728-.397-1.138-1.102-1.138s-1.102.41-1.102 1.138c0 .728.397 1.138 1.102 1.138Z" clip-rule="evenodd"/></svg>`,
};

export default plugin;
