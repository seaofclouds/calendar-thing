globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as decodeKey } from './chunks/astro/server_BXn8oDq3.mjs';
import './chunks/astro-designed-error-pages_ooUQbXF3.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DP_6rnQF.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/todd/Github/CascadeProjects/calendar-thing/","cacheDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/node_modules/.astro/","outDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/","srcDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/src/","publicDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/public/","buildClientDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/","buildServerDir":"file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"never"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"never"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_path_.CzpO_nMZ.css"}],"routeData":{"route":"/[...path]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?$","segments":[[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"src/pages/[...path].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"never"}}}],"base":"/","trailingSlash":"never","compressHTML":true,"componentMetadata":[["/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/[...path]@_@astro":"pages/_---path_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BnbhDUTk.mjs","/Users/todd/Github/CascadeProjects/calendar-thing/src/components/Calendar":"_astro/Calendar.BU2XUHqA.js","@astrojs/react/client.js":"_astro/client.DuNRtjJN.js","/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro?astro&type=script&index=0&lang.ts":"_astro/_...path_.astro_astro_type_script_index_0_lang.C7LH_0BE.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro?astro&type=script&index=0&lang.ts","console.log(\"Calendar props:\",{year:yearNum,header:showHeader,testing:isTesting});window.addEventListener(\"error\",r=>{console.error(\"Client error:\",r);const e=document.getElementById(\"error-display\");e&&(e.style.display=\"block\",e.textContent=r.message)});"]],"assets":["/_astro/_path_.CzpO_nMZ.css","/_astro/Calendar.BU2XUHqA.js","/_astro/client.DuNRtjJN.js","/_astro/index.5vR-3Izp.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/_worker.js/_astro/_path_.CzpO_nMZ.css","/_worker.js/chunks/_@astro-renderers_O4SP2Us9.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_DGuYgNaH.mjs","/_worker.js/chunks/astro-designed-error-pages_ooUQbXF3.mjs","/_worker.js/chunks/astro_Dvk599kh.mjs","/_worker.js/chunks/index_CdAnqvIQ.mjs","/_worker.js/chunks/noop-middleware_DP_6rnQF.mjs","/_worker.js/pages/_---path_.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/chunks/astro/server_BXn8oDq3.mjs"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"9RGBlstoXZ12NoL21Y6HZLQijczxtBctKvGc9Vw/GQo="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
