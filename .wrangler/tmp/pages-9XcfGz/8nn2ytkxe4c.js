// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/todd/Github/CascadeProjects/calendar-thing/.wrangler/tmp/pages-9XcfGz/bundledWorker-0.04413021625900693.mjs";
import { isRoutingRuleMatch } from "/Users/todd/Github/CascadeProjects/calendar-thing/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/todd/Github/CascadeProjects/calendar-thing/.wrangler/tmp/pages-9XcfGz/bundledWorker-0.04413021625900693.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (worker.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return worker.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=8nn2ytkxe4c.js.map
