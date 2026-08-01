import type { FeedPlugin } from "../../shared/src/types";
import { FEED_ICONS, eventIcon } from "../../shared/src/icons";
import fixture from "./fixtures/theatrical.ics";

const icon = eventIcon(FEED_ICONS.film.path, FEED_ICONS.film.viewBox);

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
