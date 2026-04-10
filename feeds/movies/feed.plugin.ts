import type { FeedPlugin } from "../../shared/src/types";
import fixture from "./fixtures/theatrical.ics";

const icon = `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M0 3.5C0 1.567 1.567 0 3.5 0S7 1.567 7 3.5 5.433 7 3.5 7 0 5.433 0 3.5ZM10.5 2C9.119 2 8 3.119 8 4.5S9.119 7 10.5 7C11.881 7 13 5.881 13 4.5S11.881 2 10.5 2ZM1.912 9.609c0-.89.722-1.612 1.612-1.612h6.114c.89 0 1.612.722 1.612 1.612v2.779c0 .89-.722 1.612-1.612 1.612H3.524c-.89 0-1.612-.722-1.612-1.612V9.609Zm11.966.14c0-.414-.336-.75-.75-.75-.414 0-.75.336-.75.75v2.5c0 .414.336.75.75.75.414 0 .75-.336.75-.75V9.749Z" clip-rule="evenodd"/></svg>`;

export const theatrical: FeedPlugin = {
  id: "movies-theatrical",
  name: "Theatrical Releases",
  binding: "MOVIE_RELEASE",
  endpoint: "/feeds/movies-theatrical.ics",
  prodUrl: "https://calendar-movies.seaofclouds.workers.dev",
  category: "movie",
  renderMode: "event-list",
  fixture,
  stripSummaryPrefix: "🎥 ",
  icon,
};

export const digital: FeedPlugin = {
  id: "movies-digital",
  name: "Digital Releases",
  binding: "MOVIE_RELEASE",
  endpoint: "/feeds/movies-digital.ics",
  prodUrl: "https://calendar-movies.seaofclouds.workers.dev",
  category: "movie",
  renderMode: "event-list",
  fixture: "", // no fixture for digital yet
  stripSummaryPrefix: "🎥 ",
  icon,
};

export default theatrical;
