var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// .wrangler/tmp/bundle-mRILPr/checked-fetch.js
function checkURL(request, init2) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init2) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-mRILPr/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init2] = argArray;
        checkURL(request, init2);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// .wrangler/tmp/pages-9XcfGz/chunks/astro/server_BXn8oDq3.mjs
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
function validateArgs(args) {
  if (args.length !== 3)
    return false;
  if (!args[0] || typeof args[0] !== "object")
    return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = /* @__PURE__ */ __name((...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  }, "fn");
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}
function createAstroGlobFn() {
  const globHandler = /* @__PURE__ */ __name((importMetaGlobResult) => {
    console.warn(`Astro.glob is deprecated and will be removed in a future major version of Astro.
Use import.meta.glob instead: https://vitejs.dev/guide/features.html#glob-import`);
    if (typeof importMetaGlobResult === "string") {
      throw new AstroError({
        ...AstroGlobUsedOutside,
        message: AstroGlobUsedOutside.message(JSON.stringify(importMetaGlobResult))
      });
    }
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new AstroError({
        ...AstroGlobNoMatch,
        message: AstroGlobNoMatch.message(JSON.stringify(importMetaGlobResult))
      });
    }
    return Promise.all(allEntries.map((fn) => fn()));
  }, "globHandler");
  return globHandler;
}
function createAstro(site) {
  return {
    // TODO: this is no longer necessary for `Astro.site`
    // but it somehow allows working around caching issues in content collections for some tests
    site: void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    glob: createAstroGlobFn()
  };
}
function init(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
  return function(txt) {
    if (!$.enabled || txt == null)
      return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  const handler = mod[method] ?? mod["ALL"];
  if (isPrerendered && method !== "GET") {
    logger.warn(
      "router",
      `${url.pathname} ${bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  return response;
}
function isPromise(value) {
  return !!value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) {
    for await (const chunk of streamAsyncIterator(iterable)) {
      yield unescapeHTML(chunk);
    }
  } else {
    for await (const chunk of iterable) {
      yield unescapeHTML(chunk);
    }
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (str[Symbol.for("astro:slot-string")]) {
      return str;
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str || hasGetReader(str)) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e)
    n += e;
  else if ("object" == typeof e)
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++)
        e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else
      for (f in e)
        e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
    (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Infinity) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === -Infinity) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.componentMetadata.has(factory.moduleId) && hint === "none") {
    hint = result.componentMetadata.get(factory.moduleId).propagation;
  }
  return hint === "in-tree" || hint === "self";
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `${ISLAND_STYLES}<script>${getDirectiveScriptText(result, directive)};${astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}<\/script>`;
  }
  return "";
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)?.replace(
      /<\/script>/g,
      "\\x3C/script>"
    )};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (typeof value === "string" && value.includes("&") && isHttpUrl(value)) {
    return markHTMLString(` ${key}="${toAttributeString(value, false)}"`);
  }
  if (htmlBooleanAttributes.test(key)) {
    return markHTMLString(value ? ` ${key}` : "");
  }
  if (value === "") {
    return markHTMLString(` ${key}`);
  }
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}
function renderToBufferDestination(bufferRenderFunction) {
  const renderer = new BufferedRenderer(bufferRenderFunction);
  return renderer;
}
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function isHttpUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return VALID_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map(
    (style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style)
  );
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  let content = styles.join("\n") + links.join("\n") + scripts.join("\n");
  if (result._metadata.extraHead.length > 0) {
    for (const part of result._metadata.extraHead) {
      content += part;
    }
  }
  return markHTMLString(content);
}
function renderHead() {
  return createRenderInstruction({ type: "head" });
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
function isSlotString(str) {
  return !!str[slotString];
}
function renderSlot(result, slotted, fallback) {
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        if (chunk.instructions) {
          instructions ??= [];
          instructions.push(...chunk.instructions);
        }
      } else if (chunk instanceof Response)
        return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
        if (prescriptType) {
          let prescripts = getPrescripts(result, prescriptType, hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (result._metadata.hasRenderedHead || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (result._metadata.hasRenderedHead || result._metadata.headInTree || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c = chunk;
    if (c.instructions) {
      for (const instr of c.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder$1.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder$1.encode(stringified.toString());
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}
async function renderChild(destination, child) {
  if (isPromise(child)) {
    child = await child;
  }
  if (child instanceof SlotString) {
    destination.write(child);
  } else if (isHTMLString(child)) {
    destination.write(child);
  } else if (Array.isArray(child)) {
    const childRenders = child.map((c) => {
      return renderToBufferDestination((bufferDestination) => {
        return renderChild(bufferDestination, c);
      });
    });
    for (const childRender of childRenders) {
      if (!childRender)
        continue;
      await childRender.renderToFinalDestination(destination);
    }
  } else if (typeof child === "function") {
    await renderChild(destination, child());
  } else if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
  } else if (!child && child !== 0)
    ;
  else if (isRenderInstance(child)) {
    await child.render(destination);
  } else if (isRenderTemplateResult(child)) {
    await child.render(destination);
  } else if (isAstroComponentInstance(child)) {
    await child.render(destination);
  } else if (ArrayBuffer.isView(child)) {
    destination.write(child);
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    for await (const value of child) {
      await renderChild(destination, value);
    }
  } else {
    destination.write(child);
  }
}
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (prop.startsWith("client:")) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory)) {
    result._metadata.propagators.add(instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response)
        return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder$1.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  const iterator = result._metadata.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(result);
    if (isHeadAndContent(returnValue)) {
      result._metadata.extraHead.push(returnValue.head);
    }
  }
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled)
        return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        length += buffer[i].length;
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        const item = buffer[i];
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder$1.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArray(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next?.resolve();
      } else if (buffer.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderPromise = templateResult.render(destination);
  renderPromise.then(() => {
    renderingComplete = true;
    next?.resolve();
  }).catch((err) => {
    error2 = err;
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function encodeHexUpperCase(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += alphabetUpperCase[data[i] >> 4];
    result += alphabetUpperCase[data[i] & 15];
  }
  return result;
}
function decodeHex(data) {
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const result = new Uint8Array(data.length / 2);
  for (let i = 0; i < data.length; i += 2) {
    if (!(data[i] in decodeMap)) {
      throw new Error("Invalid character");
    }
    if (!(data[i + 1] in decodeMap)) {
      throw new Error("Invalid character");
    }
    result[i / 2] |= decodeMap[data[i]] << 4;
    result[i / 2] |= decodeMap[data[i + 1]];
  }
  return result;
}
function encodeBase64(bytes) {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}
function encodeBase64_internal(bytes, alphabet, padding) {
  let result = "";
  for (let i = 0; i < bytes.byteLength; i += 3) {
    let buffer = 0;
    let bufferBitSize = 0;
    for (let j = 0; j < 3 && i + j < bytes.byteLength; j++) {
      buffer = buffer << 8 | bytes[i + j];
      bufferBitSize += 8;
    }
    for (let j = 0; j < 4; j++) {
      if (bufferBitSize >= 6) {
        result += alphabet[buffer >> bufferBitSize - 6 & 63];
        bufferBitSize -= 6;
      } else if (bufferBitSize > 0) {
        result += alphabet[buffer << 6 - bufferBitSize & 63];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}
function decodeBase64(encoded) {
  return decodeBase64_internal(encoded, base64DecodeMap, DecodingPadding.Required);
}
function decodeBase64_internal(encoded, decodeMap2, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i = 0; i < encoded.length; i += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j = 0; j < 4; j++) {
      if (padding === DecodingPadding.Required && encoded[i + j] === "=") {
        continue;
      }
      if (padding === DecodingPadding.Ignore && (i + j >= encoded.length || encoded[i + j] === "=")) {
        continue;
      }
      if (j > 0 && encoded[i + j - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i + j] in decodeMap2)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap2[encoded[i + j]] << (3 - j) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) {
        unused = chunk & 65535;
      } else if (bitsRead === 18) {
        unused = chunk & 255;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i2 = 0; i2 < byteLength; i2++) {
      result[totalBytes] = chunk >> 16 - i2 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes, ALGORITHM, true, ["encrypt", "decrypt"]);
}
async function encryptString(key, raw) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder.encode(raw);
  const buffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    data
  );
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer));
}
async function decryptString(key, encoded) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    dataArray
  );
  const decryptedString = decoder.decode(decryptedBuffer);
  return decryptedString;
}
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function safeJsonStringify(obj) {
  return JSON.stringify(obj).replace(SCRIPT_RE, SCRIPT_REPLACER).replace(COMMENT_RE, COMMENT_REPLACER);
}
function createSearchParams(componentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", componentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  const url = pathname + "?" + params.toString();
  const chars = url.length;
  return chars < 2048;
}
function renderServerIsland(result, _displayName, props, slots) {
  return {
    async render(destination) {
      const componentPath = props["server:component-path"];
      const componentExport = props["server:component-export"];
      const componentId = result.serverIslandNameMap.get(componentPath);
      if (!componentId) {
        throw new Error(`Could not find server component name`);
      }
      for (const key2 of Object.keys(props)) {
        if (internalProps.has(key2)) {
          delete props[key2];
        }
      }
      destination.write("<!--[if astro]>server-island-start<![endif]-->");
      const renderedSlots = {};
      for (const name in slots) {
        if (name !== "fallback") {
          const content = await renderSlotToString(result, slots[name]);
          renderedSlots[name] = content.toString();
        } else {
          await renderChild(destination, slots.fallback(result));
        }
      }
      const key = await result.key;
      const propsEncrypted = Object.keys(props).length === 0 ? "" : await encryptString(key, JSON.stringify(props));
      const hostId = crypto.randomUUID();
      const slash2 = result.base.endsWith("/") ? "" : "/";
      let serverIslandUrl = `${result.base}${slash2}_server-islands/${componentId}${result.trailingSlash === "always" ? "/" : ""}`;
      const potentialSearchParams = createSearchParams(
        componentExport,
        propsEncrypted,
        safeJsonStringify(renderedSlots)
      );
      const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
      if (useGETRequest) {
        serverIslandUrl += "?" + potentialSearchParams.toString();
        destination.write(
          `<link rel="preload" as="fetch" href="${serverIslandUrl}" crossorigin="anonymous">`
        );
      }
      destination.write(`<script async type="module" data-island-id="${hostId}">
let script = document.querySelector('script[data-island-id="${hostId}"]');

${useGETRequest ? (
        // GET request
        `let response = await fetch('${serverIslandUrl}');
`
      ) : (
        // POST request
        `let data = {
	componentExport: ${safeJsonStringify(componentExport)},
	encryptedProps: ${safeJsonStringify(propsEncrypted)},
	slots: ${safeJsonStringify(renderedSlots)},
};

let response = await fetch('${serverIslandUrl}', {
	method: 'POST',
	body: JSON.stringify(data),
});
`
      )}
if (script) {
	if(
		response.status === 200 
		&& response.headers.has('content-type') 
		&& response.headers.get('content-type').split(";")[0].trim() === 'text/html') {
		let html = await response.text();
	
		// Swap!
		while(script.previousSibling &&
			script.previousSibling.nodeType !== 8 &&
			script.previousSibling.data !== '[if astro]>server-island-start<![endif]') {
			script.previousSibling.remove();
		}
		script.previousSibling?.remove();
	
		let frag = document.createRange().createContextualFragment(html);
		script.before(frag);
	}
	script.remove();
}
<\/script>`);
    }
  };
}
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r2) => r2.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error2;
      for (const r2 of renderers2) {
        try {
          if (await r2.ssr.check.call({ result }, Component, props, children)) {
            renderer = r2;
            break;
          }
        } catch (e) {
          error2 ??= e;
        }
      }
      if (!renderer && error2) {
        throw error2;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r2) => "`" + r2 + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r2) => r2.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r2) => probableRendererNames.includes(r2.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r2) => "`" + r2 + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response)
          return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template2 = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template2}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlotToString(result, slots?.default);
  return {
    render(destination) {
      if (children == null)
        return;
      destination.write(children);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    return renderServerIsland(result, displayName, props, slots);
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    async render(destination) {
      await instance.render(destination);
    }
  };
}
async function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    Component = await Component.catch(handleCancellation);
  }
  if (isFragmentComponent(Component)) {
    return await renderFragmentComponent(result, slots).catch(handleCancellation);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return await renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return await renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
  __name(handleCancellation, "handleCancellation");
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response)
          return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderToString(result, vnode.type, props, slots);
        if (str instanceof Response) {
          throw str;
        }
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = /* @__PURE__ */ __name(function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      }, "extractSlots2");
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
async function renderScript(result, id) {
  if (result._metadata.renderedScripts.has(id))
    return;
  result._metadata.renderedScripts.add(id);
  const inlined = result.inlinedScripts.get(id);
  if (inlined != null) {
    if (inlined) {
      return markHTMLString(`<script type="module">${inlined}<\/script>`);
    } else {
      return "";
    }
  }
  const resolved = await result.resolve(id);
  return markHTMLString(`<script type="module" src="${resolved}"><\/script>`);
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    const str = await renderComponentToString(
      result,
      componentFactory.name,
      componentFactory,
      pageProps,
      {},
      true,
      route
    );
    const bytes = encoder$1.encode(str);
    return new Response(bytes, {
      headers: new Headers([
        ["Content-Type", "text/html"],
        ["Content-Length", bytes.byteLength.toString()]
      ])
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response)
    return body;
  const init2 = result.response;
  const headers = new Headers(init2.headers);
  if (!streaming && typeof body === "string") {
    body = encoder$1.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init2.status;
  if (route?.route === "/404") {
    status = 404;
  } else if (route?.route === "/500") {
    status = 500;
  }
  if (status) {
    return new Response(body, { ...init2, headers, status });
  } else {
    return new Response(body, { ...init2, headers });
  }
}
function requireCssesc() {
  if (hasRequiredCssesc)
    return cssesc_1;
  hasRequiredCssesc = 1;
  var object = {};
  var hasOwnProperty = object.hasOwnProperty;
  var merge = /* @__PURE__ */ __name(function merge2(options, defaults) {
    if (!options) {
      return defaults;
    }
    var result = {};
    for (var key in defaults) {
      result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
    }
    return result;
  }, "merge");
  var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
  var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
  var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
  var cssesc = /* @__PURE__ */ __name(function cssesc2(string, options) {
    options = merge(options, cssesc2.options);
    if (options.quotes != "single" && options.quotes != "double") {
      options.quotes = "single";
    }
    var quote = options.quotes == "double" ? '"' : "'";
    var isIdentifier = options.isIdentifier;
    var firstChar = string.charAt(0);
    var output = "";
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var character = string.charAt(counter++);
      var codePoint = character.charCodeAt();
      var value = void 0;
      if (codePoint < 32 || codePoint > 126) {
        if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
          var extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
          } else {
            counter--;
          }
        }
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else {
        if (options.escapeEverything) {
          if (regexAnySingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          }
        } else if (/[\t\n\f\r\x0B]/.test(character)) {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = character;
        }
      }
      output += value;
    }
    if (isIdentifier) {
      if (/^-[-\d]/.test(output)) {
        output = "\\-" + output.slice(1);
      } else if (/\d/.test(firstChar)) {
        output = "\\3" + firstChar + " " + output.slice(1);
      }
    }
    output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
      if ($1 && $1.length % 2) {
        return $0;
      }
      return ($1 || "") + $2;
    });
    if (!isIdentifier && options.wrap) {
      return quote + output + quote;
    }
    return output;
  }, "cssesc");
  cssesc.options = {
    "escapeEverything": false,
    "isIdentifier": false,
    "quotes": "single",
    "wrap": false
  };
  cssesc.version = "3.0.0";
  cssesc_1 = cssesc;
  return cssesc_1;
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
var ASTRO_VERSION, REROUTE_DIRECTIVE_HEADER, REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE, NOOP_MIDDLEWARE_HEADER, ROUTE_TYPE_HEADER, DEFAULT_404_COMPONENT, REROUTABLE_STATUS_CODES, clientAddressSymbol, originPathnameSymbol, responseSentSymbol, ClientAddressNotAvailable, PrerenderClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, PrerenderDynamicEndpointPathCollide, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, LocalsReassigned, AstroResponseHeadersReassigned, SessionStorageInitError, SessionStorageSaveError, AstroGlobUsedOutside, AstroGlobNoMatch, i18nNoLocaleFoundInPath, RewriteWithBodyUsed, ForbiddenRewrite, AstroError, FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY, $, bold, dim, red, yellow, blue, replace, ca, esca, pe, escape, escapeHTML, HTMLBytes, HTMLString, markHTMLString, AstroJSX, RenderInstructionSymbol, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, ISLAND_STYLES, voidElementNames, htmlBooleanAttributes, AMPERSAND_REGEX, DOUBLE_QUOTE_REGEX, STATIC_DIRECTIVES, toIdent, toAttributeString, kebab, toStyleString, noop, BufferedRenderer, isNode, isDeno, VALID_PROTOCOLS, uniqueElements, renderTemplateResultSym, RenderTemplateResult, slotString, SlotString, Fragment, Renderer, encoder$1, decoder$1, astroComponentInstanceSym, AstroComponentInstance, DOCTYPE_EXP, alphabetUpperCase, decodeMap, EncodingPadding$1, DecodingPadding$1, base64Alphabet, EncodingPadding, DecodingPadding, base64DecodeMap, ALGORITHM, encoder, decoder, IV_LENGTH, internalProps, SCRIPT_RE, COMMENT_RE, SCRIPT_REPLACER, COMMENT_REPLACER, needsHeadRenderingSymbol, rendererAliases, clientOnlyValues, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder, hasTriedRenderComponentSymbol, cssesc_1, hasRequiredCssesc;
var init_server_BXn8oDq3 = __esm({
  ".wrangler/tmp/pages-9XcfGz/chunks/astro/server_BXn8oDq3.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(getDefaultExportFromCjs, "getDefaultExportFromCjs");
    ASTRO_VERSION = "5.2.5";
    REROUTE_DIRECTIVE_HEADER = "X-Astro-Reroute";
    REWRITE_DIRECTIVE_HEADER_KEY = "X-Astro-Rewrite";
    REWRITE_DIRECTIVE_HEADER_VALUE = "yes";
    NOOP_MIDDLEWARE_HEADER = "X-Astro-Noop";
    ROUTE_TYPE_HEADER = "X-Astro-Route-Type";
    DEFAULT_404_COMPONENT = "astro-default-404.astro";
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = Symbol.for("astro.clientAddress");
    originPathnameSymbol = Symbol.for("astro.originPathname");
    responseSentSymbol = Symbol.for("astro.responseSent");
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
    };
    PrerenderClientAddressNotAvailable = {
      name: "PrerenderClientAddressNotAvailable",
      title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
      message: `\`Astro.clientAddress\` cannot be used inside prerendered routes`
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in prerendered pages.",
      message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
      hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
      hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
      hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside getStaticPath's return value",
      message: (entryType) => `Invalid entry returned by getStaticPaths. Expected an object, got \`${entryType}\``,
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by getStaticPaths.",
      message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths` route.",
      message: "Missing or empty required `params` property on `getStaticPaths` route.",
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid value for `getStaticPaths` route parameter.",
      message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: (slotName2) => `Unable to create a slot named \`${slotName2}\`. \`${slotName2}\` is a reserved slot name. Please update the name of this slot.`
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
      hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m) => `.json` + m)}\``
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    LocalsReassigned = {
      name: "LocalsReassigned",
      title: "`locals` must not be reassigned.",
      message: "`locals` can not be assigned directly.",
      hint: "Set a `locals` property instead."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    SessionStorageInitError = {
      name: "SessionStorageInitError",
      title: "Session storage could not be initialized.",
      message: (error2, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``,
      hint: "For more information, see https://docs.astro.build/en/reference/experimental-flags/sessions/"
    };
    SessionStorageSaveError = {
      name: "SessionStorageSaveError",
      title: "Session data could not be saved.",
      message: (error2, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``,
      hint: "For more information, see https://docs.astro.build/en/reference/experimental-flags/sessions/"
    };
    AstroGlobUsedOutside = {
      name: "AstroGlobUsedOutside",
      title: "Astro.glob() used outside of an Astro file.",
      message: (globStr) => `\`Astro.glob(${globStr})\` can only be used in \`.astro\` files. \`import.meta.glob(${globStr})\` can be used instead to achieve a similar result.`,
      hint: "See Vite's documentation on `import.meta.glob` for more information: https://vite.dev/guide/features.html#glob-import"
    };
    AstroGlobNoMatch = {
      name: "AstroGlobNoMatch",
      title: "Astro.glob() did not match any files.",
      message: (globStr) => `\`Astro.glob(${globStr})\` did not return any matching files.`,
      hint: "Check the pattern for typos."
    };
    i18nNoLocaleFoundInPath = {
      name: "i18nNoLocaleFoundInPath",
      title: "The path doesn't contain any locale",
      message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
    };
    RewriteWithBodyUsed = {
      name: "RewriteWithBodyUsed",
      title: "Cannot use Astro.rewrite after the request body has been read",
      message: "Astro.rewrite() cannot be used if the request body has already been read. If you need to read the body, first clone the request."
    };
    ForbiddenRewrite = {
      name: "ForbiddenRewrite",
      title: "Forbidden rewrite to a static route.",
      message: (from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`,
      hint: (component) => `Add \`export const prerender = false\` to the component '${component}', or use a Astro.redirect().`
    };
    __name(normalizeLF, "normalizeLF");
    __name(codeFrame, "codeFrame");
    AstroError = class extends Error {
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message)
          this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err.type === "AstroError";
      }
    };
    __name(AstroError, "AstroError");
    __name(validateArgs, "validateArgs");
    __name(baseCreateComponent, "baseCreateComponent");
    __name(createComponentWithOptions, "createComponentWithOptions");
    __name(createComponent, "createComponent");
    __name(createAstroGlobFn, "createAstroGlobFn");
    __name(createAstro, "createAstro");
    isTTY = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
      isTTY = process.stdout && process.stdout.isTTY;
    }
    $ = {
      enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
    };
    __name(init, "init");
    bold = init(1, 22);
    dim = init(2, 22);
    red = init(31, 39);
    yellow = init(33, 39);
    blue = init(34, 39);
    __name(renderEndpoint, "renderEndpoint");
    ({ replace } = "");
    ca = /[&<>'"]/g;
    esca = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    pe = /* @__PURE__ */ __name((m) => esca[m], "pe");
    escape = /* @__PURE__ */ __name((es) => replace.call(es, ca, pe), "escape");
    __name(isPromise, "isPromise");
    __name(streamAsyncIterator, "streamAsyncIterator");
    escapeHTML = escape;
    HTMLBytes = class extends Uint8Array {
    };
    __name(HTMLBytes, "HTMLBytes");
    Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
      get() {
        return "HTMLBytes";
      }
    });
    HTMLString = class extends String {
      get [Symbol.toStringTag]() {
        return "HTMLString";
      }
    };
    __name(HTMLString, "HTMLString");
    markHTMLString = /* @__PURE__ */ __name((value) => {
      if (value instanceof HTMLString) {
        return value;
      }
      if (typeof value === "string") {
        return new HTMLString(value);
      }
      return value;
    }, "markHTMLString");
    __name(isHTMLString, "isHTMLString");
    __name(markHTMLBytes, "markHTMLBytes");
    __name(hasGetReader, "hasGetReader");
    __name(unescapeChunksAsync, "unescapeChunksAsync");
    __name(unescapeChunks, "unescapeChunks");
    __name(unescapeHTML, "unescapeHTML");
    AstroJSX = "astro:jsx";
    __name(isVNode, "isVNode");
    RenderInstructionSymbol = Symbol.for("astro:render");
    __name(createRenderInstruction, "createRenderInstruction");
    __name(isRenderInstruction, "isRenderInstruction");
    __name(r, "r");
    __name(clsx, "clsx");
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      // Actually means Array
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
      Infinity: 11
    };
    __name(serializeArray, "serializeArray");
    __name(serializeObject, "serializeObject");
    __name(convertToSerializedForm, "convertToSerializedForm");
    __name(serializeProps, "serializeProps");
    transitionDirectivesToCopyOnIsland = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    __name(extractDirectives, "extractDirectives");
    __name(generateHydrateScript, "generateHydrateScript");
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = dictionary.length;
    __name(bitwise, "bitwise");
    __name(shorthash, "shorthash");
    __name(isAstroComponentFactory, "isAstroComponentFactory");
    __name(isAPropagatingComponent, "isAPropagatingComponent");
    headAndContentSym = Symbol.for("astro.headAndContent");
    __name(isHeadAndContent, "isHeadAndContent");
    astro_island_prebuilt_default = `(()=>{var A=Object.defineProperty;var g=(i,o,a)=>o in i?A(i,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[o]=a;var d=(i,o,a)=>g(i,typeof o!="symbol"?o+"":o,a);{let i={0:t=>m(t),1:t=>a(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(a(t)),5:t=>new Set(a(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>1/0*t},o=t=>{let[l,e]=t;return l in i?i[l](e):void 0},a=t=>t.map(o),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([l,e])=>[l,o(e)]));class y extends HTMLElement{constructor(){super(...arguments);d(this,"Component");d(this,"hydrator");d(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let c=this.querySelectorAll("astro-slot"),n={},h=this.querySelectorAll("template[data-astro-template]");for(let r of h){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(let r of c){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("name")||"default"]=r.innerHTML)}let p;try{p=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(r){let s=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(s+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${s}\`,this.getAttribute("props"),r),r}let u;await this.hydrator(this)(this.Component,p,n,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});d(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),c.disconnect(),this.childrenConnectedCallback()},c=new MutationObserver(()=>{var n;((n=this.lastChild)==null?void 0:n.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});c.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}async start(){let e=JSON.parse(this.getAttribute("opts")),c=this.getAttribute("client");if(Astro[c]===void 0){window.addEventListener(\`astro:\${c}\`,()=>this.start(),{once:!0});return}try{await Astro[c](async()=>{let n=this.getAttribute("renderer-url"),[h,{default:p}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),u=this.getAttribute("component-export")||"default";if(!u.includes("."))this.Component=h[u];else{this.Component=h;for(let f of u.split("."))this.Component=this.Component[f]}return this.hydrator=p,this.hydrate},e,this)}catch(n){console.error(\`[astro-island] Error hydrating \${this.getAttribute("component-url")}\`,n)}}attributeChangedCallback(){this.hydrate()}}d(y,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",y)}})();`;
    ISLAND_STYLES = `<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>`;
    __name(determineIfNeedsHydrationScript, "determineIfNeedsHydrationScript");
    __name(determinesIfNeedsDirectiveScript, "determinesIfNeedsDirectiveScript");
    __name(getDirectiveScriptText, "getDirectiveScriptText");
    __name(getPrescripts, "getPrescripts");
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|inert|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
    AMPERSAND_REGEX = /&/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    toIdent = /* @__PURE__ */ __name((k) => k.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match))
        return "";
      return index === 0 ? match : match.toUpperCase();
    }), "toIdent");
    toAttributeString = /* @__PURE__ */ __name((value, shouldEscape = true) => shouldEscape ? String(value).replace(AMPERSAND_REGEX, "&#38;").replace(DOUBLE_QUOTE_REGEX, "&#34;") : value, "toAttributeString");
    kebab = /* @__PURE__ */ __name((k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`), "kebab");
    toStyleString = /* @__PURE__ */ __name((obj) => Object.entries(obj).filter(([_, v]) => typeof v === "string" && v.trim() || typeof v === "number").map(([k, v]) => {
      if (k[0] !== "-" && k[1] !== "-")
        return `${kebab(k)}:${v}`;
      return `${k}:${v}`;
    }).join(";"), "toStyleString");
    __name(defineScriptVars, "defineScriptVars");
    __name(formatList, "formatList");
    __name(addAttribute, "addAttribute");
    __name(internalSpreadAttributes, "internalSpreadAttributes");
    __name(renderElement$1, "renderElement$1");
    noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    BufferedRenderer = class {
      chunks = [];
      renderPromise;
      destination;
      constructor(bufferRenderFunction) {
        this.renderPromise = bufferRenderFunction(this);
        Promise.resolve(this.renderPromise).catch(noop);
      }
      write(chunk) {
        if (this.destination) {
          this.destination.write(chunk);
        } else {
          this.chunks.push(chunk);
        }
      }
      async renderToFinalDestination(destination) {
        for (const chunk of this.chunks) {
          destination.write(chunk);
        }
        this.destination = destination;
        await this.renderPromise;
      }
    };
    __name(BufferedRenderer, "BufferedRenderer");
    __name(renderToBufferDestination, "renderToBufferDestination");
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    isDeno = typeof Deno !== "undefined";
    __name(promiseWithResolvers, "promiseWithResolvers");
    VALID_PROTOCOLS = ["http:", "https:"];
    __name(isHttpUrl, "isHttpUrl");
    uniqueElements = /* @__PURE__ */ __name((item, index, all) => {
      const props = JSON.stringify(item.props);
      const children = item.children;
      return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
    }, "uniqueElements");
    __name(renderAllHeadContent, "renderAllHeadContent");
    __name(renderHead, "renderHead");
    __name(maybeRenderHead, "maybeRenderHead");
    renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
    RenderTemplateResult = class {
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions.map((expression) => {
          if (isPromise(expression)) {
            return Promise.resolve(expression).catch((err) => {
              if (!this.error) {
                this.error = err;
                throw err;
              }
            });
          }
          return expression;
        });
      }
      async render(destination) {
        const expRenders = this.expressions.map((exp) => {
          return renderToBufferDestination((bufferDestination) => {
            if (exp || exp === 0) {
              return renderChild(bufferDestination, exp);
            }
          });
        });
        for (let i = 0; i < this.htmlParts.length; i++) {
          const html = this.htmlParts[i];
          const expRender = expRenders[i];
          destination.write(markHTMLString(html));
          if (expRender) {
            await expRender.renderToFinalDestination(destination);
          }
        }
      }
    };
    __name(RenderTemplateResult, "RenderTemplateResult");
    __name(isRenderTemplateResult, "isRenderTemplateResult");
    __name(renderTemplate, "renderTemplate");
    slotString = Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      instructions;
      [slotString];
      constructor(content, instructions) {
        super(content);
        this.instructions = instructions;
        this[slotString] = true;
      }
    };
    __name(SlotString, "SlotString");
    __name(isSlotString, "isSlotString");
    __name(renderSlot, "renderSlot");
    __name(renderSlotToString, "renderSlotToString");
    __name(renderSlots, "renderSlots");
    __name(createSlotValueFromString, "createSlotValueFromString");
    Fragment = Symbol.for("astro:fragment");
    Renderer = Symbol.for("astro:renderer");
    encoder$1 = new TextEncoder();
    decoder$1 = new TextDecoder();
    __name(stringifyChunk, "stringifyChunk");
    __name(chunkToString, "chunkToString");
    __name(chunkToByteArray, "chunkToByteArray");
    __name(isRenderInstance, "isRenderInstance");
    __name(renderChild, "renderChild");
    astroComponentInstanceSym = Symbol.for("astro.componentInstance");
    AstroComponentInstance = class {
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = {};
        for (const name in slots) {
          let didRender = false;
          let value = slots[name](result);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      async init(result) {
        if (this.returnValue !== void 0)
          return this.returnValue;
        this.returnValue = this.factory(result, this.props, this.slotValues);
        if (isPromise(this.returnValue)) {
          this.returnValue.then((resolved) => {
            this.returnValue = resolved;
          }).catch(() => {
          });
        }
        return this.returnValue;
      }
      async render(destination) {
        const returnValue = await this.init(this.result);
        if (isHeadAndContent(returnValue)) {
          await returnValue.content.render(destination);
        } else {
          await renderChild(destination, returnValue);
        }
      }
    };
    __name(AstroComponentInstance, "AstroComponentInstance");
    __name(validateComponentProps, "validateComponentProps");
    __name(createAstroComponentInstance, "createAstroComponentInstance");
    __name(isAstroComponentInstance, "isAstroComponentInstance");
    DOCTYPE_EXP = /<!doctype html/i;
    __name(renderToString, "renderToString");
    __name(renderToReadableStream, "renderToReadableStream");
    __name(callComponentAsTemplateResultOrResponse, "callComponentAsTemplateResultOrResponse");
    __name(bufferHeadContent, "bufferHeadContent");
    __name(renderToAsyncIterable, "renderToAsyncIterable");
    __name(componentIsHTMLElement, "componentIsHTMLElement");
    __name(renderHTMLElement, "renderHTMLElement");
    __name(getHTMLElementName, "getHTMLElementName");
    __name(encodeHexUpperCase, "encodeHexUpperCase");
    __name(decodeHex, "decodeHex");
    alphabetUpperCase = "0123456789ABCDEF";
    decodeMap = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding$1 || (EncodingPadding$1 = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding$1 || (DecodingPadding$1 = {}));
    __name(encodeBase64, "encodeBase64");
    __name(encodeBase64_internal, "encodeBase64_internal");
    base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    __name(decodeBase64, "decodeBase64");
    __name(decodeBase64_internal, "decodeBase64_internal");
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding || (EncodingPadding = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding || (DecodingPadding = {}));
    base64DecodeMap = {
      "0": 52,
      "1": 53,
      "2": 54,
      "3": 55,
      "4": 56,
      "5": 57,
      "6": 58,
      "7": 59,
      "8": 60,
      "9": 61,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      "+": 62,
      "/": 63
    };
    ALGORITHM = "AES-GCM";
    __name(decodeKey, "decodeKey");
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    IV_LENGTH = 24;
    __name(encryptString, "encryptString");
    __name(decryptString, "decryptString");
    internalProps = /* @__PURE__ */ new Set([
      "server:component-path",
      "server:component-export",
      "server:component-directive",
      "server:defer"
    ]);
    __name(containsServerDirective, "containsServerDirective");
    SCRIPT_RE = /<\/script/giu;
    COMMENT_RE = /<!--/gu;
    SCRIPT_REPLACER = "<\\/script";
    COMMENT_REPLACER = "\\u003C!--";
    __name(safeJsonStringify, "safeJsonStringify");
    __name(createSearchParams, "createSearchParams");
    __name(isWithinURLLimit, "isWithinURLLimit");
    __name(renderServerIsland, "renderServerIsland");
    needsHeadRenderingSymbol = Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
    __name(guessRenderers, "guessRenderers");
    __name(isFragmentComponent, "isFragmentComponent");
    __name(isHTMLComponent, "isHTMLComponent");
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    __name(removeStaticAstroSlot, "removeStaticAstroSlot");
    __name(renderFrameworkComponent, "renderFrameworkComponent");
    __name(sanitizeElementName, "sanitizeElementName");
    __name(renderFragmentComponent, "renderFragmentComponent");
    __name(renderHTMLComponent, "renderHTMLComponent");
    __name(renderAstroComponent, "renderAstroComponent");
    __name(renderComponent, "renderComponent");
    __name(normalizeProps, "normalizeProps");
    __name(renderComponentToString, "renderComponentToString");
    __name(nonAstroPageNeedsHeadInjection, "nonAstroPageNeedsHeadInjection");
    ClientOnlyPlaceholder = "astro-client-only";
    hasTriedRenderComponentSymbol = Symbol("hasTriedRenderComponent");
    __name(renderJSX, "renderJSX");
    __name(renderJSXVNode, "renderJSXVNode");
    __name(renderElement, "renderElement");
    __name(prerenderElementChildren, "prerenderElementChildren");
    __name(renderScript, "renderScript");
    __name(renderPage, "renderPage");
    __name(requireCssesc, "requireCssesc");
    requireCssesc();
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
    "-0123456789_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
    __name(spreadAttributes, "spreadAttributes");
  }
});

// .wrangler/tmp/pages-9XcfGz/chunks/_@astro-renderers_O4SP2Us9.mjs
function requireReact_production_min() {
  if (hasRequiredReact_production_min)
    return react_production_min;
  hasRequiredReact_production_min = 1;
  var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), r2 = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
  function A(a) {
    if (null === a || "object" !== typeof a)
      return null;
    a = z && a[z] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  __name(A, "A");
  var B = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C = Object.assign, D = {};
  function E2(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  __name(E2, "E");
  E2.prototype.isReactComponent = {};
  E2.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b, "setState");
  };
  E2.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  __name(F, "F");
  F.prototype = E2.prototype;
  function G(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  __name(G, "G");
  var H = G.prototype = new F();
  H.constructor = G;
  C(H, E2.prototype);
  H.isPureReactComponent = true;
  var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = { current: null }, L = { key: true, ref: true, __self: true, __source: true };
  function M(a, b, e) {
    var d, c = {}, k = null, h = null;
    if (null != b)
      for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b)
        J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
    var g = arguments.length - 2;
    if (1 === g)
      c.children = e;
    else if (1 < g) {
      for (var f = Array(g), m = 0; m < g; m++)
        f[m] = arguments[m + 2];
      c.children = f;
    }
    if (a && a.defaultProps)
      for (d in g = a.defaultProps, g)
        void 0 === c[d] && (c[d] = g[d]);
    return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
  }
  __name(M, "M");
  function N(a, b) {
    return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
  }
  __name(N, "N");
  function O(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
  }
  __name(O, "O");
  function escape2(a) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b[a2];
    });
  }
  __name(escape2, "escape");
  var P = /\/+/g;
  function Q(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape2("" + a.key) : b.toString(36);
  }
  __name(Q, "Q");
  function R(a, b, e, d, c) {
    var k = typeof a;
    if ("undefined" === k || "boolean" === k)
      a = null;
    var h = false;
    if (null === a)
      h = true;
    else
      switch (k) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h = true;
          }
      }
    if (h)
      return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
    h = 0;
    d = "" === d ? "." : d + ":";
    if (I(a))
      for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
      }
    else if (f = A(a), "function" === typeof f)
      for (a = f.call(a), g = 0; !(k = a.next()).done; )
        k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
    else if ("object" === k)
      throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return h;
  }
  __name(R, "R");
  function S(a, b, e) {
    if (null == a)
      return a;
    var d = [], c = 0;
    R(a, d, "", "", function(a2) {
      return b.call(e, a2, c++);
    });
    return d;
  }
  __name(S, "S");
  function T(a) {
    if (-1 === a._status) {
      var b = a._result;
      b = b();
      b.then(function(b2) {
        if (0 === a._status || -1 === a._status)
          a._status = 1, a._result = b2;
      }, function(b2) {
        if (0 === a._status || -1 === a._status)
          a._status = 2, a._result = b2;
      });
      -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status)
      return a._result.default;
    throw a._result;
  }
  __name(T, "T");
  var U = { current: null }, V = { transition: null }, W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
  function X() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  __name(X, "X");
  react_production_min.Children = { map: S, forEach: function(a, b, e) {
    S(a, function() {
      b.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b = 0;
    S(a, function() {
      b++;
    });
    return b;
  }, toArray: function(a) {
    return S(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O(a))
      throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E2;
  react_production_min.Fragment = p;
  react_production_min.Profiler = r2;
  react_production_min.PureComponent = G;
  react_production_min.StrictMode = q;
  react_production_min.Suspense = w;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
  react_production_min.act = X;
  react_production_min.cloneElement = function(a, b, e) {
    if (null === a || void 0 === a)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
    if (null != b) {
      void 0 !== b.ref && (k = b.ref, h = K.current);
      void 0 !== b.key && (c = "" + b.key);
      if (a.type && a.type.defaultProps)
        var g = a.type.defaultProps;
      for (f in b)
        J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
    }
    var f = arguments.length - 2;
    if (1 === f)
      d.children = e;
    else if (1 < f) {
      g = Array(f);
      for (var m = 0; m < f; m++)
        g[m] = arguments[m + 2];
      d.children = g;
    }
    return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M;
  react_production_min.createFactory = function(a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v, render: a };
  };
  react_production_min.isValidElement = O;
  react_production_min.lazy = function(a) {
    return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
  };
  react_production_min.memo = function(a, b) {
    return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
  };
  react_production_min.startTransition = function(a) {
    var b = V.transition;
    V.transition = {};
    try {
      a();
    } finally {
      V.transition = b;
    }
  };
  react_production_min.unstable_act = X;
  react_production_min.useCallback = function(a, b) {
    return U.current.useCallback(a, b);
  };
  react_production_min.useContext = function(a) {
    return U.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b) {
    return U.current.useEffect(a, b);
  };
  react_production_min.useId = function() {
    return U.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b, e) {
    return U.current.useImperativeHandle(a, b, e);
  };
  react_production_min.useInsertionEffect = function(a, b) {
    return U.current.useInsertionEffect(a, b);
  };
  react_production_min.useLayoutEffect = function(a, b) {
    return U.current.useLayoutEffect(a, b);
  };
  react_production_min.useMemo = function(a, b) {
    return U.current.useMemo(a, b);
  };
  react_production_min.useReducer = function(a, b, e) {
    return U.current.useReducer(a, b, e);
  };
  react_production_min.useRef = function(a) {
    return U.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b, e) {
    return U.current.useSyncExternalStore(a, b, e);
  };
  react_production_min.useTransition = function() {
    return U.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  return react_production_min;
}
function requireReact() {
  if (hasRequiredReact)
    return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production_min();
  }
  return react.exports;
}
function requireReactDomServerLegacy_browser_production_min() {
  if (hasRequiredReactDomServerLegacy_browser_production_min)
    return reactDomServerLegacy_browser_production_min;
  hasRequiredReactDomServerLegacy_browser_production_min = 1;
  var aa = requireReact();
  function l(a) {
    for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
      b += "&args[]=" + encodeURIComponent(arguments[c]);
    return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  __name(l, "l");
  var p = Object.prototype.hasOwnProperty, fa = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ha = {}, ia = {};
  function ja(a) {
    if (p.call(ia, a))
      return true;
    if (p.call(ha, a))
      return false;
    if (fa.test(a))
      return ia[a] = true;
    ha[a] = true;
    return false;
  }
  __name(ja, "ja");
  function r2(a, b, c, d, f, e, g) {
    this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
    this.attributeName = d;
    this.attributeNamespace = f;
    this.mustUseProperty = c;
    this.propertyName = a;
    this.type = b;
    this.sanitizeURL = e;
    this.removeEmptyString = g;
  }
  __name(r2, "r");
  var t = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    t[a] = new r2(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b = a[0];
    t[b] = new r2(b, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    t[a] = new r2(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    t[a] = new r2(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    t[a] = new r2(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    t[a] = new r2(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    t[a] = new r2(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    t[a] = new r2(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    t[a] = new r2(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ka = /[\-:]([a-z])/g;
  function la(a) {
    return a[1].toUpperCase();
  }
  __name(la, "la");
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b = a.replace(
      ka,
      la
    );
    t[b] = new r2(b, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b = a.replace(ka, la);
    t[b] = new r2(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b = a.replace(ka, la);
    t[b] = new r2(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    t[a] = new r2(a, 1, false, a.toLowerCase(), null, false, false);
  });
  t.xlinkHref = new r2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    t[a] = new r2(a, 1, false, a.toLowerCase(), null, true, true);
  });
  var u = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, ma = ["Webkit", "ms", "Moz", "O"];
  Object.keys(u).forEach(function(a) {
    ma.forEach(function(b) {
      b = b + a.charAt(0).toUpperCase() + a.substring(1);
      u[b] = u[a];
    });
  });
  var na = /["'&<>]/;
  function v(a) {
    if ("boolean" === typeof a || "number" === typeof a)
      return "" + a;
    a = "" + a;
    var b = na.exec(a);
    if (b) {
      var c = "", d, f = 0;
      for (d = b.index; d < a.length; d++) {
        switch (a.charCodeAt(d)) {
          case 34:
            b = "&quot;";
            break;
          case 38:
            b = "&amp;";
            break;
          case 39:
            b = "&#x27;";
            break;
          case 60:
            b = "&lt;";
            break;
          case 62:
            b = "&gt;";
            break;
          default:
            continue;
        }
        f !== d && (c += a.substring(f, d));
        f = d + 1;
        c += b;
      }
      a = f !== d ? c + a.substring(f, d) : c;
    }
    return a;
  }
  __name(v, "v");
  var oa = /([A-Z])/g, pa = /^ms-/, qa = Array.isArray;
  function w(a, b) {
    return { insertionMode: a, selectedValue: b };
  }
  __name(w, "w");
  function ra(a, b, c) {
    switch (b) {
      case "select":
        return w(1, null != c.value ? c.value : c.defaultValue);
      case "svg":
        return w(2, null);
      case "math":
        return w(3, null);
      case "foreignObject":
        return w(1, null);
      case "table":
        return w(4, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return w(5, null);
      case "colgroup":
        return w(7, null);
      case "tr":
        return w(6, null);
    }
    return 4 <= a.insertionMode || 0 === a.insertionMode ? w(1, null) : a;
  }
  __name(ra, "ra");
  var sa = /* @__PURE__ */ new Map();
  function ta(a, b, c) {
    if ("object" !== typeof c)
      throw Error(l(62));
    b = true;
    for (var d in c)
      if (p.call(c, d)) {
        var f = c[d];
        if (null != f && "boolean" !== typeof f && "" !== f) {
          if (0 === d.indexOf("--")) {
            var e = v(d);
            f = v(("" + f).trim());
          } else {
            e = d;
            var g = sa.get(e);
            void 0 !== g ? e = g : (g = v(e.replace(oa, "-$1").toLowerCase().replace(pa, "-ms-")), sa.set(e, g), e = g);
            f = "number" === typeof f ? 0 === f || p.call(u, d) ? "" + f : f + "px" : v(("" + f).trim());
          }
          b ? (b = false, a.push(' style="', e, ":", f)) : a.push(";", e, ":", f);
        }
      }
    b || a.push('"');
  }
  __name(ta, "ta");
  function x(a, b, c, d) {
    switch (c) {
      case "style":
        ta(a, b, d);
        return;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
        return;
    }
    if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
      if (b = t.hasOwnProperty(c) ? t[c] : null, null !== b) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (!b.acceptsBooleans)
              return;
        }
        c = b.attributeName;
        switch (b.type) {
          case 3:
            d && a.push(" ", c, '=""');
            break;
          case 4:
            true === d ? a.push(" ", c, '=""') : false !== d && a.push(" ", c, '="', v(d), '"');
            break;
          case 5:
            isNaN(d) || a.push(" ", c, '="', v(d), '"');
            break;
          case 6:
            !isNaN(d) && 1 <= d && a.push(" ", c, '="', v(d), '"');
            break;
          default:
            b.sanitizeURL && (d = "" + d), a.push(" ", c, '="', v(d), '"');
        }
      } else if (ja(c)) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b)
              return;
        }
        a.push(" ", c, '="', v(d), '"');
      }
    }
  }
  __name(x, "x");
  function y(a, b, c) {
    if (null != b) {
      if (null != c)
        throw Error(l(60));
      if ("object" !== typeof b || !("__html" in b))
        throw Error(l(61));
      b = b.__html;
      null !== b && void 0 !== b && a.push("" + b);
    }
  }
  __name(y, "y");
  function ua(a) {
    var b = "";
    aa.Children.forEach(a, function(a2) {
      null != a2 && (b += a2);
    });
    return b;
  }
  __name(ua, "ua");
  function va(a, b, c, d) {
    a.push(A(c));
    var f = c = null, e;
    for (e in b)
      if (p.call(b, e)) {
        var g = b[e];
        if (null != g)
          switch (e) {
            case "children":
              c = g;
              break;
            case "dangerouslySetInnerHTML":
              f = g;
              break;
            default:
              x(a, d, e, g);
          }
      }
    a.push(">");
    y(a, f, c);
    return "string" === typeof c ? (a.push(v(c)), null) : c;
  }
  __name(va, "va");
  var wa = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, xa = /* @__PURE__ */ new Map();
  function A(a) {
    var b = xa.get(a);
    if (void 0 === b) {
      if (!wa.test(a))
        throw Error(l(65, a));
      b = "<" + a;
      xa.set(a, b);
    }
    return b;
  }
  __name(A, "A");
  function ya(a, b, c, d, f) {
    switch (b) {
      case "select":
        a.push(A("select"));
        var e = null, g = null;
        for (n in c)
          if (p.call(c, n)) {
            var h = c[n];
            if (null != h)
              switch (n) {
                case "children":
                  e = h;
                  break;
                case "dangerouslySetInnerHTML":
                  g = h;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  x(a, d, n, h);
              }
          }
        a.push(">");
        y(a, g, e);
        return e;
      case "option":
        g = f.selectedValue;
        a.push(A("option"));
        var k = h = null, m = null;
        var n = null;
        for (e in c)
          if (p.call(c, e)) {
            var q = c[e];
            if (null != q)
              switch (e) {
                case "children":
                  h = q;
                  break;
                case "selected":
                  m = q;
                  break;
                case "dangerouslySetInnerHTML":
                  n = q;
                  break;
                case "value":
                  k = q;
                default:
                  x(a, d, e, q);
              }
          }
        if (null != g)
          if (c = null !== k ? "" + k : ua(h), qa(g))
            for (d = 0; d < g.length; d++) {
              if ("" + g[d] === c) {
                a.push(' selected=""');
                break;
              }
            }
          else
            "" + g === c && a.push(' selected=""');
        else
          m && a.push(' selected=""');
        a.push(">");
        y(a, n, h);
        return h;
      case "textarea":
        a.push(A("textarea"));
        n = g = e = null;
        for (h in c)
          if (p.call(c, h) && (k = c[h], null != k))
            switch (h) {
              case "children":
                n = k;
                break;
              case "value":
                e = k;
                break;
              case "defaultValue":
                g = k;
                break;
              case "dangerouslySetInnerHTML":
                throw Error(l(91));
              default:
                x(
                  a,
                  d,
                  h,
                  k
                );
            }
        null === e && null !== g && (e = g);
        a.push(">");
        if (null != n) {
          if (null != e)
            throw Error(l(92));
          if (qa(n) && 1 < n.length)
            throw Error(l(93));
          e = "" + n;
        }
        "string" === typeof e && "\n" === e[0] && a.push("\n");
        null !== e && a.push(v("" + e));
        return null;
      case "input":
        a.push(A("input"));
        k = n = h = e = null;
        for (g in c)
          if (p.call(c, g) && (m = c[g], null != m))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(l(399, "input"));
              case "defaultChecked":
                k = m;
                break;
              case "defaultValue":
                h = m;
                break;
              case "checked":
                n = m;
                break;
              case "value":
                e = m;
                break;
              default:
                x(a, d, g, m);
            }
        null !== n ? x(a, d, "checked", n) : null !== k && x(a, d, "checked", k);
        null !== e ? x(a, d, "value", e) : null !== h && x(a, d, "value", h);
        a.push("/>");
        return null;
      case "menuitem":
        a.push(A("menuitem"));
        for (var C in c)
          if (p.call(c, C) && (e = c[C], null != e))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(l(400));
              default:
                x(a, d, C, e);
            }
        a.push(">");
        return null;
      case "title":
        a.push(A("title"));
        e = null;
        for (q in c)
          if (p.call(c, q) && (g = c[q], null != g))
            switch (q) {
              case "children":
                e = g;
                break;
              case "dangerouslySetInnerHTML":
                throw Error(l(434));
              default:
                x(a, d, q, g);
            }
        a.push(">");
        return e;
      case "listing":
      case "pre":
        a.push(A(b));
        g = e = null;
        for (k in c)
          if (p.call(c, k) && (h = c[k], null != h))
            switch (k) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              default:
                x(a, d, k, h);
            }
        a.push(">");
        if (null != g) {
          if (null != e)
            throw Error(l(60));
          if ("object" !== typeof g || !("__html" in g))
            throw Error(l(61));
          c = g.__html;
          null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push("\n", c) : a.push("" + c));
        }
        "string" === typeof e && "\n" === e[0] && a.push("\n");
        return e;
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        a.push(A(b));
        for (var D in c)
          if (p.call(c, D) && (e = c[D], null != e))
            switch (D) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(l(399, b));
              default:
                x(a, d, D, e);
            }
        a.push("/>");
        return null;
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return va(
          a,
          c,
          b,
          d
        );
      case "html":
        return 0 === f.insertionMode && a.push("<!DOCTYPE html>"), va(a, c, b, d);
      default:
        if (-1 === b.indexOf("-") && "string" !== typeof c.is)
          return va(a, c, b, d);
        a.push(A(b));
        g = e = null;
        for (m in c)
          if (p.call(c, m) && (h = c[m], null != h))
            switch (m) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              case "style":
                ta(a, d, h);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                break;
              default:
                ja(m) && "function" !== typeof h && "symbol" !== typeof h && a.push(" ", m, '="', v(h), '"');
            }
        a.push(">");
        y(a, g, e);
        return e;
    }
  }
  __name(ya, "ya");
  function za(a, b, c) {
    a.push('<!--$?--><template id="');
    if (null === c)
      throw Error(l(395));
    a.push(c);
    return a.push('"></template>');
  }
  __name(za, "za");
  function Aa(a, b, c, d) {
    switch (c.insertionMode) {
      case 0:
      case 1:
        return a.push('<div hidden id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 2:
        return a.push('<svg aria-hidden="true" style="display:none" id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 3:
        return a.push('<math aria-hidden="true" style="display:none" id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 4:
        return a.push('<table hidden id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 5:
        return a.push('<table hidden><tbody id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 6:
        return a.push('<table hidden><tr id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      case 7:
        return a.push('<table hidden><colgroup id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
      default:
        throw Error(l(397));
    }
  }
  __name(Aa, "Aa");
  function Ba(a, b) {
    switch (b.insertionMode) {
      case 0:
      case 1:
        return a.push("</div>");
      case 2:
        return a.push("</svg>");
      case 3:
        return a.push("</math>");
      case 4:
        return a.push("</table>");
      case 5:
        return a.push("</tbody></table>");
      case 6:
        return a.push("</tr></table>");
      case 7:
        return a.push("</colgroup></table>");
      default:
        throw Error(l(397));
    }
  }
  __name(Ba, "Ba");
  var Ca = /[<\u2028\u2029]/g;
  function Da(a) {
    return JSON.stringify(a).replace(Ca, function(a2) {
      switch (a2) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
      }
    });
  }
  __name(Da, "Da");
  function Ea(a, b) {
    b = void 0 === b ? "" : b;
    return { bootstrapChunks: [], startInlineScript: "<script>", placeholderPrefix: b + "P:", segmentPrefix: b + "S:", boundaryPrefix: b + "B:", idPrefix: b, nextSuspenseID: 0, sentCompleteSegmentFunction: false, sentCompleteBoundaryFunction: false, sentClientRenderFunction: false, generateStaticMarkup: a };
  }
  __name(Ea, "Ea");
  function Fa(a, b, c, d) {
    if (c.generateStaticMarkup)
      return a.push(v(b)), false;
    "" === b ? a = d : (d && a.push("<!-- -->"), a.push(v(b)), a = true);
    return a;
  }
  __name(Fa, "Fa");
  var B = Object.assign, Ga = Symbol.for("react.element"), Ha = Symbol.for("react.portal"), Ia = Symbol.for("react.fragment"), Ja = Symbol.for("react.strict_mode"), Ka = Symbol.for("react.profiler"), La = Symbol.for("react.provider"), Ma = Symbol.for("react.context"), Na = Symbol.for("react.forward_ref"), Oa = Symbol.for("react.suspense"), Pa = Symbol.for("react.suspense_list"), Qa = Symbol.for("react.memo"), Ra = Symbol.for("react.lazy"), Sa = Symbol.for("react.scope"), Ta = Symbol.for("react.debug_trace_mode"), Ua = Symbol.for("react.legacy_hidden"), Va = Symbol.for("react.default_value"), Wa = Symbol.iterator;
  function Xa(a) {
    if (null == a)
      return null;
    if ("function" === typeof a)
      return a.displayName || a.name || null;
    if ("string" === typeof a)
      return a;
    switch (a) {
      case Ia:
        return "Fragment";
      case Ha:
        return "Portal";
      case Ka:
        return "Profiler";
      case Ja:
        return "StrictMode";
      case Oa:
        return "Suspense";
      case Pa:
        return "SuspenseList";
    }
    if ("object" === typeof a)
      switch (a.$$typeof) {
        case Ma:
          return (a.displayName || "Context") + ".Consumer";
        case La:
          return (a._context.displayName || "Context") + ".Provider";
        case Na:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case Qa:
          return b = a.displayName || null, null !== b ? b : Xa(a.type) || "Memo";
        case Ra:
          b = a._payload;
          a = a._init;
          try {
            return Xa(a(b));
          } catch (c) {
          }
      }
    return null;
  }
  __name(Xa, "Xa");
  var Ya = {};
  function Za(a, b) {
    a = a.contextTypes;
    if (!a)
      return Ya;
    var c = {}, d;
    for (d in a)
      c[d] = b[d];
    return c;
  }
  __name(Za, "Za");
  var E2 = null;
  function F(a, b) {
    if (a !== b) {
      a.context._currentValue2 = a.parentValue;
      a = a.parent;
      var c = b.parent;
      if (null === a) {
        if (null !== c)
          throw Error(l(401));
      } else {
        if (null === c)
          throw Error(l(401));
        F(a, c);
      }
      b.context._currentValue2 = b.value;
    }
  }
  __name(F, "F");
  function $a(a) {
    a.context._currentValue2 = a.parentValue;
    a = a.parent;
    null !== a && $a(a);
  }
  __name($a, "$a");
  function ab(a) {
    var b = a.parent;
    null !== b && ab(b);
    a.context._currentValue2 = a.value;
  }
  __name(ab, "ab");
  function bb(a, b) {
    a.context._currentValue2 = a.parentValue;
    a = a.parent;
    if (null === a)
      throw Error(l(402));
    a.depth === b.depth ? F(a, b) : bb(a, b);
  }
  __name(bb, "bb");
  function cb(a, b) {
    var c = b.parent;
    if (null === c)
      throw Error(l(402));
    a.depth === c.depth ? F(a, c) : cb(a, c);
    b.context._currentValue2 = b.value;
  }
  __name(cb, "cb");
  function G(a) {
    var b = E2;
    b !== a && (null === b ? ab(a) : null === a ? $a(b) : b.depth === a.depth ? F(b, a) : b.depth > a.depth ? bb(b, a) : cb(b, a), E2 = a);
  }
  __name(G, "G");
  var db = { isMounted: function() {
    return false;
  }, enqueueSetState: function(a, b) {
    a = a._reactInternals;
    null !== a.queue && a.queue.push(b);
  }, enqueueReplaceState: function(a, b) {
    a = a._reactInternals;
    a.replace = true;
    a.queue = [b];
  }, enqueueForceUpdate: function() {
  } };
  function eb(a, b, c, d) {
    var f = void 0 !== a.state ? a.state : null;
    a.updater = db;
    a.props = c;
    a.state = f;
    var e = { queue: [], replace: false };
    a._reactInternals = e;
    var g = b.contextType;
    a.context = "object" === typeof g && null !== g ? g._currentValue2 : d;
    g = b.getDerivedStateFromProps;
    "function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : B({}, f, g), a.state = f);
    if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount))
      if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && db.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length)
        if (b = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b.length)
          a.state = b[0];
        else {
          e = g ? b[0] : a.state;
          f = true;
          for (g = g ? 1 : 0; g < b.length; g++) {
            var h = b[g];
            h = "function" === typeof h ? h.call(a, e, c, d) : h;
            null != h && (f ? (f = false, e = B({}, e, h)) : B(e, h));
          }
          a.state = e;
        }
      else
        e.queue = null;
  }
  __name(eb, "eb");
  var fb = { id: 1, overflow: "" };
  function gb(a, b, c) {
    var d = a.id;
    a = a.overflow;
    var f = 32 - H(d) - 1;
    d &= ~(1 << f);
    c += 1;
    var e = 32 - H(b) + f;
    if (30 < e) {
      var g = f - f % 5;
      e = (d & (1 << g) - 1).toString(32);
      d >>= g;
      f -= g;
      return { id: 1 << 32 - H(b) + f | c << f | d, overflow: e + a };
    }
    return { id: 1 << e | c << f | d, overflow: a };
  }
  __name(gb, "gb");
  var H = Math.clz32 ? Math.clz32 : hb, ib = Math.log, jb = Math.LN2;
  function hb(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (ib(a) / jb | 0) | 0;
  }
  __name(hb, "hb");
  function kb(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  __name(kb, "kb");
  var lb = "function" === typeof Object.is ? Object.is : kb, I = null, ob = null, J = null, K = null, L = false, M = false, N = 0, O = null, P = 0;
  function Q() {
    if (null === I)
      throw Error(l(321));
    return I;
  }
  __name(Q, "Q");
  function pb() {
    if (0 < P)
      throw Error(l(312));
    return { memoizedState: null, queue: null, next: null };
  }
  __name(pb, "pb");
  function qb() {
    null === K ? null === J ? (L = false, J = K = pb()) : (L = true, K = J) : null === K.next ? (L = false, K = K.next = pb()) : (L = true, K = K.next);
    return K;
  }
  __name(qb, "qb");
  function rb() {
    ob = I = null;
    M = false;
    J = null;
    P = 0;
    K = O = null;
  }
  __name(rb, "rb");
  function sb(a, b) {
    return "function" === typeof b ? b(a) : b;
  }
  __name(sb, "sb");
  function tb(a, b, c) {
    I = Q();
    K = qb();
    if (L) {
      var d = K.queue;
      b = d.dispatch;
      if (null !== O && (c = O.get(d), void 0 !== c)) {
        O.delete(d);
        d = K.memoizedState;
        do
          d = a(d, c.action), c = c.next;
        while (null !== c);
        K.memoizedState = d;
        return [d, b];
      }
      return [K.memoizedState, b];
    }
    a = a === sb ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
    K.memoizedState = a;
    a = K.queue = { last: null, dispatch: null };
    a = a.dispatch = ub.bind(null, I, a);
    return [K.memoizedState, a];
  }
  __name(tb, "tb");
  function vb(a, b) {
    I = Q();
    K = qb();
    b = void 0 === b ? null : b;
    if (null !== K) {
      var c = K.memoizedState;
      if (null !== c && null !== b) {
        var d = c[1];
        a:
          if (null === d)
            d = false;
          else {
            for (var f = 0; f < d.length && f < b.length; f++)
              if (!lb(b[f], d[f])) {
                d = false;
                break a;
              }
            d = true;
          }
        if (d)
          return c[0];
      }
    }
    a = a();
    K.memoizedState = [a, b];
    return a;
  }
  __name(vb, "vb");
  function ub(a, b, c) {
    if (25 <= P)
      throw Error(l(301));
    if (a === I)
      if (M = true, a = { action: c, next: null }, null === O && (O = /* @__PURE__ */ new Map()), c = O.get(b), void 0 === c)
        O.set(b, a);
      else {
        for (b = c; null !== b.next; )
          b = b.next;
        b.next = a;
      }
  }
  __name(ub, "ub");
  function wb() {
    throw Error(l(394));
  }
  __name(wb, "wb");
  function R() {
  }
  __name(R, "R");
  var xb = { readContext: function(a) {
    return a._currentValue2;
  }, useContext: function(a) {
    Q();
    return a._currentValue2;
  }, useMemo: vb, useReducer: tb, useRef: function(a) {
    I = Q();
    K = qb();
    var b = K.memoizedState;
    return null === b ? (a = { current: a }, K.memoizedState = a) : b;
  }, useState: function(a) {
    return tb(sb, a);
  }, useInsertionEffect: R, useLayoutEffect: function() {
  }, useCallback: function(a, b) {
    return vb(function() {
      return a;
    }, b);
  }, useImperativeHandle: R, useEffect: R, useDebugValue: R, useDeferredValue: function(a) {
    Q();
    return a;
  }, useTransition: function() {
    Q();
    return [
      false,
      wb
    ];
  }, useId: function() {
    var a = ob.treeContext;
    var b = a.overflow;
    a = a.id;
    a = (a & ~(1 << 32 - H(a) - 1)).toString(32) + b;
    var c = S;
    if (null === c)
      throw Error(l(404));
    b = N++;
    a = ":" + c.idPrefix + "R" + a;
    0 < b && (a += "H" + b.toString(32));
    return a + ":";
  }, useMutableSource: function(a, b) {
    Q();
    return b(a._source);
  }, useSyncExternalStore: function(a, b, c) {
    if (void 0 === c)
      throw Error(l(407));
    return c();
  } }, S = null, yb = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  function zb(a) {
    console.error(a);
    return null;
  }
  __name(zb, "zb");
  function T() {
  }
  __name(T, "T");
  function Ab(a, b, c, d, f, e, g, h, k) {
    var m = [], n = /* @__PURE__ */ new Set();
    b = { destination: null, responseState: b, progressiveChunkSize: void 0 === d ? 12800 : d, status: 0, fatalError: null, nextSegmentId: 0, allPendingTasks: 0, pendingRootTasks: 0, completedRootSegment: null, abortableTasks: n, pingedTasks: m, clientRenderedBoundaries: [], completedBoundaries: [], partialBoundaries: [], onError: void 0 === f ? zb : f, onAllReady: T, onShellReady: void 0 === g ? T : g, onShellError: T, onFatalError: T };
    c = U(b, 0, null, c, false, false);
    c.parentFlushed = true;
    a = Bb(b, a, null, c, n, Ya, null, fb);
    m.push(a);
    return b;
  }
  __name(Ab, "Ab");
  function Bb(a, b, c, d, f, e, g, h) {
    a.allPendingTasks++;
    null === c ? a.pendingRootTasks++ : c.pendingTasks++;
    var k = { node: b, ping: function() {
      var b2 = a.pingedTasks;
      b2.push(k);
      1 === b2.length && Cb(a);
    }, blockedBoundary: c, blockedSegment: d, abortSet: f, legacyContext: e, context: g, treeContext: h };
    f.add(k);
    return k;
  }
  __name(Bb, "Bb");
  function U(a, b, c, d, f, e) {
    return { status: 0, id: -1, index: b, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c, lastPushedText: f, textEmbedded: e };
  }
  __name(U, "U");
  function V(a, b) {
    a = a.onError(b);
    if (null != a && "string" !== typeof a)
      throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
    return a;
  }
  __name(V, "V");
  function W(a, b) {
    var c = a.onShellError;
    c(b);
    c = a.onFatalError;
    c(b);
    null !== a.destination ? (a.status = 2, a.destination.destroy(b)) : (a.status = 1, a.fatalError = b);
  }
  __name(W, "W");
  function Db(a, b, c, d, f) {
    I = {};
    ob = b;
    N = 0;
    for (a = c(d, f); M; )
      M = false, N = 0, P += 1, K = null, a = c(d, f);
    rb();
    return a;
  }
  __name(Db, "Db");
  function Eb(a, b, c, d) {
    var f = c.render(), e = d.childContextTypes;
    if (null !== e && void 0 !== e) {
      var g = b.legacyContext;
      if ("function" !== typeof c.getChildContext)
        d = g;
      else {
        c = c.getChildContext();
        for (var h in c)
          if (!(h in e))
            throw Error(l(108, Xa(d) || "Unknown", h));
        d = B({}, g, c);
      }
      b.legacyContext = d;
      X(a, b, f);
      b.legacyContext = g;
    } else
      X(a, b, f);
  }
  __name(Eb, "Eb");
  function Fb(a, b) {
    if (a && a.defaultProps) {
      b = B({}, b);
      a = a.defaultProps;
      for (var c in a)
        void 0 === b[c] && (b[c] = a[c]);
      return b;
    }
    return b;
  }
  __name(Fb, "Fb");
  function Gb(a, b, c, d, f) {
    if ("function" === typeof c)
      if (c.prototype && c.prototype.isReactComponent) {
        f = Za(c, b.legacyContext);
        var e = c.contextType;
        e = new c(d, "object" === typeof e && null !== e ? e._currentValue2 : f);
        eb(e, c, d, f);
        Eb(a, b, e, c);
      } else {
        e = Za(c, b.legacyContext);
        f = Db(a, b, c, d, e);
        var g = 0 !== N;
        if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof)
          eb(f, c, d, e), Eb(a, b, f, c);
        else if (g) {
          d = b.treeContext;
          b.treeContext = gb(d, 1, 0);
          try {
            X(a, b, f);
          } finally {
            b.treeContext = d;
          }
        } else
          X(a, b, f);
      }
    else if ("string" === typeof c) {
      f = b.blockedSegment;
      e = ya(f.chunks, c, d, a.responseState, f.formatContext);
      f.lastPushedText = false;
      g = f.formatContext;
      f.formatContext = ra(g, c, d);
      Hb(a, b, e);
      f.formatContext = g;
      switch (c) {
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
          break;
        default:
          f.chunks.push("</", c, ">");
      }
      f.lastPushedText = false;
    } else {
      switch (c) {
        case Ua:
        case Ta:
        case Ja:
        case Ka:
        case Ia:
          X(a, b, d.children);
          return;
        case Pa:
          X(a, b, d.children);
          return;
        case Sa:
          throw Error(l(343));
        case Oa:
          a: {
            c = b.blockedBoundary;
            f = b.blockedSegment;
            e = d.fallback;
            d = d.children;
            g = /* @__PURE__ */ new Set();
            var h = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, k = U(a, f.chunks.length, h, f.formatContext, false, false);
            f.children.push(k);
            f.lastPushedText = false;
            var m = U(a, 0, null, f.formatContext, false, false);
            m.parentFlushed = true;
            b.blockedBoundary = h;
            b.blockedSegment = m;
            try {
              if (Hb(
                a,
                b,
                d
              ), a.responseState.generateStaticMarkup || m.lastPushedText && m.textEmbedded && m.chunks.push("<!-- -->"), m.status = 1, Y(h, m), 0 === h.pendingTasks)
                break a;
            } catch (n) {
              m.status = 4, h.forceClientRender = true, h.errorDigest = V(a, n);
            } finally {
              b.blockedBoundary = c, b.blockedSegment = f;
            }
            b = Bb(a, e, c, k, g, b.legacyContext, b.context, b.treeContext);
            a.pingedTasks.push(b);
          }
          return;
      }
      if ("object" === typeof c && null !== c)
        switch (c.$$typeof) {
          case Na:
            d = Db(a, b, c.render, d, f);
            if (0 !== N) {
              c = b.treeContext;
              b.treeContext = gb(c, 1, 0);
              try {
                X(a, b, d);
              } finally {
                b.treeContext = c;
              }
            } else
              X(a, b, d);
            return;
          case Qa:
            c = c.type;
            d = Fb(c, d);
            Gb(a, b, c, d, f);
            return;
          case La:
            f = d.children;
            c = c._context;
            d = d.value;
            e = c._currentValue2;
            c._currentValue2 = d;
            g = E2;
            E2 = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c, parentValue: e, value: d };
            b.context = d;
            X(a, b, f);
            a = E2;
            if (null === a)
              throw Error(l(403));
            d = a.parentValue;
            a.context._currentValue2 = d === Va ? a.context._defaultValue : d;
            a = E2 = a.parent;
            b.context = a;
            return;
          case Ma:
            d = d.children;
            d = d(c._currentValue2);
            X(a, b, d);
            return;
          case Ra:
            f = c._init;
            c = f(c._payload);
            d = Fb(c, d);
            Gb(
              a,
              b,
              c,
              d,
              void 0
            );
            return;
        }
      throw Error(l(130, null == c ? c : typeof c, ""));
    }
  }
  __name(Gb, "Gb");
  function X(a, b, c) {
    b.node = c;
    if ("object" === typeof c && null !== c) {
      switch (c.$$typeof) {
        case Ga:
          Gb(a, b, c.type, c.props, c.ref);
          return;
        case Ha:
          throw Error(l(257));
        case Ra:
          var d = c._init;
          c = d(c._payload);
          X(a, b, c);
          return;
      }
      if (qa(c)) {
        Ib(a, b, c);
        return;
      }
      null === c || "object" !== typeof c ? d = null : (d = Wa && c[Wa] || c["@@iterator"], d = "function" === typeof d ? d : null);
      if (d && (d = d.call(c))) {
        c = d.next();
        if (!c.done) {
          var f = [];
          do
            f.push(c.value), c = d.next();
          while (!c.done);
          Ib(a, b, f);
        }
        return;
      }
      a = Object.prototype.toString.call(c);
      throw Error(l(31, "[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a));
    }
    "string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Fa(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Fa(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
  }
  __name(X, "X");
  function Ib(a, b, c) {
    for (var d = c.length, f = 0; f < d; f++) {
      var e = b.treeContext;
      b.treeContext = gb(e, d, f);
      try {
        Hb(a, b, c[f]);
      } finally {
        b.treeContext = e;
      }
    }
  }
  __name(Ib, "Ib");
  function Hb(a, b, c) {
    var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
    try {
      return X(a, b, c);
    } catch (k) {
      if (rb(), "object" === typeof k && null !== k && "function" === typeof k.then) {
        c = k;
        var g = b.blockedSegment, h = U(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
        g.children.push(h);
        g.lastPushedText = false;
        a = Bb(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
        c.then(a, a);
        b.blockedSegment.formatContext = d;
        b.legacyContext = f;
        b.context = e;
        G(e);
      } else
        throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, G(e), k;
    }
  }
  __name(Hb, "Hb");
  function Jb(a) {
    var b = a.blockedBoundary;
    a = a.blockedSegment;
    a.status = 3;
    Kb(this, b, a);
  }
  __name(Jb, "Jb");
  function Lb(a, b, c) {
    var d = a.blockedBoundary;
    a.blockedSegment.status = 3;
    null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.push(null))) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, a = void 0 === c ? Error(l(432)) : c, d.errorDigest = b.onError(a), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
      return Lb(a2, b, c);
    }), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (d = b.onAllReady, d()));
  }
  __name(Lb, "Lb");
  function Y(a, b) {
    if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
      var c = b.children[0];
      c.id = b.id;
      c.parentFlushed = true;
      1 === c.status && Y(a, c);
    } else
      a.completedSegments.push(b);
  }
  __name(Y, "Y");
  function Kb(a, b, c) {
    if (null === b) {
      if (c.parentFlushed) {
        if (null !== a.completedRootSegment)
          throw Error(l(389));
        a.completedRootSegment = c;
      }
      a.pendingRootTasks--;
      0 === a.pendingRootTasks && (a.onShellError = T, b = a.onShellReady, b());
    } else
      b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && Y(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(Jb, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (Y(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
    a.allPendingTasks--;
    0 === a.allPendingTasks && (a = a.onAllReady, a());
  }
  __name(Kb, "Kb");
  function Cb(a) {
    if (2 !== a.status) {
      var b = E2, c = yb.current;
      yb.current = xb;
      var d = S;
      S = a.responseState;
      try {
        var f = a.pingedTasks, e;
        for (e = 0; e < f.length; e++) {
          var g = f[e];
          var h = a, k = g.blockedSegment;
          if (0 === k.status) {
            G(g.context);
            try {
              X(h, g, g.node), h.responseState.generateStaticMarkup || k.lastPushedText && k.textEmbedded && k.chunks.push("<!-- -->"), g.abortSet.delete(g), k.status = 1, Kb(h, g.blockedBoundary, k);
            } catch (z) {
              if (rb(), "object" === typeof z && null !== z && "function" === typeof z.then) {
                var m = g.ping;
                z.then(m, m);
              } else {
                g.abortSet.delete(g);
                k.status = 4;
                var n = g.blockedBoundary, q = z, C = V(h, q);
                null === n ? W(h, q) : (n.pendingTasks--, n.forceClientRender || (n.forceClientRender = true, n.errorDigest = C, n.parentFlushed && h.clientRenderedBoundaries.push(n)));
                h.allPendingTasks--;
                if (0 === h.allPendingTasks) {
                  var D = h.onAllReady;
                  D();
                }
              }
            } finally {
            }
          }
        }
        f.splice(0, e);
        null !== a.destination && Mb(a, a.destination);
      } catch (z) {
        V(a, z), W(a, z);
      } finally {
        S = d, yb.current = c, c === xb && G(b);
      }
    }
  }
  __name(Cb, "Cb");
  function Z(a, b, c) {
    c.parentFlushed = true;
    switch (c.status) {
      case 0:
        var d = c.id = a.nextSegmentId++;
        c.lastPushedText = false;
        c.textEmbedded = false;
        a = a.responseState;
        b.push('<template id="');
        b.push(a.placeholderPrefix);
        a = d.toString(16);
        b.push(a);
        return b.push('"></template>');
      case 1:
        c.status = 2;
        var f = true;
        d = c.chunks;
        var e = 0;
        c = c.children;
        for (var g = 0; g < c.length; g++) {
          for (f = c[g]; e < f.index; e++)
            b.push(d[e]);
          f = Nb(a, b, f);
        }
        for (; e < d.length - 1; e++)
          b.push(d[e]);
        e < d.length && (f = b.push(d[e]));
        return f;
      default:
        throw Error(l(390));
    }
  }
  __name(Z, "Z");
  function Nb(a, b, c) {
    var d = c.boundary;
    if (null === d)
      return Z(a, b, c);
    d.parentFlushed = true;
    if (d.forceClientRender)
      return a.responseState.generateStaticMarkup || (d = d.errorDigest, b.push("<!--$!-->"), b.push("<template"), d && (b.push(' data-dgst="'), d = v(d), b.push(d), b.push('"')), b.push("></template>")), Z(a, b, c), a = a.responseState.generateStaticMarkup ? true : b.push("<!--/$-->"), a;
    if (0 < d.pendingTasks) {
      d.rootSegmentID = a.nextSegmentId++;
      0 < d.completedSegments.length && a.partialBoundaries.push(d);
      var f = a.responseState;
      var e = f.nextSuspenseID++;
      f = f.boundaryPrefix + e.toString(16);
      d = d.id = f;
      za(b, a.responseState, d);
      Z(a, b, c);
      return b.push("<!--/$-->");
    }
    if (d.byteSize > a.progressiveChunkSize)
      return d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), za(b, a.responseState, d.id), Z(a, b, c), b.push("<!--/$-->");
    a.responseState.generateStaticMarkup || b.push("<!--$-->");
    c = d.completedSegments;
    if (1 !== c.length)
      throw Error(l(391));
    Nb(a, b, c[0]);
    a = a.responseState.generateStaticMarkup ? true : b.push("<!--/$-->");
    return a;
  }
  __name(Nb, "Nb");
  function Ob(a, b, c) {
    Aa(b, a.responseState, c.formatContext, c.id);
    Nb(a, b, c);
    return Ba(b, c.formatContext);
  }
  __name(Ob, "Ob");
  function Pb(a, b, c) {
    for (var d = c.completedSegments, f = 0; f < d.length; f++)
      Qb(a, b, c, d[f]);
    d.length = 0;
    a = a.responseState;
    d = c.id;
    c = c.rootSegmentID;
    b.push(a.startInlineScript);
    a.sentCompleteBoundaryFunction ? b.push('$RC("') : (a.sentCompleteBoundaryFunction = true, b.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'));
    if (null === d)
      throw Error(l(395));
    c = c.toString(16);
    b.push(d);
    b.push('","');
    b.push(a.segmentPrefix);
    b.push(c);
    return b.push('")<\/script>');
  }
  __name(Pb, "Pb");
  function Qb(a, b, c, d) {
    if (2 === d.status)
      return true;
    var f = d.id;
    if (-1 === f) {
      if (-1 === (d.id = c.rootSegmentID))
        throw Error(l(392));
      return Ob(a, b, d);
    }
    Ob(a, b, d);
    a = a.responseState;
    b.push(a.startInlineScript);
    a.sentCompleteSegmentFunction ? b.push('$RS("') : (a.sentCompleteSegmentFunction = true, b.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'));
    b.push(a.segmentPrefix);
    f = f.toString(16);
    b.push(f);
    b.push('","');
    b.push(a.placeholderPrefix);
    b.push(f);
    return b.push('")<\/script>');
  }
  __name(Qb, "Qb");
  function Mb(a, b) {
    try {
      var c = a.completedRootSegment;
      if (null !== c && 0 === a.pendingRootTasks) {
        Nb(a, b, c);
        a.completedRootSegment = null;
        var d = a.responseState.bootstrapChunks;
        for (c = 0; c < d.length - 1; c++)
          b.push(d[c]);
        c < d.length && b.push(d[c]);
      }
      var f = a.clientRenderedBoundaries, e;
      for (e = 0; e < f.length; e++) {
        var g = f[e];
        d = b;
        var h = a.responseState, k = g.id, m = g.errorDigest, n = g.errorMessage, q = g.errorComponentStack;
        d.push(h.startInlineScript);
        h.sentClientRenderFunction ? d.push('$RX("') : (h.sentClientRenderFunction = true, d.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'));
        if (null === k)
          throw Error(l(395));
        d.push(k);
        d.push('"');
        if (m || n || q) {
          d.push(",");
          var C = Da(m || "");
          d.push(C);
        }
        if (n || q) {
          d.push(",");
          var D = Da(n || "");
          d.push(D);
        }
        if (q) {
          d.push(",");
          var z = Da(q);
          d.push(z);
        }
        if (!d.push(")<\/script>")) {
          a.destination = null;
          e++;
          f.splice(0, e);
          return;
        }
      }
      f.splice(0, e);
      var ba = a.completedBoundaries;
      for (e = 0; e < ba.length; e++)
        if (!Pb(a, b, ba[e])) {
          a.destination = null;
          e++;
          ba.splice(0, e);
          return;
        }
      ba.splice(0, e);
      var ca2 = a.partialBoundaries;
      for (e = 0; e < ca2.length; e++) {
        var mb = ca2[e];
        a: {
          f = a;
          g = b;
          var da = mb.completedSegments;
          for (h = 0; h < da.length; h++)
            if (!Qb(f, g, mb, da[h])) {
              h++;
              da.splice(0, h);
              var nb = false;
              break a;
            }
          da.splice(0, h);
          nb = true;
        }
        if (!nb) {
          a.destination = null;
          e++;
          ca2.splice(0, e);
          return;
        }
      }
      ca2.splice(0, e);
      var ea = a.completedBoundaries;
      for (e = 0; e < ea.length; e++)
        if (!Pb(a, b, ea[e])) {
          a.destination = null;
          e++;
          ea.splice(0, e);
          return;
        }
      ea.splice(0, e);
    } finally {
      0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.push(null);
    }
  }
  __name(Mb, "Mb");
  function Rb(a, b) {
    try {
      var c = a.abortableTasks;
      c.forEach(function(c2) {
        return Lb(c2, a, b);
      });
      c.clear();
      null !== a.destination && Mb(a, a.destination);
    } catch (d) {
      V(a, d), W(a, d);
    }
  }
  __name(Rb, "Rb");
  function Sb() {
  }
  __name(Sb, "Sb");
  function Tb(a, b, c, d) {
    var f = false, e = null, g = "", h = { push: function(a2) {
      null !== a2 && (g += a2);
      return true;
    }, destroy: function(a2) {
      f = true;
      e = a2;
    } }, k = false;
    a = Ab(a, Ea(c, b ? b.identifierPrefix : void 0), { insertionMode: 1, selectedValue: null }, Infinity, Sb, void 0, function() {
      k = true;
    });
    Cb(a);
    Rb(a, d);
    if (1 === a.status)
      a.status = 2, h.destroy(a.fatalError);
    else if (2 !== a.status && null === a.destination) {
      a.destination = h;
      try {
        Mb(a, h);
      } catch (m) {
        V(a, m), W(a, m);
      }
    }
    if (f)
      throw e;
    if (!k)
      throw Error(l(426));
    return g;
  }
  __name(Tb, "Tb");
  reactDomServerLegacy_browser_production_min.renderToNodeStream = function() {
    throw Error(l(207));
  };
  reactDomServerLegacy_browser_production_min.renderToStaticMarkup = function(a, b) {
    return Tb(a, b, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
  };
  reactDomServerLegacy_browser_production_min.renderToStaticNodeStream = function() {
    throw Error(l(208));
  };
  reactDomServerLegacy_browser_production_min.renderToString = function(a, b) {
    return Tb(a, b, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
  };
  reactDomServerLegacy_browser_production_min.version = "18.3.1";
  return reactDomServerLegacy_browser_production_min;
}
function requireReactDomServer_browser_production_min() {
  if (hasRequiredReactDomServer_browser_production_min)
    return reactDomServer_browser_production_min;
  hasRequiredReactDomServer_browser_production_min = 1;
  var aa = requireReact();
  function k(a) {
    for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
      b += "&args[]=" + encodeURIComponent(arguments[c]);
    return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  __name(k, "k");
  var l = null, n = 0;
  function p(a, b) {
    if (0 !== b.length)
      if (512 < b.length)
        0 < n && (a.enqueue(new Uint8Array(l.buffer, 0, n)), l = new Uint8Array(512), n = 0), a.enqueue(b);
      else {
        var c = l.length - n;
        c < b.length && (0 === c ? a.enqueue(l) : (l.set(b.subarray(0, c), n), a.enqueue(l), b = b.subarray(c)), l = new Uint8Array(512), n = 0);
        l.set(b, n);
        n += b.length;
      }
  }
  __name(p, "p");
  function t(a, b) {
    p(a, b);
    return true;
  }
  __name(t, "t");
  function ba(a) {
    l && 0 < n && (a.enqueue(new Uint8Array(l.buffer, 0, n)), l = null, n = 0);
  }
  __name(ba, "ba");
  var ca2 = new TextEncoder();
  function u(a) {
    return ca2.encode(a);
  }
  __name(u, "u");
  function w(a) {
    return ca2.encode(a);
  }
  __name(w, "w");
  function da(a, b) {
    "function" === typeof a.error ? a.error(b) : a.close();
  }
  __name(da, "da");
  var x = Object.prototype.hasOwnProperty, ea = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, fa = {}, ha = {};
  function ia(a) {
    if (x.call(ha, a))
      return true;
    if (x.call(fa, a))
      return false;
    if (ea.test(a))
      return ha[a] = true;
    fa[a] = true;
    return false;
  }
  __name(ia, "ia");
  function y(a, b, c, d, f, e, g) {
    this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
    this.attributeName = d;
    this.attributeNamespace = f;
    this.mustUseProperty = c;
    this.propertyName = a;
    this.type = b;
    this.sanitizeURL = e;
    this.removeEmptyString = g;
  }
  __name(y, "y");
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z[a] = new y(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b = a[0];
    z[b] = new y(b, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z[a] = new y(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z[a] = new y(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z[a] = new y(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z[a] = new y(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z[a] = new y(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z[a] = new y(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z[a] = new y(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ja = /[\-:]([a-z])/g;
  function ka(a) {
    return a[1].toUpperCase();
  }
  __name(ka, "ka");
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b = a.replace(
      ja,
      ka
    );
    z[b] = new y(b, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b = a.replace(ja, ka);
    z[b] = new y(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b = a.replace(ja, ka);
    z[b] = new y(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z[a] = new y(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z.xlinkHref = new y("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z[a] = new y(a, 1, false, a.toLowerCase(), null, true, true);
  });
  var B = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, la = ["Webkit", "ms", "Moz", "O"];
  Object.keys(B).forEach(function(a) {
    la.forEach(function(b) {
      b = b + a.charAt(0).toUpperCase() + a.substring(1);
      B[b] = B[a];
    });
  });
  var oa = /["'&<>]/;
  function C(a) {
    if ("boolean" === typeof a || "number" === typeof a)
      return "" + a;
    a = "" + a;
    var b = oa.exec(a);
    if (b) {
      var c = "", d, f = 0;
      for (d = b.index; d < a.length; d++) {
        switch (a.charCodeAt(d)) {
          case 34:
            b = "&quot;";
            break;
          case 38:
            b = "&amp;";
            break;
          case 39:
            b = "&#x27;";
            break;
          case 60:
            b = "&lt;";
            break;
          case 62:
            b = "&gt;";
            break;
          default:
            continue;
        }
        f !== d && (c += a.substring(f, d));
        f = d + 1;
        c += b;
      }
      a = f !== d ? c + a.substring(f, d) : c;
    }
    return a;
  }
  __name(C, "C");
  var pa = /([A-Z])/g, qa = /^ms-/, ra = Array.isArray, sa = w("<script>"), ta = w("<\/script>"), ua = w('<script src="'), va = w('<script type="module" src="'), wa = w('" async=""><\/script>'), xa = /(<\/|<)(s)(cript)/gi;
  function ya(a, b, c, d) {
    return "" + b + ("s" === c ? "\\u0073" : "\\u0053") + d;
  }
  __name(ya, "ya");
  function za(a, b, c, d, f) {
    a = void 0 === a ? "" : a;
    b = void 0 === b ? sa : w('<script nonce="' + C(b) + '">');
    var e = [];
    void 0 !== c && e.push(b, u(("" + c).replace(xa, ya)), ta);
    if (void 0 !== d)
      for (c = 0; c < d.length; c++)
        e.push(ua, u(C(d[c])), wa);
    if (void 0 !== f)
      for (d = 0; d < f.length; d++)
        e.push(va, u(C(f[d])), wa);
    return { bootstrapChunks: e, startInlineScript: b, placeholderPrefix: w(a + "P:"), segmentPrefix: w(a + "S:"), boundaryPrefix: a + "B:", idPrefix: a, nextSuspenseID: 0, sentCompleteSegmentFunction: false, sentCompleteBoundaryFunction: false, sentClientRenderFunction: false };
  }
  __name(za, "za");
  function D(a, b) {
    return { insertionMode: a, selectedValue: b };
  }
  __name(D, "D");
  function Aa(a) {
    return D("http://www.w3.org/2000/svg" === a ? 2 : "http://www.w3.org/1998/Math/MathML" === a ? 3 : 0, null);
  }
  __name(Aa, "Aa");
  function Ba(a, b, c) {
    switch (b) {
      case "select":
        return D(1, null != c.value ? c.value : c.defaultValue);
      case "svg":
        return D(2, null);
      case "math":
        return D(3, null);
      case "foreignObject":
        return D(1, null);
      case "table":
        return D(4, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return D(5, null);
      case "colgroup":
        return D(7, null);
      case "tr":
        return D(6, null);
    }
    return 4 <= a.insertionMode || 0 === a.insertionMode ? D(1, null) : a;
  }
  __name(Ba, "Ba");
  var Ca = w("<!-- -->");
  function Da(a, b, c, d) {
    if ("" === b)
      return d;
    d && a.push(Ca);
    a.push(u(C(b)));
    return true;
  }
  __name(Da, "Da");
  var Ea = /* @__PURE__ */ new Map(), Fa = w(' style="'), Ga = w(":"), Ha = w(";");
  function Ia(a, b, c) {
    if ("object" !== typeof c)
      throw Error(k(62));
    b = true;
    for (var d in c)
      if (x.call(c, d)) {
        var f = c[d];
        if (null != f && "boolean" !== typeof f && "" !== f) {
          if (0 === d.indexOf("--")) {
            var e = u(C(d));
            f = u(C(("" + f).trim()));
          } else {
            e = d;
            var g = Ea.get(e);
            void 0 !== g ? e = g : (g = w(C(e.replace(pa, "-$1").toLowerCase().replace(qa, "-ms-"))), Ea.set(e, g), e = g);
            f = "number" === typeof f ? 0 === f || x.call(B, d) ? u("" + f) : u(f + "px") : u(C(("" + f).trim()));
          }
          b ? (b = false, a.push(Fa, e, Ga, f)) : a.push(Ha, e, Ga, f);
        }
      }
    b || a.push(E2);
  }
  __name(Ia, "Ia");
  var H = w(" "), I = w('="'), E2 = w('"'), Ja = w('=""');
  function J(a, b, c, d) {
    switch (c) {
      case "style":
        Ia(a, b, d);
        return;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
        return;
    }
    if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
      if (b = z.hasOwnProperty(c) ? z[c] : null, null !== b) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (!b.acceptsBooleans)
              return;
        }
        c = u(b.attributeName);
        switch (b.type) {
          case 3:
            d && a.push(H, c, Ja);
            break;
          case 4:
            true === d ? a.push(H, c, Ja) : false !== d && a.push(H, c, I, u(C(d)), E2);
            break;
          case 5:
            isNaN(d) || a.push(H, c, I, u(C(d)), E2);
            break;
          case 6:
            !isNaN(d) && 1 <= d && a.push(H, c, I, u(C(d)), E2);
            break;
          default:
            b.sanitizeURL && (d = "" + d), a.push(H, c, I, u(C(d)), E2);
        }
      } else if (ia(c)) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b)
              return;
        }
        a.push(H, u(c), I, u(C(d)), E2);
      }
    }
  }
  __name(J, "J");
  var K = w(">"), Ka = w("/>");
  function L(a, b, c) {
    if (null != b) {
      if (null != c)
        throw Error(k(60));
      if ("object" !== typeof b || !("__html" in b))
        throw Error(k(61));
      b = b.__html;
      null !== b && void 0 !== b && a.push(u("" + b));
    }
  }
  __name(L, "L");
  function La(a) {
    var b = "";
    aa.Children.forEach(a, function(a2) {
      null != a2 && (b += a2);
    });
    return b;
  }
  __name(La, "La");
  var Ma = w(' selected=""');
  function Na(a, b, c, d) {
    a.push(M(c));
    var f = c = null, e;
    for (e in b)
      if (x.call(b, e)) {
        var g = b[e];
        if (null != g)
          switch (e) {
            case "children":
              c = g;
              break;
            case "dangerouslySetInnerHTML":
              f = g;
              break;
            default:
              J(a, d, e, g);
          }
      }
    a.push(K);
    L(a, f, c);
    return "string" === typeof c ? (a.push(u(C(c))), null) : c;
  }
  __name(Na, "Na");
  var Oa = w("\n"), Pa = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, Qa = /* @__PURE__ */ new Map();
  function M(a) {
    var b = Qa.get(a);
    if (void 0 === b) {
      if (!Pa.test(a))
        throw Error(k(65, a));
      b = w("<" + a);
      Qa.set(a, b);
    }
    return b;
  }
  __name(M, "M");
  var Ra = w("<!DOCTYPE html>");
  function Sa(a, b, c, d, f) {
    switch (b) {
      case "select":
        a.push(M("select"));
        var e = null, g = null;
        for (r2 in c)
          if (x.call(c, r2)) {
            var h = c[r2];
            if (null != h)
              switch (r2) {
                case "children":
                  e = h;
                  break;
                case "dangerouslySetInnerHTML":
                  g = h;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  J(a, d, r2, h);
              }
          }
        a.push(K);
        L(a, g, e);
        return e;
      case "option":
        g = f.selectedValue;
        a.push(M("option"));
        var m = h = null, q = null;
        var r2 = null;
        for (e in c)
          if (x.call(c, e)) {
            var v = c[e];
            if (null != v)
              switch (e) {
                case "children":
                  h = v;
                  break;
                case "selected":
                  q = v;
                  break;
                case "dangerouslySetInnerHTML":
                  r2 = v;
                  break;
                case "value":
                  m = v;
                default:
                  J(a, d, e, v);
              }
          }
        if (null != g)
          if (c = null !== m ? "" + m : La(h), ra(g))
            for (d = 0; d < g.length; d++) {
              if ("" + g[d] === c) {
                a.push(Ma);
                break;
              }
            }
          else
            "" + g === c && a.push(Ma);
        else
          q && a.push(Ma);
        a.push(K);
        L(a, r2, h);
        return h;
      case "textarea":
        a.push(M("textarea"));
        r2 = g = e = null;
        for (h in c)
          if (x.call(c, h) && (m = c[h], null != m))
            switch (h) {
              case "children":
                r2 = m;
                break;
              case "value":
                e = m;
                break;
              case "defaultValue":
                g = m;
                break;
              case "dangerouslySetInnerHTML":
                throw Error(k(91));
              default:
                J(a, d, h, m);
            }
        null === e && null !== g && (e = g);
        a.push(K);
        if (null != r2) {
          if (null != e)
            throw Error(k(92));
          if (ra(r2) && 1 < r2.length)
            throw Error(k(93));
          e = "" + r2;
        }
        "string" === typeof e && "\n" === e[0] && a.push(Oa);
        null !== e && a.push(u(C("" + e)));
        return null;
      case "input":
        a.push(M("input"));
        m = r2 = h = e = null;
        for (g in c)
          if (x.call(c, g) && (q = c[g], null != q))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(k(399, "input"));
              case "defaultChecked":
                m = q;
                break;
              case "defaultValue":
                h = q;
                break;
              case "checked":
                r2 = q;
                break;
              case "value":
                e = q;
                break;
              default:
                J(a, d, g, q);
            }
        null !== r2 ? J(
          a,
          d,
          "checked",
          r2
        ) : null !== m && J(a, d, "checked", m);
        null !== e ? J(a, d, "value", e) : null !== h && J(a, d, "value", h);
        a.push(Ka);
        return null;
      case "menuitem":
        a.push(M("menuitem"));
        for (var A in c)
          if (x.call(c, A) && (e = c[A], null != e))
            switch (A) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(k(400));
              default:
                J(a, d, A, e);
            }
        a.push(K);
        return null;
      case "title":
        a.push(M("title"));
        e = null;
        for (v in c)
          if (x.call(c, v) && (g = c[v], null != g))
            switch (v) {
              case "children":
                e = g;
                break;
              case "dangerouslySetInnerHTML":
                throw Error(k(434));
              default:
                J(a, d, v, g);
            }
        a.push(K);
        return e;
      case "listing":
      case "pre":
        a.push(M(b));
        g = e = null;
        for (m in c)
          if (x.call(c, m) && (h = c[m], null != h))
            switch (m) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              default:
                J(a, d, m, h);
            }
        a.push(K);
        if (null != g) {
          if (null != e)
            throw Error(k(60));
          if ("object" !== typeof g || !("__html" in g))
            throw Error(k(61));
          c = g.__html;
          null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push(Oa, u(c)) : a.push(u("" + c)));
        }
        "string" === typeof e && "\n" === e[0] && a.push(Oa);
        return e;
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        a.push(M(b));
        for (var F in c)
          if (x.call(c, F) && (e = c[F], null != e))
            switch (F) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(k(399, b));
              default:
                J(a, d, F, e);
            }
        a.push(Ka);
        return null;
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return Na(a, c, b, d);
      case "html":
        return 0 === f.insertionMode && a.push(Ra), Na(a, c, b, d);
      default:
        if (-1 === b.indexOf("-") && "string" !== typeof c.is)
          return Na(a, c, b, d);
        a.push(M(b));
        g = e = null;
        for (q in c)
          if (x.call(c, q) && (h = c[q], null != h))
            switch (q) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              case "style":
                Ia(a, d, h);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                break;
              default:
                ia(q) && "function" !== typeof h && "symbol" !== typeof h && a.push(H, u(q), I, u(C(h)), E2);
            }
        a.push(K);
        L(a, g, e);
        return e;
    }
  }
  __name(Sa, "Sa");
  var Ta = w("</"), Ua = w(">"), Va = w('<template id="'), Wa = w('"></template>'), Xa = w("<!--$-->"), Ya = w('<!--$?--><template id="'), Za = w('"></template>'), $a = w("<!--$!-->"), ab = w("<!--/$-->"), bb = w("<template"), cb = w('"'), db = w(' data-dgst="');
  w(' data-msg="');
  w(' data-stck="');
  var eb = w("></template>");
  function fb(a, b, c) {
    p(a, Ya);
    if (null === c)
      throw Error(k(395));
    p(a, c);
    return t(a, Za);
  }
  __name(fb, "fb");
  var gb = w('<div hidden id="'), hb = w('">'), ib = w("</div>"), jb = w('<svg aria-hidden="true" style="display:none" id="'), kb = w('">'), lb = w("</svg>"), mb = w('<math aria-hidden="true" style="display:none" id="'), nb = w('">'), ob = w("</math>"), pb = w('<table hidden id="'), qb = w('">'), rb = w("</table>"), sb = w('<table hidden><tbody id="'), tb = w('">'), ub = w("</tbody></table>"), vb = w('<table hidden><tr id="'), wb = w('">'), xb = w("</tr></table>"), yb = w('<table hidden><colgroup id="'), zb = w('">'), Ab = w("</colgroup></table>");
  function Bb(a, b, c, d) {
    switch (c.insertionMode) {
      case 0:
      case 1:
        return p(a, gb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, hb);
      case 2:
        return p(a, jb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, kb);
      case 3:
        return p(a, mb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, nb);
      case 4:
        return p(a, pb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, qb);
      case 5:
        return p(a, sb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, tb);
      case 6:
        return p(a, vb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, wb);
      case 7:
        return p(
          a,
          yb
        ), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, zb);
      default:
        throw Error(k(397));
    }
  }
  __name(Bb, "Bb");
  function Cb(a, b) {
    switch (b.insertionMode) {
      case 0:
      case 1:
        return t(a, ib);
      case 2:
        return t(a, lb);
      case 3:
        return t(a, ob);
      case 4:
        return t(a, rb);
      case 5:
        return t(a, ub);
      case 6:
        return t(a, xb);
      case 7:
        return t(a, Ab);
      default:
        throw Error(k(397));
    }
  }
  __name(Cb, "Cb");
  var Db = w('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'), Eb = w('$RS("'), Gb = w('","'), Hb = w('")<\/script>'), Ib = w('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'), Jb = w('$RC("'), Kb = w('","'), Lb = w('")<\/script>'), Mb = w('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'), Nb = w('$RX("'), Ob = w('"'), Pb = w(")<\/script>"), Qb = w(","), Rb = /[<\u2028\u2029]/g;
  function Sb(a) {
    return JSON.stringify(a).replace(Rb, function(a2) {
      switch (a2) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
      }
    });
  }
  __name(Sb, "Sb");
  var N = Object.assign, Tb = Symbol.for("react.element"), Ub = Symbol.for("react.portal"), Vb = Symbol.for("react.fragment"), Wb = Symbol.for("react.strict_mode"), Xb = Symbol.for("react.profiler"), Yb = Symbol.for("react.provider"), Zb = Symbol.for("react.context"), $b = Symbol.for("react.forward_ref"), ac = Symbol.for("react.suspense"), bc = Symbol.for("react.suspense_list"), cc = Symbol.for("react.memo"), dc = Symbol.for("react.lazy"), ec = Symbol.for("react.scope"), fc = Symbol.for("react.debug_trace_mode"), gc = Symbol.for("react.legacy_hidden"), hc = Symbol.for("react.default_value"), ic = Symbol.iterator;
  function jc(a) {
    if (null == a)
      return null;
    if ("function" === typeof a)
      return a.displayName || a.name || null;
    if ("string" === typeof a)
      return a;
    switch (a) {
      case Vb:
        return "Fragment";
      case Ub:
        return "Portal";
      case Xb:
        return "Profiler";
      case Wb:
        return "StrictMode";
      case ac:
        return "Suspense";
      case bc:
        return "SuspenseList";
    }
    if ("object" === typeof a)
      switch (a.$$typeof) {
        case Zb:
          return (a.displayName || "Context") + ".Consumer";
        case Yb:
          return (a._context.displayName || "Context") + ".Provider";
        case $b:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case cc:
          return b = a.displayName || null, null !== b ? b : jc(a.type) || "Memo";
        case dc:
          b = a._payload;
          a = a._init;
          try {
            return jc(a(b));
          } catch (c) {
          }
      }
    return null;
  }
  __name(jc, "jc");
  var kc = {};
  function lc(a, b) {
    a = a.contextTypes;
    if (!a)
      return kc;
    var c = {}, d;
    for (d in a)
      c[d] = b[d];
    return c;
  }
  __name(lc, "lc");
  var O = null;
  function P(a, b) {
    if (a !== b) {
      a.context._currentValue = a.parentValue;
      a = a.parent;
      var c = b.parent;
      if (null === a) {
        if (null !== c)
          throw Error(k(401));
      } else {
        if (null === c)
          throw Error(k(401));
        P(a, c);
      }
      b.context._currentValue = b.value;
    }
  }
  __name(P, "P");
  function mc(a) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    null !== a && mc(a);
  }
  __name(mc, "mc");
  function nc(a) {
    var b = a.parent;
    null !== b && nc(b);
    a.context._currentValue = a.value;
  }
  __name(nc, "nc");
  function oc(a, b) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    if (null === a)
      throw Error(k(402));
    a.depth === b.depth ? P(a, b) : oc(a, b);
  }
  __name(oc, "oc");
  function pc(a, b) {
    var c = b.parent;
    if (null === c)
      throw Error(k(402));
    a.depth === c.depth ? P(a, c) : pc(a, c);
    b.context._currentValue = b.value;
  }
  __name(pc, "pc");
  function Q(a) {
    var b = O;
    b !== a && (null === b ? nc(a) : null === a ? mc(b) : b.depth === a.depth ? P(b, a) : b.depth > a.depth ? oc(b, a) : pc(b, a), O = a);
  }
  __name(Q, "Q");
  var qc = { isMounted: function() {
    return false;
  }, enqueueSetState: function(a, b) {
    a = a._reactInternals;
    null !== a.queue && a.queue.push(b);
  }, enqueueReplaceState: function(a, b) {
    a = a._reactInternals;
    a.replace = true;
    a.queue = [b];
  }, enqueueForceUpdate: function() {
  } };
  function rc(a, b, c, d) {
    var f = void 0 !== a.state ? a.state : null;
    a.updater = qc;
    a.props = c;
    a.state = f;
    var e = { queue: [], replace: false };
    a._reactInternals = e;
    var g = b.contextType;
    a.context = "object" === typeof g && null !== g ? g._currentValue : d;
    g = b.getDerivedStateFromProps;
    "function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : N({}, f, g), a.state = f);
    if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount))
      if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && qc.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length)
        if (b = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b.length)
          a.state = b[0];
        else {
          e = g ? b[0] : a.state;
          f = true;
          for (g = g ? 1 : 0; g < b.length; g++) {
            var h = b[g];
            h = "function" === typeof h ? h.call(a, e, c, d) : h;
            null != h && (f ? (f = false, e = N({}, e, h)) : N(e, h));
          }
          a.state = e;
        }
      else
        e.queue = null;
  }
  __name(rc, "rc");
  var sc = { id: 1, overflow: "" };
  function tc(a, b, c) {
    var d = a.id;
    a = a.overflow;
    var f = 32 - uc(d) - 1;
    d &= ~(1 << f);
    c += 1;
    var e = 32 - uc(b) + f;
    if (30 < e) {
      var g = f - f % 5;
      e = (d & (1 << g) - 1).toString(32);
      d >>= g;
      f -= g;
      return { id: 1 << 32 - uc(b) + f | c << f | d, overflow: e + a };
    }
    return { id: 1 << e | c << f | d, overflow: a };
  }
  __name(tc, "tc");
  var uc = Math.clz32 ? Math.clz32 : vc, wc = Math.log, xc = Math.LN2;
  function vc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (wc(a) / xc | 0) | 0;
  }
  __name(vc, "vc");
  function yc(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  __name(yc, "yc");
  var zc = "function" === typeof Object.is ? Object.is : yc, R = null, Ac = null, Bc = null, S = null, T = false, Cc = false, U = 0, V = null, Dc = 0;
  function W() {
    if (null === R)
      throw Error(k(321));
    return R;
  }
  __name(W, "W");
  function Ec() {
    if (0 < Dc)
      throw Error(k(312));
    return { memoizedState: null, queue: null, next: null };
  }
  __name(Ec, "Ec");
  function Fc() {
    null === S ? null === Bc ? (T = false, Bc = S = Ec()) : (T = true, S = Bc) : null === S.next ? (T = false, S = S.next = Ec()) : (T = true, S = S.next);
    return S;
  }
  __name(Fc, "Fc");
  function Gc() {
    Ac = R = null;
    Cc = false;
    Bc = null;
    Dc = 0;
    S = V = null;
  }
  __name(Gc, "Gc");
  function Hc(a, b) {
    return "function" === typeof b ? b(a) : b;
  }
  __name(Hc, "Hc");
  function Ic(a, b, c) {
    R = W();
    S = Fc();
    if (T) {
      var d = S.queue;
      b = d.dispatch;
      if (null !== V && (c = V.get(d), void 0 !== c)) {
        V.delete(d);
        d = S.memoizedState;
        do
          d = a(d, c.action), c = c.next;
        while (null !== c);
        S.memoizedState = d;
        return [d, b];
      }
      return [S.memoizedState, b];
    }
    a = a === Hc ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
    S.memoizedState = a;
    a = S.queue = { last: null, dispatch: null };
    a = a.dispatch = Jc.bind(null, R, a);
    return [S.memoizedState, a];
  }
  __name(Ic, "Ic");
  function Kc(a, b) {
    R = W();
    S = Fc();
    b = void 0 === b ? null : b;
    if (null !== S) {
      var c = S.memoizedState;
      if (null !== c && null !== b) {
        var d = c[1];
        a:
          if (null === d)
            d = false;
          else {
            for (var f = 0; f < d.length && f < b.length; f++)
              if (!zc(b[f], d[f])) {
                d = false;
                break a;
              }
            d = true;
          }
        if (d)
          return c[0];
      }
    }
    a = a();
    S.memoizedState = [a, b];
    return a;
  }
  __name(Kc, "Kc");
  function Jc(a, b, c) {
    if (25 <= Dc)
      throw Error(k(301));
    if (a === R)
      if (Cc = true, a = { action: c, next: null }, null === V && (V = /* @__PURE__ */ new Map()), c = V.get(b), void 0 === c)
        V.set(b, a);
      else {
        for (b = c; null !== b.next; )
          b = b.next;
        b.next = a;
      }
  }
  __name(Jc, "Jc");
  function Lc() {
    throw Error(k(394));
  }
  __name(Lc, "Lc");
  function Mc() {
  }
  __name(Mc, "Mc");
  var Oc = { readContext: function(a) {
    return a._currentValue;
  }, useContext: function(a) {
    W();
    return a._currentValue;
  }, useMemo: Kc, useReducer: Ic, useRef: function(a) {
    R = W();
    S = Fc();
    var b = S.memoizedState;
    return null === b ? (a = { current: a }, S.memoizedState = a) : b;
  }, useState: function(a) {
    return Ic(Hc, a);
  }, useInsertionEffect: Mc, useLayoutEffect: function() {
  }, useCallback: function(a, b) {
    return Kc(function() {
      return a;
    }, b);
  }, useImperativeHandle: Mc, useEffect: Mc, useDebugValue: Mc, useDeferredValue: function(a) {
    W();
    return a;
  }, useTransition: function() {
    W();
    return [false, Lc];
  }, useId: function() {
    var a = Ac.treeContext;
    var b = a.overflow;
    a = a.id;
    a = (a & ~(1 << 32 - uc(a) - 1)).toString(32) + b;
    var c = Nc;
    if (null === c)
      throw Error(k(404));
    b = U++;
    a = ":" + c.idPrefix + "R" + a;
    0 < b && (a += "H" + b.toString(32));
    return a + ":";
  }, useMutableSource: function(a, b) {
    W();
    return b(a._source);
  }, useSyncExternalStore: function(a, b, c) {
    if (void 0 === c)
      throw Error(k(407));
    return c();
  } }, Nc = null, Pc = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  function Qc(a) {
    console.error(a);
    return null;
  }
  __name(Qc, "Qc");
  function X() {
  }
  __name(X, "X");
  function Rc(a, b, c, d, f, e, g, h, m) {
    var q = [], r2 = /* @__PURE__ */ new Set();
    b = { destination: null, responseState: b, progressiveChunkSize: void 0 === d ? 12800 : d, status: 0, fatalError: null, nextSegmentId: 0, allPendingTasks: 0, pendingRootTasks: 0, completedRootSegment: null, abortableTasks: r2, pingedTasks: q, clientRenderedBoundaries: [], completedBoundaries: [], partialBoundaries: [], onError: void 0 === f ? Qc : f, onAllReady: void 0 === e ? X : e, onShellReady: void 0 === g ? X : g, onShellError: void 0 === h ? X : h, onFatalError: void 0 === m ? X : m };
    c = Sc(b, 0, null, c, false, false);
    c.parentFlushed = true;
    a = Tc(b, a, null, c, r2, kc, null, sc);
    q.push(a);
    return b;
  }
  __name(Rc, "Rc");
  function Tc(a, b, c, d, f, e, g, h) {
    a.allPendingTasks++;
    null === c ? a.pendingRootTasks++ : c.pendingTasks++;
    var m = { node: b, ping: function() {
      var b2 = a.pingedTasks;
      b2.push(m);
      1 === b2.length && Uc(a);
    }, blockedBoundary: c, blockedSegment: d, abortSet: f, legacyContext: e, context: g, treeContext: h };
    f.add(m);
    return m;
  }
  __name(Tc, "Tc");
  function Sc(a, b, c, d, f, e) {
    return { status: 0, id: -1, index: b, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c, lastPushedText: f, textEmbedded: e };
  }
  __name(Sc, "Sc");
  function Y(a, b) {
    a = a.onError(b);
    if (null != a && "string" !== typeof a)
      throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
    return a;
  }
  __name(Y, "Y");
  function Vc(a, b) {
    var c = a.onShellError;
    c(b);
    c = a.onFatalError;
    c(b);
    null !== a.destination ? (a.status = 2, da(a.destination, b)) : (a.status = 1, a.fatalError = b);
  }
  __name(Vc, "Vc");
  function Wc(a, b, c, d, f) {
    R = {};
    Ac = b;
    U = 0;
    for (a = c(d, f); Cc; )
      Cc = false, U = 0, Dc += 1, S = null, a = c(d, f);
    Gc();
    return a;
  }
  __name(Wc, "Wc");
  function Xc(a, b, c, d) {
    var f = c.render(), e = d.childContextTypes;
    if (null !== e && void 0 !== e) {
      var g = b.legacyContext;
      if ("function" !== typeof c.getChildContext)
        d = g;
      else {
        c = c.getChildContext();
        for (var h in c)
          if (!(h in e))
            throw Error(k(108, jc(d) || "Unknown", h));
        d = N({}, g, c);
      }
      b.legacyContext = d;
      Z(a, b, f);
      b.legacyContext = g;
    } else
      Z(a, b, f);
  }
  __name(Xc, "Xc");
  function Yc(a, b) {
    if (a && a.defaultProps) {
      b = N({}, b);
      a = a.defaultProps;
      for (var c in a)
        void 0 === b[c] && (b[c] = a[c]);
      return b;
    }
    return b;
  }
  __name(Yc, "Yc");
  function Zc(a, b, c, d, f) {
    if ("function" === typeof c)
      if (c.prototype && c.prototype.isReactComponent) {
        f = lc(c, b.legacyContext);
        var e = c.contextType;
        e = new c(d, "object" === typeof e && null !== e ? e._currentValue : f);
        rc(e, c, d, f);
        Xc(a, b, e, c);
      } else {
        e = lc(c, b.legacyContext);
        f = Wc(a, b, c, d, e);
        var g = 0 !== U;
        if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof)
          rc(f, c, d, e), Xc(a, b, f, c);
        else if (g) {
          d = b.treeContext;
          b.treeContext = tc(d, 1, 0);
          try {
            Z(a, b, f);
          } finally {
            b.treeContext = d;
          }
        } else
          Z(a, b, f);
      }
    else if ("string" === typeof c) {
      f = b.blockedSegment;
      e = Sa(f.chunks, c, d, a.responseState, f.formatContext);
      f.lastPushedText = false;
      g = f.formatContext;
      f.formatContext = Ba(g, c, d);
      $c(a, b, e);
      f.formatContext = g;
      switch (c) {
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
          break;
        default:
          f.chunks.push(Ta, u(c), Ua);
      }
      f.lastPushedText = false;
    } else {
      switch (c) {
        case gc:
        case fc:
        case Wb:
        case Xb:
        case Vb:
          Z(a, b, d.children);
          return;
        case bc:
          Z(a, b, d.children);
          return;
        case ec:
          throw Error(k(343));
        case ac:
          a: {
            c = b.blockedBoundary;
            f = b.blockedSegment;
            e = d.fallback;
            d = d.children;
            g = /* @__PURE__ */ new Set();
            var h = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, m = Sc(a, f.chunks.length, h, f.formatContext, false, false);
            f.children.push(m);
            f.lastPushedText = false;
            var q = Sc(a, 0, null, f.formatContext, false, false);
            q.parentFlushed = true;
            b.blockedBoundary = h;
            b.blockedSegment = q;
            try {
              if ($c(
                a,
                b,
                d
              ), q.lastPushedText && q.textEmbedded && q.chunks.push(Ca), q.status = 1, ad(h, q), 0 === h.pendingTasks)
                break a;
            } catch (r2) {
              q.status = 4, h.forceClientRender = true, h.errorDigest = Y(a, r2);
            } finally {
              b.blockedBoundary = c, b.blockedSegment = f;
            }
            b = Tc(a, e, c, m, g, b.legacyContext, b.context, b.treeContext);
            a.pingedTasks.push(b);
          }
          return;
      }
      if ("object" === typeof c && null !== c)
        switch (c.$$typeof) {
          case $b:
            d = Wc(a, b, c.render, d, f);
            if (0 !== U) {
              c = b.treeContext;
              b.treeContext = tc(c, 1, 0);
              try {
                Z(a, b, d);
              } finally {
                b.treeContext = c;
              }
            } else
              Z(a, b, d);
            return;
          case cc:
            c = c.type;
            d = Yc(c, d);
            Zc(a, b, c, d, f);
            return;
          case Yb:
            f = d.children;
            c = c._context;
            d = d.value;
            e = c._currentValue;
            c._currentValue = d;
            g = O;
            O = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c, parentValue: e, value: d };
            b.context = d;
            Z(a, b, f);
            a = O;
            if (null === a)
              throw Error(k(403));
            d = a.parentValue;
            a.context._currentValue = d === hc ? a.context._defaultValue : d;
            a = O = a.parent;
            b.context = a;
            return;
          case Zb:
            d = d.children;
            d = d(c._currentValue);
            Z(a, b, d);
            return;
          case dc:
            f = c._init;
            c = f(c._payload);
            d = Yc(c, d);
            Zc(a, b, c, d, void 0);
            return;
        }
      throw Error(k(
        130,
        null == c ? c : typeof c,
        ""
      ));
    }
  }
  __name(Zc, "Zc");
  function Z(a, b, c) {
    b.node = c;
    if ("object" === typeof c && null !== c) {
      switch (c.$$typeof) {
        case Tb:
          Zc(a, b, c.type, c.props, c.ref);
          return;
        case Ub:
          throw Error(k(257));
        case dc:
          var d = c._init;
          c = d(c._payload);
          Z(a, b, c);
          return;
      }
      if (ra(c)) {
        bd(a, b, c);
        return;
      }
      null === c || "object" !== typeof c ? d = null : (d = ic && c[ic] || c["@@iterator"], d = "function" === typeof d ? d : null);
      if (d && (d = d.call(c))) {
        c = d.next();
        if (!c.done) {
          var f = [];
          do
            f.push(c.value), c = d.next();
          while (!c.done);
          bd(a, b, f);
        }
        return;
      }
      a = Object.prototype.toString.call(c);
      throw Error(k(31, "[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a));
    }
    "string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Da(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Da(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
  }
  __name(Z, "Z");
  function bd(a, b, c) {
    for (var d = c.length, f = 0; f < d; f++) {
      var e = b.treeContext;
      b.treeContext = tc(e, d, f);
      try {
        $c(a, b, c[f]);
      } finally {
        b.treeContext = e;
      }
    }
  }
  __name(bd, "bd");
  function $c(a, b, c) {
    var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
    try {
      return Z(a, b, c);
    } catch (m) {
      if (Gc(), "object" === typeof m && null !== m && "function" === typeof m.then) {
        c = m;
        var g = b.blockedSegment, h = Sc(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
        g.children.push(h);
        g.lastPushedText = false;
        a = Tc(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
        c.then(a, a);
        b.blockedSegment.formatContext = d;
        b.legacyContext = f;
        b.context = e;
        Q(e);
      } else
        throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, Q(e), m;
    }
  }
  __name($c, "$c");
  function cd(a) {
    var b = a.blockedBoundary;
    a = a.blockedSegment;
    a.status = 3;
    dd(this, b, a);
  }
  __name(cd, "cd");
  function ed(a, b, c) {
    var d = a.blockedBoundary;
    a.blockedSegment.status = 3;
    null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.close())) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, a = void 0 === c ? Error(k(432)) : c, d.errorDigest = b.onError(a), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
      return ed(a2, b, c);
    }), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (d = b.onAllReady, d()));
  }
  __name(ed, "ed");
  function ad(a, b) {
    if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
      var c = b.children[0];
      c.id = b.id;
      c.parentFlushed = true;
      1 === c.status && ad(a, c);
    } else
      a.completedSegments.push(b);
  }
  __name(ad, "ad");
  function dd(a, b, c) {
    if (null === b) {
      if (c.parentFlushed) {
        if (null !== a.completedRootSegment)
          throw Error(k(389));
        a.completedRootSegment = c;
      }
      a.pendingRootTasks--;
      0 === a.pendingRootTasks && (a.onShellError = X, b = a.onShellReady, b());
    } else
      b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && ad(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(cd, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (ad(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
    a.allPendingTasks--;
    0 === a.allPendingTasks && (a = a.onAllReady, a());
  }
  __name(dd, "dd");
  function Uc(a) {
    if (2 !== a.status) {
      var b = O, c = Pc.current;
      Pc.current = Oc;
      var d = Nc;
      Nc = a.responseState;
      try {
        var f = a.pingedTasks, e;
        for (e = 0; e < f.length; e++) {
          var g = f[e];
          var h = a, m = g.blockedSegment;
          if (0 === m.status) {
            Q(g.context);
            try {
              Z(h, g, g.node), m.lastPushedText && m.textEmbedded && m.chunks.push(Ca), g.abortSet.delete(g), m.status = 1, dd(h, g.blockedBoundary, m);
            } catch (G) {
              if (Gc(), "object" === typeof G && null !== G && "function" === typeof G.then) {
                var q = g.ping;
                G.then(q, q);
              } else {
                g.abortSet.delete(g);
                m.status = 4;
                var r2 = g.blockedBoundary, v = G, A = Y(h, v);
                null === r2 ? Vc(h, v) : (r2.pendingTasks--, r2.forceClientRender || (r2.forceClientRender = true, r2.errorDigest = A, r2.parentFlushed && h.clientRenderedBoundaries.push(r2)));
                h.allPendingTasks--;
                if (0 === h.allPendingTasks) {
                  var F = h.onAllReady;
                  F();
                }
              }
            } finally {
            }
          }
        }
        f.splice(0, e);
        null !== a.destination && fd(a, a.destination);
      } catch (G) {
        Y(a, G), Vc(a, G);
      } finally {
        Nc = d, Pc.current = c, c === Oc && Q(b);
      }
    }
  }
  __name(Uc, "Uc");
  function gd(a, b, c) {
    c.parentFlushed = true;
    switch (c.status) {
      case 0:
        var d = c.id = a.nextSegmentId++;
        c.lastPushedText = false;
        c.textEmbedded = false;
        a = a.responseState;
        p(b, Va);
        p(b, a.placeholderPrefix);
        a = u(d.toString(16));
        p(b, a);
        return t(b, Wa);
      case 1:
        c.status = 2;
        var f = true;
        d = c.chunks;
        var e = 0;
        c = c.children;
        for (var g = 0; g < c.length; g++) {
          for (f = c[g]; e < f.index; e++)
            p(b, d[e]);
          f = hd(a, b, f);
        }
        for (; e < d.length - 1; e++)
          p(b, d[e]);
        e < d.length && (f = t(b, d[e]));
        return f;
      default:
        throw Error(k(390));
    }
  }
  __name(gd, "gd");
  function hd(a, b, c) {
    var d = c.boundary;
    if (null === d)
      return gd(a, b, c);
    d.parentFlushed = true;
    if (d.forceClientRender)
      d = d.errorDigest, t(b, $a), p(b, bb), d && (p(b, db), p(b, u(C(d))), p(b, cb)), t(b, eb), gd(a, b, c);
    else if (0 < d.pendingTasks) {
      d.rootSegmentID = a.nextSegmentId++;
      0 < d.completedSegments.length && a.partialBoundaries.push(d);
      var f = a.responseState;
      var e = f.nextSuspenseID++;
      f = w(f.boundaryPrefix + e.toString(16));
      d = d.id = f;
      fb(b, a.responseState, d);
      gd(a, b, c);
    } else if (d.byteSize > a.progressiveChunkSize)
      d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), fb(b, a.responseState, d.id), gd(a, b, c);
    else {
      t(b, Xa);
      c = d.completedSegments;
      if (1 !== c.length)
        throw Error(k(391));
      hd(a, b, c[0]);
    }
    return t(b, ab);
  }
  __name(hd, "hd");
  function id(a, b, c) {
    Bb(b, a.responseState, c.formatContext, c.id);
    hd(a, b, c);
    return Cb(b, c.formatContext);
  }
  __name(id, "id");
  function jd(a, b, c) {
    for (var d = c.completedSegments, f = 0; f < d.length; f++)
      kd(a, b, c, d[f]);
    d.length = 0;
    a = a.responseState;
    d = c.id;
    c = c.rootSegmentID;
    p(b, a.startInlineScript);
    a.sentCompleteBoundaryFunction ? p(b, Jb) : (a.sentCompleteBoundaryFunction = true, p(b, Ib));
    if (null === d)
      throw Error(k(395));
    c = u(c.toString(16));
    p(b, d);
    p(b, Kb);
    p(b, a.segmentPrefix);
    p(b, c);
    return t(b, Lb);
  }
  __name(jd, "jd");
  function kd(a, b, c, d) {
    if (2 === d.status)
      return true;
    var f = d.id;
    if (-1 === f) {
      if (-1 === (d.id = c.rootSegmentID))
        throw Error(k(392));
      return id(a, b, d);
    }
    id(a, b, d);
    a = a.responseState;
    p(b, a.startInlineScript);
    a.sentCompleteSegmentFunction ? p(b, Eb) : (a.sentCompleteSegmentFunction = true, p(b, Db));
    p(b, a.segmentPrefix);
    f = u(f.toString(16));
    p(b, f);
    p(b, Gb);
    p(b, a.placeholderPrefix);
    p(b, f);
    return t(b, Hb);
  }
  __name(kd, "kd");
  function fd(a, b) {
    l = new Uint8Array(512);
    n = 0;
    try {
      var c = a.completedRootSegment;
      if (null !== c && 0 === a.pendingRootTasks) {
        hd(a, b, c);
        a.completedRootSegment = null;
        var d = a.responseState.bootstrapChunks;
        for (c = 0; c < d.length - 1; c++)
          p(b, d[c]);
        c < d.length && t(b, d[c]);
      }
      var f = a.clientRenderedBoundaries, e;
      for (e = 0; e < f.length; e++) {
        var g = f[e];
        d = b;
        var h = a.responseState, m = g.id, q = g.errorDigest, r2 = g.errorMessage, v = g.errorComponentStack;
        p(d, h.startInlineScript);
        h.sentClientRenderFunction ? p(d, Nb) : (h.sentClientRenderFunction = true, p(
          d,
          Mb
        ));
        if (null === m)
          throw Error(k(395));
        p(d, m);
        p(d, Ob);
        if (q || r2 || v)
          p(d, Qb), p(d, u(Sb(q || "")));
        if (r2 || v)
          p(d, Qb), p(d, u(Sb(r2 || "")));
        v && (p(d, Qb), p(d, u(Sb(v))));
        if (!t(d, Pb))
          ;
      }
      f.splice(0, e);
      var A = a.completedBoundaries;
      for (e = 0; e < A.length; e++)
        if (!jd(a, b, A[e]))
          ;
      A.splice(0, e);
      ba(b);
      l = new Uint8Array(512);
      n = 0;
      var F = a.partialBoundaries;
      for (e = 0; e < F.length; e++) {
        var G = F[e];
        a: {
          f = a;
          g = b;
          var ma = G.completedSegments;
          for (h = 0; h < ma.length; h++)
            if (!kd(
              f,
              g,
              G,
              ma[h]
            )) {
              h++;
              ma.splice(0, h);
              var Fb = false;
              break a;
            }
          ma.splice(0, h);
          Fb = true;
        }
        if (!Fb) {
          a.destination = null;
          e++;
          F.splice(0, e);
          return;
        }
      }
      F.splice(0, e);
      var na = a.completedBoundaries;
      for (e = 0; e < na.length; e++)
        if (!jd(a, b, na[e]))
          ;
      na.splice(0, e);
    } finally {
      ba(b), 0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.close();
    }
  }
  __name(fd, "fd");
  function ld(a, b) {
    try {
      var c = a.abortableTasks;
      c.forEach(function(c2) {
        return ed(c2, a, b);
      });
      c.clear();
      null !== a.destination && fd(a, a.destination);
    } catch (d) {
      Y(a, d), Vc(a, d);
    }
  }
  __name(ld, "ld");
  reactDomServer_browser_production_min.renderToReadableStream = function(a, b) {
    return new Promise(function(c, d) {
      var f, e, g = new Promise(function(a2, b2) {
        e = a2;
        f = b2;
      }), h = Rc(a, za(b ? b.identifierPrefix : void 0, b ? b.nonce : void 0, b ? b.bootstrapScriptContent : void 0, b ? b.bootstrapScripts : void 0, b ? b.bootstrapModules : void 0), Aa(b ? b.namespaceURI : void 0), b ? b.progressiveChunkSize : void 0, b ? b.onError : void 0, e, function() {
        var a2 = new ReadableStream({ type: "bytes", pull: function(a3) {
          if (1 === h.status)
            h.status = 2, da(a3, h.fatalError);
          else if (2 !== h.status && null === h.destination) {
            h.destination = a3;
            try {
              fd(h, a3);
            } catch (A) {
              Y(h, A), Vc(h, A);
            }
          }
        }, cancel: function() {
          ld(h);
        } }, { highWaterMark: 0 });
        a2.allReady = g;
        c(a2);
      }, function(a2) {
        g.catch(function() {
        });
        d(a2);
      }, f);
      if (b && b.signal) {
        var m = b.signal, q = /* @__PURE__ */ __name(function() {
          ld(h, m.reason);
          m.removeEventListener("abort", q);
        }, "q");
        m.addEventListener("abort", q);
      }
      Uc(h);
    });
  };
  reactDomServer_browser_production_min.version = "18.3.1";
  return reactDomServer_browser_production_min;
}
function requireServer_browser() {
  if (hasRequiredServer_browser)
    return server_browser;
  hasRequiredServer_browser = 1;
  var l, s;
  {
    l = requireReactDomServerLegacy_browser_production_min();
    s = requireReactDomServer_browser_production_min();
  }
  server_browser.version = l.version;
  server_browser.renderToString = l.renderToString;
  server_browser.renderToStaticMarkup = l.renderToStaticMarkup;
  server_browser.renderToNodeStream = l.renderToNodeStream;
  server_browser.renderToStaticNodeStream = l.renderToStaticNodeStream;
  server_browser.renderToReadableStream = s.renderToReadableStream;
  return server_browser;
}
function getContext(rendererContextResult) {
  if (contexts.has(rendererContextResult)) {
    return contexts.get(rendererContextResult);
  }
  const ctx = {
    currentIndex: 0,
    get id() {
      return ID_PREFIX + this.currentIndex.toString();
    }
  };
  contexts.set(rendererContextResult, ctx);
  return ctx;
}
function incrementId(rendererContextResult) {
  const ctx = getContext(rendererContextResult);
  const id = ctx.id;
  ctx.currentIndex++;
  return id;
}
async function check(Component, props, children) {
  if (typeof Component === "object") {
    return Component["$$typeof"].toString().slice("Symbol(".length).startsWith("react");
  }
  if (typeof Component !== "function")
    return false;
  if (Component.name === "QwikComponent")
    return false;
  if (typeof Component === "function" && Component["$$typeof"] === Symbol.for("react.forward_ref"))
    return false;
  if (Component.prototype != null && typeof Component.prototype.render === "function") {
    return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
  }
  let isReactComponent = false;
  function Tester(...args) {
    try {
      const vnode = Component(...args);
      if (vnode && vnode["$$typeof"] === reactTypeof) {
        isReactComponent = true;
      }
    } catch {
    }
    return React.createElement("div");
  }
  __name(Tester, "Tester");
  await renderToStaticMarkup(Tester, props, children, {});
  return isReactComponent;
}
async function getNodeWritable() {
  let nodeStreamBuiltinModuleName = "node:stream";
  let { Writable } = await import(
    /* @vite-ignore */
    nodeStreamBuiltinModuleName
  );
  return Writable;
}
function needsHydration(metadata) {
  return metadata.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  let prefix;
  if (this && this.result) {
    prefix = incrementId(this.result);
  }
  const attrs = { prefix };
  delete props["class"];
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = React.createElement(StaticHtml, {
      hydrate: needsHydration(metadata),
      value,
      name
    });
  }
  const newProps = {
    ...props,
    ...slots
  };
  const newChildren = children ?? props.children;
  if (newChildren != null) {
    newProps.children = React.createElement(StaticHtml, {
      hydrate: needsHydration(metadata),
      value: newChildren
    });
  }
  const formState = this ? await getFormState(this) : void 0;
  if (formState) {
    attrs["data-action-result"] = JSON.stringify(formState[0]);
    attrs["data-action-key"] = formState[1];
    attrs["data-action-name"] = formState[2];
  }
  const vnode = React.createElement(Component, newProps);
  const renderOptions = {
    identifierPrefix: prefix,
    formState
  };
  let html;
  if ("renderToReadableStream" in ReactDOM) {
    html = await renderToReadableStreamAsync(vnode, renderOptions);
  } else {
    html = await renderToPipeableStreamAsync(vnode, renderOptions);
  }
  return { html, attrs };
}
async function getFormState({ result }) {
  const { request, actionResult } = result;
  if (!actionResult)
    return void 0;
  if (!isFormRequest(request.headers.get("content-type")))
    return void 0;
  const { searchParams } = new URL(request.url);
  const formData = await request.clone().formData();
  const actionKey = formData.get("$ACTION_KEY")?.toString();
  const actionName = searchParams.get("_astroAction") ?? /* Legacy. TODO: remove for stable */
  formData.get("_astroAction")?.toString();
  if (!actionKey || !actionName)
    return void 0;
  return [actionResult, actionKey, actionName];
}
async function renderToPipeableStreamAsync(vnode, options) {
  const Writable = await getNodeWritable();
  let html = "";
  return new Promise((resolve, reject) => {
    let error2 = void 0;
    let stream = ReactDOM.renderToPipeableStream(vnode, {
      ...options,
      onError(err) {
        error2 = err;
        reject(error2);
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString("utf-8");
              callback();
            },
            destroy() {
              resolve(html);
            }
          })
        );
      }
    });
  });
}
async function readResult(stream) {
  const reader = stream.getReader();
  let result = "";
  const decoder2 = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (value) {
        result += decoder2.decode(value);
      } else {
        decoder2.decode(new Uint8Array());
      }
      return result;
    }
    result += decoder2.decode(value, { stream: true });
  }
}
async function renderToReadableStreamAsync(vnode, options) {
  return await readResult(await ReactDOM.renderToReadableStream(vnode, options));
}
function isFormRequest(contentType) {
  const type = contentType?.split(";")[0].toLowerCase();
  return formContentTypes.some((t) => type === t);
}
var react, react_production_min, hasRequiredReact_production_min, hasRequiredReact, reactExports, React, server_browser, reactDomServerLegacy_browser_production_min, hasRequiredReactDomServerLegacy_browser_production_min, reactDomServer_browser_production_min, hasRequiredReactDomServer_browser_production_min, hasRequiredServer_browser, server_browserExports, ReactDOM, contexts, ID_PREFIX, StaticHtml, slotName, reactTypeof, formContentTypes, _renderer0, renderers;
var init_astro_renderers_O4SP2Us9 = __esm({
  ".wrangler/tmp/pages-9XcfGz/chunks/_@astro-renderers_O4SP2Us9.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_BXn8oDq3();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    react = { exports: {} };
    react_production_min = {};
    __name(requireReact_production_min, "requireReact_production_min");
    __name(requireReact, "requireReact");
    reactExports = requireReact();
    React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
    server_browser = {};
    reactDomServerLegacy_browser_production_min = {};
    __name(requireReactDomServerLegacy_browser_production_min, "requireReactDomServerLegacy_browser_production_min");
    reactDomServer_browser_production_min = {};
    __name(requireReactDomServer_browser_production_min, "requireReactDomServer_browser_production_min");
    __name(requireServer_browser, "requireServer_browser");
    server_browserExports = requireServer_browser();
    ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(server_browserExports);
    contexts = /* @__PURE__ */ new WeakMap();
    ID_PREFIX = "r";
    __name(getContext, "getContext");
    __name(incrementId, "incrementId");
    StaticHtml = /* @__PURE__ */ __name(({ value, name, hydrate = true }) => {
      if (!value)
        return null;
      const tagName = hydrate ? "astro-slot" : "astro-static-slot";
      return reactExports.createElement(tagName, {
        name,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: value }
      });
    }, "StaticHtml");
    StaticHtml.shouldComponentUpdate = () => false;
    slotName = /* @__PURE__ */ __name((str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase()), "slotName");
    reactTypeof = Symbol.for("react.element");
    __name(check, "check");
    __name(getNodeWritable, "getNodeWritable");
    __name(needsHydration, "needsHydration");
    __name(renderToStaticMarkup, "renderToStaticMarkup");
    __name(getFormState, "getFormState");
    __name(renderToPipeableStreamAsync, "renderToPipeableStreamAsync");
    __name(readResult, "readResult");
    __name(renderToReadableStreamAsync, "renderToReadableStreamAsync");
    formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
    __name(isFormRequest, "isFormRequest");
    _renderer0 = {
      name: "@astrojs/react",
      check,
      renderToStaticMarkup,
      supportsAstroStaticSlot: true
    };
    renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: _renderer0 })];
  }
});

// .wrangler/tmp/pages-9XcfGz/chunks/astro-designed-error-pages_ooUQbXF3.mjs
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    binaryString += String.fromCharCode(dv.getUint8(i));
  }
  return binaryToAscii(binaryString);
}
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    dv.setUint8(i, binaryString.charCodeAt(i));
  }
  return arraybuffer;
}
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
function binaryToAscii(str) {
  let out = "";
  for (let i = 0; i < str.length; i += 3) {
    const groupsOfSix = [void 0, void 0, void 0, void 0];
    groupsOfSix[0] = str.charCodeAt(i) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i) & 3) << 4;
    if (str.length > i + 1) {
      groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i + 1) & 15) << 2;
    }
    if (str.length > i + 2) {
      groupsOfSix[2] |= str.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i + 2) & 63;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j]];
      }
    }
  }
  return out;
}
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number")
    return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED)
      return void 0;
    if (index === NAN)
      return NaN;
    if (index === POSITIVE_INFINITY)
      return Infinity;
    if (index === NEGATIVE_INFINITY)
      return -Infinity;
    if (index === NEGATIVE_ZERO)
      return -0;
    if (standalone)
      throw new Error(`Invalid input`);
    if (index in hydrated)
      return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers?.[type];
        if (reviver) {
          return hydrated[index] = reviver(hydrate(value[1]));
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            const typedArray = new TypedArrayConstructor(arraybuffer);
            hydrated[index] = typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE)
            continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key in value) {
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  __name(hydrate, "hydrate");
  return hydrate(0);
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__, { _: process.env._ })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
function requireCookie() {
  if (hasRequiredCookie)
    return cookie;
  hasRequiredCookie = 1;
  cookie.parse = parse2;
  cookie.serialize = serialize;
  var __toString = Object.prototype.toString;
  var __hasOwnProperty = Object.prototype.hasOwnProperty;
  var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
  var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
  var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  function parse2(str, opt) {
    if (typeof str !== "string") {
      throw new TypeError("argument str must be a string");
    }
    var obj = {};
    var len = str.length;
    if (len < 2)
      return obj;
    var dec = opt && opt.decode || decode;
    var index = 0;
    var eqIdx = 0;
    var endIdx = 0;
    do {
      eqIdx = str.indexOf("=", index);
      if (eqIdx === -1)
        break;
      endIdx = str.indexOf(";", index);
      if (endIdx === -1) {
        endIdx = len;
      } else if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      var keyStartIdx = startIndex(str, index, eqIdx);
      var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
      var key = str.slice(keyStartIdx, keyEndIdx);
      if (!__hasOwnProperty.call(obj, key)) {
        var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
        var valEndIdx = endIndex(str, endIdx, valStartIdx);
        if (str.charCodeAt(valStartIdx) === 34 && str.charCodeAt(valEndIdx - 1) === 34) {
          valStartIdx++;
          valEndIdx--;
        }
        var val = str.slice(valStartIdx, valEndIdx);
        obj[key] = tryDecode(val, dec);
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  __name(parse2, "parse");
  function startIndex(str, index, max) {
    do {
      var code = str.charCodeAt(index);
      if (code !== 32 && code !== 9)
        return index;
    } while (++index < max);
    return max;
  }
  __name(startIndex, "startIndex");
  function endIndex(str, index, min) {
    while (index > min) {
      var code = str.charCodeAt(--index);
      if (code !== 32 && code !== 9)
        return index + 1;
    }
    return min;
  }
  __name(endIndex, "endIndex");
  function serialize(name, val, opt) {
    var enc = opt && opt.encode || encodeURIComponent;
    if (typeof enc !== "function") {
      throw new TypeError("option encode is invalid");
    }
    if (!cookieNameRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    var value = enc(val);
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
    var str = name + "=" + value;
    if (!opt)
      return str;
    if (null != opt.maxAge) {
      var maxAge = Math.floor(opt.maxAge);
      if (!isFinite(maxAge)) {
        throw new TypeError("option maxAge is invalid");
      }
      str += "; Max-Age=" + maxAge;
    }
    if (opt.domain) {
      if (!domainValueRegExp.test(opt.domain)) {
        throw new TypeError("option domain is invalid");
      }
      str += "; Domain=" + opt.domain;
    }
    if (opt.path) {
      if (!pathValueRegExp.test(opt.path)) {
        throw new TypeError("option path is invalid");
      }
      str += "; Path=" + opt.path;
    }
    if (opt.expires) {
      var expires = opt.expires;
      if (!isDate(expires) || isNaN(expires.valueOf())) {
        throw new TypeError("option expires is invalid");
      }
      str += "; Expires=" + expires.toUTCString();
    }
    if (opt.httpOnly) {
      str += "; HttpOnly";
    }
    if (opt.secure) {
      str += "; Secure";
    }
    if (opt.partitioned) {
      str += "; Partitioned";
    }
    if (opt.priority) {
      var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (opt.sameSite) {
      var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
      switch (sameSite) {
        case true:
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return str;
  }
  __name(serialize, "serialize");
  function decode(str) {
    return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
  }
  __name(decode, "decode");
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  __name(isDate, "isDate");
  function tryDecode(str, decode2) {
    try {
      return decode2(str);
    } catch (e) {
      return str;
    }
  }
  __name(tryDecode, "tryDecode");
  return cookie;
}
function template({
  title,
  pathname,
  statusCode = 404,
  tabTitle,
  body
}) {
  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
async function default404Page({ pathname }) {
  return new Response(
    template({
      statusCode: 404,
      title: "Not found",
      tabTitle: "404: Not Found",
      pathname
    }),
    { status: 404, headers: { "Content-Type": "text/html" } }
  );
}
var ImportType, E, KEY_STRING, UNDEFINED, HOLE, NAN, POSITIVE_INFINITY, NEGATIVE_INFINITY, NEGATIVE_ZERO, ACTION_QUERY_PARAMS, __vite_import_meta_env__, codeToStatusMap, statusToCodeMap, ActionError, ActionInputError, actionResultErrorStack, cookie, hasRequiredCookie, cookieExports, DEFAULT_404_ROUTE, default404Instance;
var init_astro_designed_error_pages_ooUQbXF3 = __esm({
  ".wrangler/tmp/pages-9XcfGz/chunks/astro-designed-error-pages_ooUQbXF3.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_BXn8oDq3();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    !function(A) {
      A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase";
    }(ImportType || (ImportType = {}));
    1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
    E = /* @__PURE__ */ __name(() => {
      return A = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADMTAAAQECAgICAgICAgICAgICAgICAgIAAwMDBAQAAAUAAAAAAAMDAwAGAAAABwAGAgUEBQFwAQEBBQMBAAEGDwJ/AUHA8gALfwBBwPIACwd6FQZtZW1vcnkCAAJzYQAAAWUAAwJpcwAEAmllAAUCc3MABgJzZQAHAml0AAgCYWkACQJpZAAKAmlwAAsCZXMADAJlZQANA2VscwAOA2VsZQAPAnJpABACcmUAEQFmABICbXMAEwVwYXJzZQAUC19faGVhcF9iYXNlAwEKm0EwaAEBf0EAIAA2AoAKQQAoAtwJIgEgAEEBdGoiAEEAOwEAQQAgAEECaiIANgKECkEAIAA2AogKQQBBADYC4AlBAEEANgLwCUEAQQA2AugJQQBBADYC5AlBAEEANgL4CUEAQQA2AuwJIAEL0wEBA39BACgC8AkhBEEAQQAoAogKIgU2AvAJQQAgBDYC9AlBACAFQSRqNgKICiAEQSBqQeAJIAQbIAU2AgBBACgC1AkhBEEAKALQCSEGIAUgATYCACAFIAA2AgggBSACIAJBAmpBACAGIANGIgAbIAQgA0YiBBs2AgwgBSADNgIUIAVBADYCECAFIAI2AgQgBUEANgIgIAVBA0EBQQIgABsgBBs2AhwgBUEAKALQCSADRiICOgAYAkACQCACDQBBACgC1AkgA0cNAQtBAEEBOgCMCgsLXgEBf0EAKAL4CSIEQRBqQeQJIAQbQQAoAogKIgQ2AgBBACAENgL4CUEAIARBFGo2AogKQQBBAToAjAogBEEANgIQIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAAsIAEEAKAKQCgsVAEEAKALoCSgCAEEAKALcCWtBAXULHgEBf0EAKALoCSgCBCIAQQAoAtwJa0EBdUF/IAAbCxUAQQAoAugJKAIIQQAoAtwJa0EBdQseAQF/QQAoAugJKAIMIgBBACgC3AlrQQF1QX8gABsLCwBBACgC6AkoAhwLHgEBf0EAKALoCSgCECIAQQAoAtwJa0EBdUF/IAAbCzsBAX8CQEEAKALoCSgCFCIAQQAoAtAJRw0AQX8PCwJAIABBACgC1AlHDQBBfg8LIABBACgC3AlrQQF1CwsAQQAoAugJLQAYCxUAQQAoAuwJKAIAQQAoAtwJa0EBdQsVAEEAKALsCSgCBEEAKALcCWtBAXULHgEBf0EAKALsCSgCCCIAQQAoAtwJa0EBdUF/IAAbCx4BAX9BACgC7AkoAgwiAEEAKALcCWtBAXVBfyAAGwslAQF/QQBBACgC6AkiAEEgakHgCSAAGygCACIANgLoCSAAQQBHCyUBAX9BAEEAKALsCSIAQRBqQeQJIAAbKAIAIgA2AuwJIABBAEcLCABBAC0AlAoLCABBAC0AjAoL3Q0BBX8jAEGA0ABrIgAkAEEAQQE6AJQKQQBBACgC2Ak2ApwKQQBBACgC3AlBfmoiATYCsApBACABQQAoAoAKQQF0aiICNgK0CkEAQQA6AIwKQQBBADsBlgpBAEEAOwGYCkEAQQA6AKAKQQBBADYCkApBAEEAOgD8CUEAIABBgBBqNgKkCkEAIAA2AqgKQQBBADoArAoCQAJAAkACQANAQQAgAUECaiIDNgKwCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BmAoNASADEBVFDQEgAUEEakGCCEEKEC8NARAWQQAtAJQKDQFBAEEAKAKwCiIBNgKcCgwHCyADEBVFDQAgAUEEakGMCEEKEC8NABAXC0EAQQAoArAKNgKcCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAYDAELQQEQGQtBACgCtAohAkEAKAKwCiEBDAALC0EAIQIgAyEBQQAtAPwJDQIMAQtBACABNgKwCkEAQQA6AJQKCwNAQQAgAUECaiIDNgKwCgJAAkACQAJAAkACQAJAIAFBACgCtApPDQAgAy8BACICQXdqQQVJDQYCQAJAAkACQAJAAkACQAJAAkACQCACQWBqDgoQDwYPDw8PBQECAAsCQAJAAkACQCACQaB/ag4KCxISAxIBEhISAgALIAJBhX9qDgMFEQYJC0EALwGYCg0QIAMQFUUNECABQQRqQYIIQQoQLw0QEBYMEAsgAxAVRQ0PIAFBBGpBjAhBChAvDQ8QFwwPCyADEBVFDQ4gASkABELsgISDsI7AOVINDiABLwEMIgNBd2oiAUEXSw0MQQEgAXRBn4CABHFFDQwMDQtBAEEALwGYCiIBQQFqOwGYCkEAKAKkCiABQQN0aiIBQQE2AgAgAUEAKAKcCjYCBAwNC0EALwGYCiIDRQ0JQQAgA0F/aiIDOwGYCkEALwGWCiICRQ0MQQAoAqQKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCqApqQXxqKAIAIgMoAgQNACADQQAoApwKQQJqNgIEC0EAIAJBf2o7AZYKIAMgAUEEajYCDAwMCwJAQQAoApwKIgEvAQBBKUcNAEEAKALwCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAvQJIgM2AvAJAkAgA0UNACADQQA2AiAMAQtBAEEANgLgCQtBAEEALwGYCiIDQQFqOwGYCkEAKAKkCiADQQN0aiIDQQZBAkEALQCsChs2AgAgAyABNgIEQQBBADoArAoMCwtBAC8BmAoiAUUNB0EAIAFBf2oiATsBmApBACgCpAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQGgwJC0EiEBoMCAsgAkEvRw0HAkACQCABLwEEIgFBKkYNACABQS9HDQEQGAwKC0EBEBkMCQsCQAJAAkACQEEAKAKcCiIBLwEAIgMQG0UNAAJAAkAgA0FVag4EAAkBAwkLIAFBfmovAQBBK0YNAwwICyABQX5qLwEAQS1GDQIMBwsgA0EpRw0BQQAoAqQKQQAvAZgKIgJBA3RqKAIEEBxFDQIMBgsgAUF+ai8BAEFQakH//wNxQQpPDQULQQAvAZgKIQILAkACQCACQf//A3EiAkUNACADQeYARw0AQQAoAqQKIAJBf2pBA3RqIgQoAgBBAUcNACABQX5qLwEAQe8ARw0BIAQoAgRBlghBAxAdRQ0BDAULIANB/QBHDQBBACgCpAogAkEDdGoiAigCBBAeDQQgAigCAEEGRg0ECyABEB8NAyADRQ0DIANBL0ZBAC0AoApBAEdxDQMCQEEAKAL4CSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALcCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApwKIAEvAQAhAyABQX5qIgQhASADECBFDQALIARBAmohBAsCQCADQf//A3EQIUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYCnAogAS8BACEDIAFBfmoiBCEBIAMQIQ0ACyAEQQJqIQMLIAMQIg0EC0EAQQE6AKAKDAcLQQAoAqQKQQAvAZgKIgFBA3QiA2pBACgCnAo2AgRBACABQQFqOwGYCkEAKAKkCiADakEDNgIACxAjDAULQQAtAPwJQQAvAZYKQQAvAZgKcnJFIQIMBwsQJEEAQQA6AKAKDAMLECVBACECDAULIANBoAFHDQELQQBBAToArAoLQQBBACgCsAo2ApwKC0EAKAKwCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC3AkgAEcNAEEBDwsgAEF+ahAmC/4KAQZ/QQBBACgCsAoiAEEMaiIBNgKwCkEAKAL4CSECQQEQKSEDAkACQAJAAkACQAJAAkACQAJAQQAoArAKIgQgAUcNACADEChFDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKwCkEBECkhA0EAKAKwCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQLBpBACgCsAohAwwBCyADEBpBAEEAKAKwCkECaiIDNgKwCgtBARApGgJAIAQgAxAtIgNBLEcNAEEAQQAoArAKQQJqNgKwCkEBECkhAwsgA0H9AEYNA0EAKAKwCiIFIARGDQ8gBSEEIAVBACgCtApNDQAMDwsLQQAgBEECajYCsApBARApGkEAKAKwCiIDIAMQLRoMAgtBAEEAOgCUCgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCsAoCQAJAAkBBARApQZ9/ag4GABICEhIBEgtBACgCsAoiBSkAAkLzgOSD4I3AMVINESAFLwEKECFFDRFBACAFQQpqNgKwCkEAECkaC0EAKAKwCiIFQQJqQbIIQQ4QLw0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKwCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKwCkEAECkaQQAoArAKIQQLQQAgBEEQajYCsAoCQEEBECkiBEEqRw0AQQBBACgCsApBAmo2ArAKQQEQKSEEC0EAKAKwCiEDIAQQLBogA0EAKAKwCiIEIAMgBBACQQBBACgCsApBfmo2ArAKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQIEUNAEEAIARBCmo2ArAKQQEQKSEEQQAoArAKIQMgBBAsGiADQQAoArAKIgQgAyAEEAJBAEEAKAKwCkF+ajYCsAoPC0EAIARBBGoiBDYCsAoLQQAgBEEGajYCsApBAEEAOgCUCkEBECkhBEEAKAKwCiEDIAQQLCEEQQAoArAKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKwCkEBECkhBUEAKAKwCiEDQQAhBAwEC0EAQQE6AIwKQQBBACgCsApBAmo2ArAKC0EBECkhBEEAKAKwCiEDAkAgBEHmAEcNACADQQJqQawIQQYQLw0AQQAgA0EIajYCsAogAEEBEClBABArIAJBEGpB5AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2ArAKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAsGkEBIQQMAQsCQAJAQQAoArAKIgQgA0YNACADIAQgAyAEEAJBARApIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoArAKIQMCQCAEQSxHDQBBACADQQJqNgKwCkEBECkhBUEAKAKwCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCsAoLIAFB2wBHDQJBACACQX5qNgKwCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCsApBARApIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2ArAKAkBBARApIgVBKkcNAEEAQQAoArAKQQJqNgKwCkEBECkhBQsgBUEoRg0BC0EAKAKwCiEBIAUQLBpBACgCsAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoArAKQX5qNgKwCg8LIAQgA0EAQQAQAkEAIARBDGo2ArAKDwsQJQvcCAEGf0EAIQBBAEEAKAKwCiIBQQxqIgI2ArAKQQEQKSEDQQAoArAKIQQCQAJAAkACQAJAAkACQAJAIANBLkcNAEEAIARBAmo2ArAKAkBBARApIgNB8wBGDQAgA0HtAEcNB0EAKAKwCiIDQQJqQZwIQQYQLw0HAkBBACgCnAoiBBAqDQAgBC8BAEEuRg0ICyABIAEgA0EIakEAKALUCRABDwtBACgCsAoiA0ECakGiCEEKEC8NBgJAQQAoApwKIgQQKg0AIAQvAQBBLkYNBwsgA0EMaiEDDAELIANB8wBHDQEgBCACTQ0BQQYhAEEAIQIgBEECakGiCEEKEC8NAiAEQQxqIQMCQCAELwEMIgVBd2oiBEEXSw0AQQEgBHRBn4CABHENAQsgBUGgAUcNAgtBACADNgKwCkEBIQBBARApIQMLAkACQAJAAkAgA0H7AEYNACADQShHDQFBACgCpApBAC8BmAoiA0EDdGoiBEEAKAKwCjYCBEEAIANBAWo7AZgKIARBBTYCAEEAKAKcCi8BAEEuRg0HQQBBACgCsAoiBEECajYCsApBARApIQMgAUEAKAKwCkEAIAQQAQJAAkAgAA0AQQAoAvAJIQQMAQtBACgC8AkiBEEFNgIcC0EAQQAvAZYKIgBBAWo7AZYKQQAoAqgKIABBAnRqIAQ2AgACQCADQSJGDQAgA0EnRg0AQQBBACgCsApBfmo2ArAKDwsgAxAaQQBBACgCsApBAmoiAzYCsAoCQAJAAkBBARApQVdqDgQBAgIAAgtBAEEAKAKwCkECajYCsApBARApGkEAKALwCSIEIAM2AgQgBEEBOgAYIARBACgCsAoiAzYCEEEAIANBfmo2ArAKDwtBACgC8AkiBCADNgIEIARBAToAGEEAQQAvAZgKQX9qOwGYCiAEQQAoArAKQQJqNgIMQQBBAC8BlgpBf2o7AZYKDwtBAEEAKAKwCkF+ajYCsAoPCyAADQJBACgCsAohA0EALwGYCg0BA0ACQAJAAkAgA0EAKAK0Ck8NAEEBECkiA0EiRg0BIANBJ0YNASADQf0ARw0CQQBBACgCsApBAmo2ArAKC0EBECkhBEEAKAKwCiEDAkAgBEHmAEcNACADQQJqQawIQQYQLw0JC0EAIANBCGo2ArAKAkBBARApIgNBIkYNACADQSdHDQkLIAEgA0EAECsPCyADEBoLQQBBACgCsApBAmoiAzYCsAoMAAsLIAANAUEGIQBBACECAkAgA0FZag4EBAMDBAALIANBIkYNAwwCC0EAIANBfmo2ArAKDwtBDCEAQQEhAgtBACgCsAoiAyABIABBAXRqRw0AQQAgA0F+ajYCsAoPC0EALwGYCg0CQQAoArAKIQNBACgCtAohAANAIAMgAE8NAQJAAkAgAy8BACIEQSdGDQAgBEEiRw0BCyABIAQgAhArDwtBACADQQJqIgM2ArAKDAALCxAlCw8LQQBBACgCsApBfmo2ArAKC0cBA39BACgCsApBAmohAEEAKAK0CiEBAkADQCAAIgJBfmogAU8NASACQQJqIQAgAi8BAEF2ag4EAQAAAQALC0EAIAI2ArAKC5gBAQN/QQBBACgCsAoiAUECajYCsAogAUEGaiEBQQAoArQKIQIDQAJAAkACQCABQXxqIAJPDQAgAUF+ai8BACEDAkACQCAADQAgA0EqRg0BIANBdmoOBAIEBAIECyADQSpHDQMLIAEvAQBBL0cNAkEAIAFBfmo2ArAKDAELIAFBfmohAQtBACABNgKwCg8LIAFBAmohAQwACwuIAQEEf0EAKAKwCiEBQQAoArQKIQICQAJAA0AgASIDQQJqIQEgAyACTw0BIAEvAQAiBCAARg0CAkAgBEHcAEYNACAEQXZqDgQCAQECAQsgA0EEaiEBIAMvAQRBDUcNACADQQZqIAEgAy8BBkEKRhshAQwACwtBACABNgKwChAlDwtBACABNgKwCgtsAQF/AkACQCAAQV9qIgFBBUsNAEEBIAF0QTFxDQELIABBRmpB//8DcUEGSQ0AIABBKUcgAEFYakH//wNxQQdJcQ0AAkAgAEGlf2oOBAEAAAEACyAAQf0ARyAAQYV/akH//wNxQQRJcQ8LQQELLgEBf0EBIQECQCAAQaYJQQUQHQ0AIABBlghBAxAdDQAgAEGwCUECEB0hAQsgAQtGAQN/QQAhAwJAIAAgAkEBdCICayIEQQJqIgBBACgC3AkiBUkNACAAIAEgAhAvDQACQCAAIAVHDQBBAQ8LIAQQJiEDCyADC4MBAQJ/QQEhAQJAAkACQAJAAkACQCAALwEAIgJBRWoOBAUEBAEACwJAIAJBm39qDgQDBAQCAAsgAkEpRg0EIAJB+QBHDQMgAEF+akG8CUEGEB0PCyAAQX5qLwEAQT1GDwsgAEF+akG0CUEEEB0PCyAAQX5qQcgJQQMQHQ8LQQAhAQsgAQu0AwECf0EAIQECQAJAAkACQAJAAkACQAJAAkACQCAALwEAQZx/ag4UAAECCQkJCQMJCQQFCQkGCQcJCQgJCwJAAkAgAEF+ai8BAEGXf2oOBAAKCgEKCyAAQXxqQcoIQQIQHQ8LIABBfGpBzghBAxAdDwsCQAJAAkAgAEF+ai8BAEGNf2oOAwABAgoLAkAgAEF8ai8BACICQeEARg0AIAJB7ABHDQogAEF6akHlABAnDwsgAEF6akHjABAnDwsgAEF8akHUCEEEEB0PCyAAQXxqQdwIQQYQHQ8LIABBfmovAQBB7wBHDQYgAEF8ai8BAEHlAEcNBgJAIABBemovAQAiAkHwAEYNACACQeMARw0HIABBeGpB6AhBBhAdDwsgAEF4akH0CEECEB0PCyAAQX5qQfgIQQQQHQ8LQQEhASAAQX5qIgBB6QAQJw0EIABBgAlBBRAdDwsgAEF+akHkABAnDwsgAEF+akGKCUEHEB0PCyAAQX5qQZgJQQQQHQ8LAkAgAEF+ai8BACICQe8ARg0AIAJB5QBHDQEgAEF8akHuABAnDwsgAEF8akGgCUEDEB0hAQsgAQs0AQF/QQEhAQJAIABBd2pB//8DcUEFSQ0AIABBgAFyQaABRg0AIABBLkcgABAocSEBCyABCzABAX8CQAJAIABBd2oiAUEXSw0AQQEgAXRBjYCABHENAQsgAEGgAUYNAEEADwtBAQtOAQJ/QQAhAQJAAkAgAC8BACICQeUARg0AIAJB6wBHDQEgAEF+akH4CEEEEB0PCyAAQX5qLwEAQfUARw0AIABBfGpB3AhBBhAdIQELIAEL3gEBBH9BACgCsAohAEEAKAK0CiEBAkACQAJAA0AgACICQQJqIQAgAiABTw0BAkACQAJAIAAvAQAiA0Gkf2oOBQIDAwMBAAsgA0EkRw0CIAIvAQRB+wBHDQJBACACQQRqIgA2ArAKQQBBAC8BmAoiAkEBajsBmApBACgCpAogAkEDdGoiAkEENgIAIAIgADYCBA8LQQAgADYCsApBAEEALwGYCkF/aiIAOwGYCkEAKAKkCiAAQf//A3FBA3RqKAIAQQNHDQMMBAsgAkEEaiEADAALC0EAIAA2ArAKCxAlCwtwAQJ/AkACQANAQQBBACgCsAoiAEECaiIBNgKwCiAAQQAoArQKTw0BAkACQAJAIAEvAQAiAUGlf2oOAgECAAsCQCABQXZqDgQEAwMEAAsgAUEvRw0CDAQLEC4aDAELQQAgAEEEajYCsAoMAAsLECULCzUBAX9BAEEBOgD8CUEAKAKwCiEAQQBBACgCtApBAmo2ArAKQQAgAEEAKALcCWtBAXU2ApAKC0MBAn9BASEBAkAgAC8BACICQXdqQf//A3FBBUkNACACQYABckGgAUYNAEEAIQEgAhAoRQ0AIAJBLkcgABAqcg8LIAELPQECf0EAIQICQEEAKALcCSIDIABLDQAgAC8BACABRw0AAkAgAyAARw0AQQEPCyAAQX5qLwEAECAhAgsgAgtoAQJ/QQEhAQJAAkAgAEFfaiICQQVLDQBBASACdEExcQ0BCyAAQfj/A3FBKEYNACAAQUZqQf//A3FBBkkNAAJAIABBpX9qIgJBA0sNACACQQFHDQELIABBhX9qQf//A3FBBEkhAQsgAQucAQEDf0EAKAKwCiEBAkADQAJAAkAgAS8BACICQS9HDQACQCABLwECIgFBKkYNACABQS9HDQQQGAwCCyAAEBkMAQsCQAJAIABFDQAgAkF3aiIBQRdLDQFBASABdEGfgIAEcUUNAQwCCyACECFFDQMMAQsgAkGgAUcNAgtBAEEAKAKwCiIDQQJqIgE2ArAKIANBACgCtApJDQALCyACCzEBAX9BACEBAkAgAC8BAEEuRw0AIABBfmovAQBBLkcNACAAQXxqLwEAQS5GIQELIAELnAQBAX8CQCABQSJGDQAgAUEnRg0AECUPC0EAKAKwCiEDIAEQGiAAIANBAmpBACgCsApBACgC0AkQAQJAIAJFDQBBACgC8AlBBDYCHAtBAEEAKAKwCkECajYCsAoCQAJAAkACQEEAECkiAUHhAEYNACABQfcARg0BQQAoArAKIQEMAgtBACgCsAoiAUECakHACEEKEC8NAUEGIQAMAgtBACgCsAoiAS8BAkHpAEcNACABLwEEQfQARw0AQQQhACABLwEGQegARg0BC0EAIAFBfmo2ArAKDwtBACABIABBAXRqNgKwCgJAQQEQKUH7AEYNAEEAIAE2ArAKDwtBACgCsAoiAiEAA0BBACAAQQJqNgKwCgJAAkACQEEBECkiAEEiRg0AIABBJ0cNAUEnEBpBAEEAKAKwCkECajYCsApBARApIQAMAgtBIhAaQQBBACgCsApBAmo2ArAKQQEQKSEADAELIAAQLCEACwJAIABBOkYNAEEAIAE2ArAKDwtBAEEAKAKwCkECajYCsAoCQEEBECkiAEEiRg0AIABBJ0YNAEEAIAE2ArAKDwsgABAaQQBBACgCsApBAmo2ArAKAkACQEEBECkiAEEsRg0AIABB/QBGDQFBACABNgKwCg8LQQBBACgCsApBAmo2ArAKQQEQKUH9AEYNAEEAKAKwCiEADAELC0EAKALwCSIBIAI2AhAgAUEAKAKwCkECajYCDAttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARAoDQJBACECQQBBACgCsAoiAEECajYCsAogAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC6sBAQR/AkACQEEAKAKwCiICLwEAIgNB4QBGDQAgASEEIAAhBQwBC0EAIAJBBGo2ArAKQQEQKSECQQAoArAKIQUCQAJAIAJBIkYNACACQSdGDQAgAhAsGkEAKAKwCiEEDAELIAIQGkEAQQAoArAKQQJqIgQ2ArAKC0EBECkhA0EAKAKwCiECCwJAIAIgBUYNACAFIARBACAAIAAgAUYiAhtBACABIAIbEAILIAMLcgEEf0EAKAKwCiEAQQAoArQKIQECQAJAA0AgAEECaiECIAAgAU8NAQJAAkAgAi8BACIDQaR/ag4CAQQACyACIQAgA0F2ag4EAgEBAgELIABBBGohAAwACwtBACACNgKwChAlQQAPC0EAIAI2ArAKQd0AC0kBA39BACEDAkAgAkUNAAJAA0AgAC0AACIEIAEtAAAiBUcNASABQQFqIQEgAEEBaiEAIAJBf2oiAg0ADAILCyAEIAVrIQMLIAMLC+wBAgBBgAgLzgEAAHgAcABvAHIAdABtAHAAbwByAHQAZgBvAHIAZQB0AGEAbwB1AHIAYwBlAHIAbwBtAHUAbgBjAHQAaQBvAG4AcwBzAGUAcgB0AHYAbwB5AGkAZQBkAGUAbABlAGMAbwBuAHQAaQBuAGkAbgBzAHQAYQBuAHQAeQBiAHIAZQBhAHIAZQB0AHUAcgBkAGUAYgB1AGcAZwBlAGEAdwBhAGkAdABoAHIAdwBoAGkAbABlAGkAZgBjAGEAdABjAGYAaQBuAGEAbABsAGUAbABzAABB0AkLEAEAAAACAAAAAAQAAEA5AAA=", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), (A2) => A2.charCodeAt(0));
      var A;
    }, "E");
    WebAssembly.compile(E()).then(WebAssembly.instantiate).then(({ exports: A }) => {
    });
    __name(encode64, "encode64");
    __name(decode64, "decode64");
    KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    __name(asciiToBinary, "asciiToBinary");
    __name(binaryToAscii, "binaryToAscii");
    UNDEFINED = -1;
    HOLE = -2;
    NAN = -3;
    POSITIVE_INFINITY = -4;
    NEGATIVE_INFINITY = -5;
    NEGATIVE_ZERO = -6;
    __name(parse, "parse");
    __name(unflatten, "unflatten");
    ACTION_QUERY_PARAMS = {
      actionName: "_action"
    };
    __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
    codeToStatusMap = {
      // Implemented from tRPC error code table
      // https://trpc.io/docs/server/error-handling#error-codes
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      TIMEOUT: 405,
      CONFLICT: 409,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      UNSUPPORTED_MEDIA_TYPE: 415,
      UNPROCESSABLE_CONTENT: 422,
      TOO_MANY_REQUESTS: 429,
      CLIENT_CLOSED_REQUEST: 499,
      INTERNAL_SERVER_ERROR: 500
    };
    statusToCodeMap = Object.entries(codeToStatusMap).reduce(
      // reverse the key-value pairs
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );
    ActionError = class extends Error {
      type = "AstroActionError";
      code = "INTERNAL_SERVER_ERROR";
      status = 500;
      constructor(params) {
        super(params.message);
        this.code = params.code;
        this.status = ActionError.codeToStatus(params.code);
        if (params.stack) {
          this.stack = params.stack;
        }
      }
      static codeToStatus(code) {
        return codeToStatusMap[code];
      }
      static statusToCode(status) {
        return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
      }
      static fromJson(body) {
        if (isInputError(body)) {
          return new ActionInputError(body.issues);
        }
        if (isActionError(body)) {
          return new ActionError(body);
        }
        return new ActionError({
          code: "INTERNAL_SERVER_ERROR"
        });
      }
    };
    __name(ActionError, "ActionError");
    __name(isActionError, "isActionError");
    __name(isInputError, "isInputError");
    ActionInputError = class extends ActionError {
      type = "AstroActionInputError";
      // We don't expose all ZodError properties.
      // Not all properties will serialize from server to client,
      // and we don't want to import the full ZodError object into the client.
      issues;
      fields;
      constructor(issues) {
        super({
          message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
          code: "BAD_REQUEST"
        });
        this.issues = issues;
        this.fields = {};
        for (const issue of issues) {
          if (issue.path.length > 0) {
            const key = issue.path[0].toString();
            this.fields[key] ??= [];
            this.fields[key]?.push(issue.message);
          }
        }
      }
    };
    __name(ActionInputError, "ActionInputError");
    __name(getActionQueryString, "getActionQueryString");
    __name(deserializeActionResult, "deserializeActionResult");
    actionResultErrorStack = /* @__PURE__ */ (/* @__PURE__ */ __name(function actionResultErrorStackFn() {
      let errorStack;
      return {
        set(stack) {
          errorStack = stack;
        },
        get() {
          return errorStack;
        }
      };
    }, "actionResultErrorStackFn"))();
    cookie = {};
    __name(requireCookie, "requireCookie");
    cookieExports = requireCookie();
    __name(template, "template");
    DEFAULT_404_ROUTE = {
      component: DEFAULT_404_COMPONENT,
      generate: () => "",
      params: [],
      pattern: /\/404/,
      prerender: false,
      pathname: "/404",
      segments: [[{ content: "404", dynamic: false, spread: false }]],
      type: "page",
      route: "/404",
      fallbackRoutes: [],
      isIndex: false,
      origin: "internal"
    };
    __name(ensure404Route, "ensure404Route");
    __name(default404Page, "default404Page");
    default404Page.isAstroComponentFactory = true;
    default404Instance = {
      default: default404Page
    };
  }
});

// .wrangler/tmp/pages-9XcfGz/chunks/index_CdAnqvIQ.mjs
function is_primitive(thing) {
  return Object(thing) !== thing;
}
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function stringify$2(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing))
      return indexes.get(thing);
    if (thing === void 0)
      return UNDEFINED;
    if (Number.isNaN(thing))
      return NAN;
    if (thing === Infinity)
      return POSITIVE_INFINITY;
    if (thing === -Infinity)
      return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0)
      return NEGATIVE_ZERO;
    const index2 = p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array":
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0)
              str += ",";
            if (i in thing) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`
            );
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          const base64 = encode64(typedArray.buffer);
          str = '["' + type + '","' + base64 + '"]';
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key in thing) {
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key in thing) {
              if (started)
                str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  __name(flatten, "flatten");
  const index = flatten(value);
  if (index < 0)
    return `${index}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string")
    return stringify_string(thing);
  if (thing instanceof String)
    return stringify_string(thing.toString());
  if (thing === void 0)
    return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0)
    return NEGATIVE_ZERO.toString();
  if (type === "bigint")
    return `["BigInt","${thing}"]`;
  return String(thing);
}
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i) => {
    if (i === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return redirect.startsWith("http://") || redirect.startsWith("https://");
  } else {
    return redirect.destination.startsWith("http://") || redirect.destination.startsWith("https://");
  }
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
async function getRequestData(request) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const rawSlots = params.get("s");
      try {
        return {
          componentExport: params.get("e"),
          encryptedProps: params.get("p"),
          slots: JSON.parse(rawSlots)
        };
      } catch {
        return badRequest("Invalid slots format.");
      }
    }
    case "POST": {
      try {
        const raw = await request.text();
        const data = JSON.parse(raw);
        return data;
      } catch {
        return badRequest("Request format is invalid.");
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page3 = /* @__PURE__ */ __name(async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request);
    if (data instanceof Response) {
      return data;
    }
    const imp = manifest2.serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    const encryptedProps = data.encryptedProps;
    const propString = encryptedProps === "" ? "{}" : await decryptString(key, encryptedProps);
    const props = JSON.parse(propString);
    const componentModule = await imp();
    let Component = componentModule[data.componentExport];
    const slots = {};
    for (const prop in data.slots) {
      slots[prop] = createSlotValueFromString(data.slots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = /* @__PURE__ */ __name(function(...args) {
        return ServerIsland.apply(this, args);
      }, "Component");
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  }, "page");
  page3.isAstroComponentFactory = true;
  const instance = {
    default: page3,
    partial: true
  };
  return instance;
}
function matchRoute(pathname, manifest2) {
  const decodedPathname = decodeURI(pathname);
  return manifest2.routes.find((route) => {
    return route.pattern.test(decodedPathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(decodedPathname));
  });
}
function isRoute404(route) {
  return ROUTE404_RE.test(route);
}
function isRoute500(route) {
  return ROUTE500_RE.test(route);
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function isRequestServerIsland(request, base = "") {
  const url = new URL(request.url);
  const pathname = url.pathname.slice(base.length);
  return pathname.startsWith(SERVER_ISLAND_BASE_PREFIX);
}
function requestIs404Or500(request, base = "") {
  const url = new URL(request.url);
  const pathname = url.pathname.slice(base.length);
  return isRoute404(pathname) || isRoute500(pathname);
}
function isRouteExternalRedirect(route) {
  return !!(route.type === "redirect" && route.redirect && redirectIsExternal(route.redirect));
}
function requestHasLocale(locales) {
  return function(context) {
    return pathHasLocale(context.url.pathname, locales);
  };
}
function pathHasLocale(path, locales) {
  const segments = path.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  return locales.map((loopLocale) => {
    if (typeof loopLocale === "string") {
      return loopLocale;
    } else {
      return loopLocale.codes[0];
    }
  });
}
function redirectToDefaultLocale({
  trailingSlash,
  format,
  base,
  defaultLocale
}) {
  return function(context, statusCode) {
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return context.redirect(`${appendForwardSlash(joinPaths(base, defaultLocale))}`, statusCode);
    } else {
      return context.redirect(`${joinPaths(base, defaultLocale)}`, statusCode);
    }
  };
}
function notFound({ base, locales, fallback }) {
  return function(context, response) {
    if (response?.headers.get(REROUTE_DIRECTIVE_HEADER) === "no" && typeof fallback === "undefined") {
      return response;
    }
    const url = context.url;
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathHasLocale(url.pathname, locales))) {
      if (response) {
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        return new Response(response.body, {
          status: 404,
          headers: response.headers
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: {
            [REROUTE_DIRECTIVE_HEADER]: "no"
          }
        });
      }
    }
    return void 0;
  };
}
function redirectToFallback({
  fallback,
  locales,
  defaultLocale,
  strategy,
  base,
  fallbackType
}) {
  return async function(context, response) {
    if (response.status >= 300 && fallback) {
      const fallbackKeys = fallback ? Object.keys(fallback) : [];
      const segments = context.url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          if (context.url.pathname.includes(`${base}`)) {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, `/`);
          }
        } else {
          newPathname = context.url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        if (fallbackType === "rewrite") {
          return await context.rewrite(newPathname + context.url.search);
        } else {
          return context.redirect(newPathname + context.url.search);
        }
      }
    }
    return response;
  };
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = toCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentLocale.path;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales.map((locale) => {
        if (typeof locale === "string") {
          return locale;
        } else {
          return locale.codes.at(0);
        }
      });
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(loopLocale.path);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale))
          continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
function createRequest({
  url,
  headers,
  method = "GET",
  body = void 0,
  logger,
  isPrerendered = false,
  routePattern,
  init: init2
}) {
  const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(
    // Filter out HTTP/2 pseudo-headers. These are internally-generated headers added to all HTTP/2 requests with trusted metadata about the request.
    // Examples include `:method`, `:scheme`, `:authority`, and `:path`.
    // They are always prefixed with a colon to distinguish them from other headers, and it is an error to add the to a Headers object manually.
    // See https://httpwg.org/specs/rfc7540.html#HttpRequest
    Object.entries(headers).filter(([name]) => !name.startsWith(":"))
  );
  if (typeof url === "string")
    url = new URL(url);
  if (isPrerendered) {
    url.search = "";
  }
  const request = new Request(url, {
    method,
    headers: headersObj,
    // body is made available only if the request is for a page that will be on-demand rendered
    body: isPrerendered ? null : body,
    ...init2
  });
  if (isPrerendered) {
    let _headers = request.headers;
    const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
    Object.defineProperty(request, "headers", {
      ...headersDesc,
      get() {
        logger.warn(
          null,
          `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`
        );
        return _headers;
      },
      set(newHeaders) {
        _headers = newHeaders;
      }
    });
  }
  return request;
}
function findRouteToRewrite({
  payload,
  routes: routes2,
  request,
  trailingSlash,
  buildFormat,
  base
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(payload, new URL(request.url).origin);
  }
  let pathname = newUrl.pathname;
  if (base !== "/" && newUrl.pathname.startsWith(base)) {
    pathname = shouldAppendForwardSlash(trailingSlash, buildFormat) ? appendForwardSlash(newUrl.pathname) : removeTrailingForwardSlash(newUrl.pathname);
    pathname = pathname.slice(base.length);
  }
  const decodedPathname = decodeURI(pathname);
  let foundRoute;
  for (const route of routes2) {
    if (route.pattern.test(decodedPathname)) {
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname: decodedPathname
    };
  } else {
    const custom404 = routes2.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
  if (oldRequest.bodyUsed) {
    throw new AstroError(RewriteWithBodyUsed);
  }
  return createRequest({
    url: newUrl,
    method: oldRequest.method,
    body: oldRequest.body,
    isPrerendered,
    logger,
    headers: isPrerendered ? {} : oldRequest.headers,
    routePattern,
    init: {
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      // https://fetch.spec.whatwg.org/#dom-request-duplex
      // @ts-expect-error It isn't part of the types, but undici accepts it and it allows to carry over the body to a new request
      duplex: "half"
    }
  });
}
function setOriginPathname(request, pathname) {
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(pathname));
}
function getOriginPathname(request) {
  const origin = Reflect.get(request, originPathnameSymbol);
  if (origin) {
    return decodeURIComponent(origin);
  }
  return new URL(request.url).pathname;
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = /* @__PURE__ */ __name(async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  }, "next");
  let middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return route.generate(validatedParams);
}
function generatePaginateFunction(routeMatch, base) {
  return /* @__PURE__ */ __name(function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = addRouteBase(routeMatch.generate({ ...params }), base);
      const next = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(pageNum + 1) }), base);
      const prev = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        }),
        base
      );
      const first = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        }),
        base
      );
      const last = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(lastPage) }), base);
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  }, "paginateUtility");
}
function addRouteBase(route, base) {
  let routeWithBase = joinPaths(base, route);
  if (routeWithBase === "")
    routeWithBase = "/";
  return routeWithBase;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr,
  base
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route, base)
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike, base } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike,
    base
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length)
    return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch)
    return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function getFunctionExpression(slot) {
  if (!slot)
    return;
  const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false);
  if (expressions?.length !== 1)
    return;
  return expressions[0];
}
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function defineDriver(factory) {
  return factory;
}
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = /* @__PURE__ */ __name((key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  }, "getMount");
  const getMounts = /* @__PURE__ */ __name((base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  }, "getMounts");
  const onChange = /* @__PURE__ */ __name((event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  }, "onChange");
  const startWatch = /* @__PURE__ */ __name(async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  }, "startWatch");
  const stopWatch = /* @__PURE__ */ __name(async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  }, "stopWatch");
  const runBatch = /* @__PURE__ */ __name((items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = /* @__PURE__ */ __name((mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    }, "getBatch");
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r2) => r2.flat()
    );
  }, "runBatch");
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r2) => r2.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter(
        (key) => key.startsWith(base) && key[key.length - 1] !== "$"
      ) : allKeys.filter((key) => key[key.length - 1] !== "$");
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
function resolveSessionDriver(driver) {
  if (!driver) {
    return null;
  }
  if (driver === "fs") {
    return import.meta.resolve(builtinDrivers.fsLite);
  }
  if (driver in builtinDrivers) {
    return import.meta.resolve(builtinDrivers[driver]);
  }
  return driver;
}
function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request);
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request
              );
            }
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.cookies = new AstroCookies(newRequest);
            handleContext.params = getParams(routeData, pathname);
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
    __name(applyHandle, "applyHandle");
  });
}
function defineMiddleware(fn) {
  return fn;
}
var ACTION_API_CONTEXT_SYMBOL, DevalueError, object_proto_names, is_identifier, MANY_TRAILING_SLASHES, WITH_FILE_EXT, SERVER_ISLAND_ROUTE, SERVER_ISLAND_COMPONENT, SERVER_ISLAND_BASE_PREFIX, ROUTE404_RE, ROUTE500_RE, DELETED_EXPIRATION, DELETED_VALUE, responseSentSymbol2, AstroCookie, AstroCookies, astroCookiesSymbol, VALID_PARAM_TYPES, RouteCache, Slots, suspectProtoRx, suspectConstructorRx, JsonSigRx, BASE64_PREFIX, DRIVER_NAME, memory, builtinDrivers, PERSIST_SYMBOL, DEFAULT_COOKIE_NAME, VALID_COOKIE_REGEX, unflatten2, stringify, AstroSession, apiContextRoutesSymbol, RenderContext;
var init_index_CdAnqvIQ = __esm({
  ".wrangler/tmp/pages-9XcfGz/chunks/index_CdAnqvIQ.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_astro_designed_error_pages_ooUQbXF3();
    init_server_BXn8oDq3();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    ACTION_API_CONTEXT_SYMBOL = Symbol.for("astro.actionAPIContext");
    DevalueError = class extends Error {
      /**
       * @param {string} message
       * @param {string[]} keys
       */
      constructor(message, keys) {
        super(message);
        this.name = "DevalueError";
        this.path = keys.join("");
      }
    };
    __name(DevalueError, "DevalueError");
    __name(is_primitive, "is_primitive");
    object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
      Object.prototype
    ).sort().join("\0");
    __name(is_plain_object, "is_plain_object");
    __name(get_type, "get_type");
    __name(get_escaped_char, "get_escaped_char");
    __name(stringify_string, "stringify_string");
    __name(enumerable_symbols, "enumerable_symbols");
    is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    __name(stringify_key, "stringify_key");
    __name(stringify$2, "stringify$2");
    __name(stringify_primitive, "stringify_primitive");
    __name(appendForwardSlash, "appendForwardSlash");
    __name(prependForwardSlash, "prependForwardSlash");
    MANY_TRAILING_SLASHES = /\/{2,}$/g;
    __name(collapseDuplicateTrailingSlashes, "collapseDuplicateTrailingSlashes");
    __name(removeTrailingForwardSlash, "removeTrailingForwardSlash");
    __name(removeLeadingForwardSlash, "removeLeadingForwardSlash");
    __name(trimSlashes, "trimSlashes");
    __name(isString, "isString");
    __name(joinPaths, "joinPaths");
    __name(slash, "slash");
    __name(fileExtension, "fileExtension");
    WITH_FILE_EXT = /\/[^/]+\.\w+$/;
    __name(hasFileExtension, "hasFileExtension");
    __name(hasActionPayload, "hasActionPayload");
    __name(createGetActionResult, "createGetActionResult");
    __name(createCallAction, "createCallAction");
    __name(shouldAppendForwardSlash, "shouldAppendForwardSlash");
    __name(redirectIsExternal, "redirectIsExternal");
    __name(renderRedirect, "renderRedirect");
    __name(redirectRouteGenerate, "redirectRouteGenerate");
    SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
    SERVER_ISLAND_COMPONENT = "_server-islands.astro";
    SERVER_ISLAND_BASE_PREFIX = "_server-islands";
    __name(badRequest, "badRequest");
    __name(getRequestData, "getRequestData");
    __name(createEndpoint, "createEndpoint");
    __name(matchRoute, "matchRoute");
    ROUTE404_RE = /^\/404\/?$/;
    ROUTE500_RE = /^\/500\/?$/;
    __name(isRoute404, "isRoute404");
    __name(isRoute500, "isRoute500");
    __name(isRoute404or500, "isRoute404or500");
    __name(isRouteServerIsland, "isRouteServerIsland");
    __name(isRequestServerIsland, "isRequestServerIsland");
    __name(requestIs404Or500, "requestIs404Or500");
    __name(isRouteExternalRedirect, "isRouteExternalRedirect");
    __name(requestHasLocale, "requestHasLocale");
    __name(pathHasLocale, "pathHasLocale");
    __name(getPathByLocale, "getPathByLocale");
    __name(normalizeTheLocale, "normalizeTheLocale");
    __name(toCodes, "toCodes");
    __name(redirectToDefaultLocale, "redirectToDefaultLocale");
    __name(notFound, "notFound");
    __name(redirectToFallback, "redirectToFallback");
    __name(parseLocale, "parseLocale");
    __name(sortAndFilterLocales, "sortAndFilterLocales");
    __name(computePreferredLocale, "computePreferredLocale");
    __name(computePreferredLocaleList, "computePreferredLocaleList");
    __name(computeCurrentLocale, "computeCurrentLocale");
    DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
    DELETED_VALUE = "deleted";
    responseSentSymbol2 = Symbol.for("astro.responseSent");
    AstroCookie = class {
      constructor(value) {
        this.value = value;
      }
      json() {
        if (this.value === void 0) {
          throw new Error(`Cannot convert undefined to an object.`);
        }
        return JSON.parse(this.value);
      }
      number() {
        return Number(this.value);
      }
      boolean() {
        if (this.value === "false")
          return false;
        if (this.value === "0")
          return false;
        return Boolean(this.value);
      }
    };
    __name(AstroCookie, "AstroCookie");
    AstroCookies = class {
      #request;
      #requestValues;
      #outgoing;
      #consumed;
      constructor(request) {
        this.#request = request;
        this.#requestValues = null;
        this.#outgoing = null;
        this.#consumed = false;
      }
      /**
       * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
       * in a Set-Cookie header added to the response.
       * @param key The cookie to delete
       * @param options Options related to this deletion, such as the path of the cookie.
       */
      delete(key, options) {
        const {
          // @ts-expect-error
          maxAge: _ignoredMaxAge,
          // @ts-expect-error
          expires: _ignoredExpires,
          ...sanitizedOptions
        } = options || {};
        const serializeOptions = {
          expires: DELETED_EXPIRATION,
          ...sanitizedOptions
        };
        this.#ensureOutgoingMap().set(key, [
          DELETED_VALUE,
          cookieExports.serialize(key, DELETED_VALUE, serializeOptions),
          false
        ]);
      }
      /**
       * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
       * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
       * from that set call, overriding any values already part of the request.
       * @param key The cookie to get.
       * @returns An object containing the cookie value as well as convenience methods for converting its value.
       */
      get(key, options = void 0) {
        if (this.#outgoing?.has(key)) {
          let [serializedValue, , isSetValue] = this.#outgoing.get(key);
          if (isSetValue) {
            return new AstroCookie(serializedValue);
          } else {
            return void 0;
          }
        }
        const values = this.#ensureParsed(options);
        if (key in values) {
          const value = values[key];
          return new AstroCookie(value);
        }
      }
      /**
       * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
       * part of the initial request or set via Astro.cookies.set(key)
       * @param key The cookie to check for.
       * @returns
       */
      has(key, options = void 0) {
        if (this.#outgoing?.has(key)) {
          let [, , isSetValue] = this.#outgoing.get(key);
          return isSetValue;
        }
        const values = this.#ensureParsed(options);
        return !!values[key];
      }
      /**
       * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
       * an object it will be stringified via JSON.stringify(value). Additionally you
       * can provide options customizing how this cookie will be set, such as setting httpOnly
       * in order to prevent the cookie from being read in client-side JavaScript.
       * @param key The name of the cookie to set.
       * @param value A value, either a string or other primitive or an object.
       * @param options Options for the cookie, such as the path and security settings.
       */
      set(key, value, options) {
        if (this.#consumed) {
          const warning = new Error(
            "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
          );
          warning.name = "Warning";
          console.warn(warning);
        }
        let serializedValue;
        if (typeof value === "string") {
          serializedValue = value;
        } else {
          let toStringValue = value.toString();
          if (toStringValue === Object.prototype.toString.call(value)) {
            serializedValue = JSON.stringify(value);
          } else {
            serializedValue = toStringValue;
          }
        }
        const serializeOptions = {};
        if (options) {
          Object.assign(serializeOptions, options);
        }
        this.#ensureOutgoingMap().set(key, [
          serializedValue,
          cookieExports.serialize(key, serializedValue, serializeOptions),
          true
        ]);
        if (this.#request[responseSentSymbol2]) {
          throw new AstroError({
            ...ResponseSentError
          });
        }
      }
      /**
       * Merges a new AstroCookies instance into the current instance. Any new cookies
       * will be added to the current instance, overwriting any existing cookies with the same name.
       */
      merge(cookies) {
        const outgoing = cookies.#outgoing;
        if (outgoing) {
          for (const [key, value] of outgoing) {
            this.#ensureOutgoingMap().set(key, value);
          }
        }
      }
      /**
       * Astro.cookies.header() returns an iterator for the cookies that have previously
       * been set by either Astro.cookies.set() or Astro.cookies.delete().
       * This method is primarily used by adapters to set the header on outgoing responses.
       * @returns
       */
      *headers() {
        if (this.#outgoing == null)
          return;
        for (const [, value] of this.#outgoing) {
          yield value[1];
        }
      }
      /**
       * Behaves the same as AstroCookies.prototype.headers(),
       * but allows a warning when cookies are set after the instance is consumed.
       */
      static consume(cookies) {
        cookies.#consumed = true;
        return cookies.headers();
      }
      #ensureParsed(options = void 0) {
        if (!this.#requestValues) {
          this.#parse(options);
        }
        if (!this.#requestValues) {
          this.#requestValues = {};
        }
        return this.#requestValues;
      }
      #ensureOutgoingMap() {
        if (!this.#outgoing) {
          this.#outgoing = /* @__PURE__ */ new Map();
        }
        return this.#outgoing;
      }
      #parse(options = void 0) {
        const raw = this.#request.headers.get("cookie");
        if (!raw) {
          return;
        }
        this.#requestValues = cookieExports.parse(raw, options);
      }
    };
    __name(AstroCookies, "AstroCookies");
    astroCookiesSymbol = Symbol.for("astro.cookies");
    __name(attachCookiesToResponse, "attachCookiesToResponse");
    __name(getCookiesFromResponse, "getCookiesFromResponse");
    __name(getSetCookiesFromResponse, "getSetCookiesFromResponse");
    __name(createRequest, "createRequest");
    __name(findRouteToRewrite, "findRouteToRewrite");
    __name(copyRequest, "copyRequest");
    __name(setOriginPathname, "setOriginPathname");
    __name(getOriginPathname, "getOriginPathname");
    __name(callMiddleware, "callMiddleware");
    VALID_PARAM_TYPES = ["string", "number", "undefined"];
    __name(validateGetStaticPathsParameter, "validateGetStaticPathsParameter");
    __name(validateDynamicRouteModule, "validateDynamicRouteModule");
    __name(validateGetStaticPathsResult, "validateGetStaticPathsResult");
    __name(stringifyParams, "stringifyParams");
    __name(generatePaginateFunction, "generatePaginateFunction");
    __name(addRouteBase, "addRouteBase");
    __name(callGetStaticPaths, "callGetStaticPaths");
    RouteCache = class {
      logger;
      cache = {};
      runtimeMode;
      constructor(logger, runtimeMode = "production") {
        this.logger = logger;
        this.runtimeMode = runtimeMode;
      }
      /** Clear the cache. */
      clearAll() {
        this.cache = {};
      }
      set(route, entry) {
        const key = this.key(route);
        if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) {
          this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
        }
        this.cache[key] = entry;
      }
      get(route) {
        return this.cache[this.key(route)];
      }
      key(route) {
        return `${route.route}_${route.component}`;
      }
    };
    __name(RouteCache, "RouteCache");
    __name(findPathItemByKey, "findPathItemByKey");
    __name(routeIsRedirect, "routeIsRedirect");
    __name(routeIsFallback, "routeIsFallback");
    __name(getProps, "getProps");
    __name(getParams, "getParams");
    __name(validatePrerenderEndpointCollision, "validatePrerenderEndpointCollision");
    __name(getFunctionExpression, "getFunctionExpression");
    Slots = class {
      #result;
      #slots;
      #logger;
      constructor(result, slots, logger) {
        this.#result = result;
        this.#slots = slots;
        this.#logger = logger;
        if (slots) {
          for (const key of Object.keys(slots)) {
            if (this[key] !== void 0) {
              throw new AstroError({
                ...ReservedSlotName,
                message: ReservedSlotName.message(key)
              });
            }
            Object.defineProperty(this, key, {
              get() {
                return true;
              },
              enumerable: true
            });
          }
        }
      }
      has(name) {
        if (!this.#slots)
          return false;
        return Boolean(this.#slots[name]);
      }
      async render(name, args = []) {
        if (!this.#slots || !this.has(name))
          return;
        const result = this.#result;
        if (!Array.isArray(args)) {
          this.#logger.warn(
            null,
            `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
          );
        } else if (args.length > 0) {
          const slotValue = this.#slots[name];
          const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
          const expression = getFunctionExpression(component);
          if (expression) {
            const slot = /* @__PURE__ */ __name(async () => typeof expression === "function" ? expression(...args) : expression, "slot");
            return await renderSlotToString(result, slot).then((res) => {
              return res;
            });
          }
          if (typeof component === "function") {
            return await renderJSX(result, component(...args)).then(
              (res) => res != null ? String(res) : res
            );
          }
        }
        const content = await renderSlotToString(result, this.#slots[name]);
        const outHTML = chunkToString(result, content);
        return outHTML;
      }
    };
    __name(Slots, "Slots");
    suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    __name(jsonParseTransform, "jsonParseTransform");
    __name(warnKeyDropped, "warnKeyDropped");
    __name(destr, "destr");
    __name(wrapToPromise, "wrapToPromise");
    __name(asyncCall, "asyncCall");
    __name(isPrimitive, "isPrimitive");
    __name(isPureObject, "isPureObject");
    __name(stringify$1, "stringify$1");
    BASE64_PREFIX = "base64:";
    __name(serializeRaw, "serializeRaw");
    __name(deserializeRaw, "deserializeRaw");
    __name(base64Decode, "base64Decode");
    __name(base64Encode, "base64Encode");
    __name(normalizeKey, "normalizeKey");
    __name(joinKeys, "joinKeys");
    __name(normalizeBaseKey, "normalizeBaseKey");
    __name(defineDriver, "defineDriver");
    DRIVER_NAME = "memory";
    memory = defineDriver(() => {
      const data = /* @__PURE__ */ new Map();
      return {
        name: DRIVER_NAME,
        getInstance: () => data,
        hasItem(key) {
          return data.has(key);
        },
        getItem(key) {
          return data.get(key) ?? null;
        },
        getItemRaw(key) {
          return data.get(key) ?? null;
        },
        setItem(key, value) {
          data.set(key, value);
        },
        setItemRaw(key, value) {
          data.set(key, value);
        },
        removeItem(key) {
          data.delete(key);
        },
        getKeys() {
          return [...data.keys()];
        },
        clear() {
          data.clear();
        },
        dispose() {
          data.clear();
        }
      };
    });
    __name(createStorage, "createStorage");
    __name(watch, "watch");
    __name(dispose, "dispose");
    builtinDrivers = {
      "azure-app-configuration": "unstorage/drivers/azure-app-configuration",
      "azureAppConfiguration": "unstorage/drivers/azure-app-configuration",
      "azure-cosmos": "unstorage/drivers/azure-cosmos",
      "azureCosmos": "unstorage/drivers/azure-cosmos",
      "azure-key-vault": "unstorage/drivers/azure-key-vault",
      "azureKeyVault": "unstorage/drivers/azure-key-vault",
      "azure-storage-blob": "unstorage/drivers/azure-storage-blob",
      "azureStorageBlob": "unstorage/drivers/azure-storage-blob",
      "azure-storage-table": "unstorage/drivers/azure-storage-table",
      "azureStorageTable": "unstorage/drivers/azure-storage-table",
      "capacitor-preferences": "unstorage/drivers/capacitor-preferences",
      "capacitorPreferences": "unstorage/drivers/capacitor-preferences",
      "cloudflare-kv-binding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflareKVBinding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflare-kv-http": "unstorage/drivers/cloudflare-kv-http",
      "cloudflareKVHttp": "unstorage/drivers/cloudflare-kv-http",
      "cloudflare-r2-binding": "unstorage/drivers/cloudflare-r2-binding",
      "cloudflareR2Binding": "unstorage/drivers/cloudflare-r2-binding",
      "db0": "unstorage/drivers/db0",
      "deno-kv-node": "unstorage/drivers/deno-kv-node",
      "denoKVNode": "unstorage/drivers/deno-kv-node",
      "deno-kv": "unstorage/drivers/deno-kv",
      "denoKV": "unstorage/drivers/deno-kv",
      "fs-lite": "unstorage/drivers/fs-lite",
      "fsLite": "unstorage/drivers/fs-lite",
      "fs": "unstorage/drivers/fs",
      "github": "unstorage/drivers/github",
      "http": "unstorage/drivers/http",
      "indexedb": "unstorage/drivers/indexedb",
      "localstorage": "unstorage/drivers/localstorage",
      "lru-cache": "unstorage/drivers/lru-cache",
      "lruCache": "unstorage/drivers/lru-cache",
      "memory": "unstorage/drivers/memory",
      "mongodb": "unstorage/drivers/mongodb",
      "netlify-blobs": "unstorage/drivers/netlify-blobs",
      "netlifyBlobs": "unstorage/drivers/netlify-blobs",
      "null": "unstorage/drivers/null",
      "overlay": "unstorage/drivers/overlay",
      "planetscale": "unstorage/drivers/planetscale",
      "redis": "unstorage/drivers/redis",
      "s3": "unstorage/drivers/s3",
      "session-storage": "unstorage/drivers/session-storage",
      "sessionStorage": "unstorage/drivers/session-storage",
      "uploadthing": "unstorage/drivers/uploadthing",
      "upstash": "unstorage/drivers/upstash",
      "vercel-blob": "unstorage/drivers/vercel-blob",
      "vercelBlob": "unstorage/drivers/vercel-blob",
      "vercel-kv": "unstorage/drivers/vercel-kv",
      "vercelKV": "unstorage/drivers/vercel-kv"
    };
    PERSIST_SYMBOL = Symbol();
    DEFAULT_COOKIE_NAME = "astro-session";
    VALID_COOKIE_REGEX = /^[\w-]+$/;
    unflatten2 = /* @__PURE__ */ __name((parsed, _) => {
      return unflatten(parsed, {
        URL: (href) => new URL(href)
      });
    }, "unflatten");
    stringify = /* @__PURE__ */ __name((data, _) => {
      return stringify$2(data, {
        // Support URL objects
        URL: (val) => val instanceof URL && val.href
      });
    }, "stringify");
    AstroSession = class {
      // The cookies object.
      #cookies;
      // The session configuration.
      #config;
      // The cookie config
      #cookieConfig;
      // The cookie name
      #cookieName;
      // The unstorage object for the session driver.
      #storage;
      #data;
      // The session ID. A v4 UUID.
      #sessionID;
      // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
      #toDestroy = /* @__PURE__ */ new Set();
      // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
      #toDelete = /* @__PURE__ */ new Set();
      // Whether the session is dirty and needs to be saved.
      #dirty = false;
      // Whether the session cookie has been set.
      #cookieSet = false;
      // The local data is "partial" if it has not been loaded from storage yet and only
      // contains values that have been set or deleted in-memory locally.
      // We do this to avoid the need to block on loading data when it is only being set.
      // When we load the data from storage, we need to merge it with the local partial data,
      // preserving in-memory changes and deletions.
      #partial = true;
      constructor(cookies, {
        cookie: cookieConfig = DEFAULT_COOKIE_NAME,
        ...config
      }) {
        this.#cookies = cookies;
        let cookieConfigObject;
        if (typeof cookieConfig === "object") {
          const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
          this.#cookieName = name;
          cookieConfigObject = rest;
        } else {
          this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
        }
        this.#cookieConfig = {
          sameSite: "lax",
          secure: true,
          path: "/",
          ...cookieConfigObject,
          httpOnly: true
        };
        this.#config = config;
      }
      /**
       * Gets a session value. Returns `undefined` if the session or value does not exist.
       */
      async get(key) {
        return (await this.#ensureData()).get(key)?.data;
      }
      /**
       * Checks if a session value exists.
       */
      async has(key) {
        return (await this.#ensureData()).has(key);
      }
      /**
       * Gets all session values.
       */
      async keys() {
        return (await this.#ensureData()).keys();
      }
      /**
       * Gets all session values.
       */
      async values() {
        return [...(await this.#ensureData()).values()].map((entry) => entry.data);
      }
      /**
       * Gets all session entries.
       */
      async entries() {
        return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
      }
      /**
       * Deletes a session value.
       */
      delete(key) {
        this.#data?.delete(key);
        if (this.#partial) {
          this.#toDelete.add(key);
        }
        this.#dirty = true;
      }
      /**
       * Sets a session value. The session is created if it does not exist.
       */
      set(key, value, { ttl } = {}) {
        if (!key) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "The session key was not provided."
          });
        }
        let cloned;
        try {
          cloned = unflatten2(JSON.parse(stringify(value)));
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageSaveError,
              message: `The session data for ${key} could not be serialized.`,
              hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
            },
            { cause: err }
          );
        }
        if (!this.#cookieSet) {
          this.#setCookie();
          this.#cookieSet = true;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const lifetime = ttl ?? this.#config.ttl;
        const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
        this.#data.set(key, {
          data: cloned,
          expires
        });
        this.#dirty = true;
      }
      /**
       * Destroys the session, clearing the cookie and storage if it exists.
       */
      destroy() {
        this.#destroySafe();
      }
      /**
       * Regenerates the session, creating a new session ID. The existing session data is preserved.
       */
      async regenerate() {
        let data = /* @__PURE__ */ new Map();
        try {
          data = await this.#ensureData();
        } catch (err) {
          console.error("Failed to load session data during regeneration:", err);
        }
        const oldSessionId = this.#sessionID;
        this.#sessionID = crypto.randomUUID();
        this.#data = data;
        await this.#setCookie();
        if (oldSessionId && this.#storage) {
          this.#storage.removeItem(oldSessionId).catch((err) => {
            console.error("Failed to remove old session data:", err);
          });
        }
      }
      // Persists the session data to storage.
      // This is called automatically at the end of the request.
      // Uses a symbol to prevent users from calling it directly.
      async [PERSIST_SYMBOL]() {
        if (!this.#dirty && !this.#toDestroy.size) {
          return;
        }
        const storage = await this.#ensureStorage();
        if (this.#dirty && this.#data) {
          const data = await this.#ensureData();
          this.#toDelete.forEach((key2) => data.delete(key2));
          const key = this.#ensureSessionID();
          let serialized;
          try {
            serialized = stringify(data);
          } catch (err) {
            throw new AstroError(
              {
                ...SessionStorageSaveError,
                message: SessionStorageSaveError.message(
                  "The session data could not be serialized.",
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          await storage.setItem(key, serialized);
          this.#dirty = false;
        }
        if (this.#toDestroy.size > 0) {
          const cleanupPromises = [...this.#toDestroy].map(
            (sessionId) => storage.removeItem(sessionId).catch((err) => {
              console.error(`Failed to clean up session ${sessionId}:`, err);
            })
          );
          await Promise.all(cleanupPromises);
          this.#toDestroy.clear();
        }
      }
      get sessionID() {
        return this.#sessionID;
      }
      /**
       * Sets the session cookie.
       */
      async #setCookie() {
        if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
          });
        }
        const value = this.#ensureSessionID();
        this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
      }
      /**
       * Attempts to load the session data from storage, or creates a new data object if none exists.
       * If there is existing partial data, it will be merged into the new data object.
       */
      async #ensureData() {
        const storage = await this.#ensureStorage();
        if (this.#data && !this.#partial) {
          return this.#data;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const raw = await storage.get(this.#ensureSessionID());
        if (!raw) {
          return this.#data;
        }
        try {
          const storedMap = unflatten2(raw);
          if (!(storedMap instanceof Map)) {
            await this.#destroySafe();
            throw new AstroError({
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data was an invalid type.",
                this.#config.driver
              )
            });
          }
          const now = Date.now();
          for (const [key, value] of storedMap) {
            const expired = typeof value.expires === "number" && value.expires < now;
            if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
              this.#data.set(key, value);
            }
          }
          this.#partial = false;
          return this.#data;
        } catch (err) {
          await this.#destroySafe();
          if (err instanceof AstroError) {
            throw err;
          }
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data could not be parsed.",
                this.#config.driver
              )
            },
            { cause: err }
          );
        }
      }
      /**
       * Safely destroys the session, clearing the cookie and storage if it exists.
       */
      #destroySafe() {
        if (this.#sessionID) {
          this.#toDestroy.add(this.#sessionID);
        }
        if (this.#cookieName) {
          this.#cookies.delete(this.#cookieName, this.#cookieConfig);
        }
        this.#sessionID = void 0;
        this.#data = void 0;
        this.#dirty = true;
      }
      /**
       * Returns the session ID, generating a new one if it does not exist.
       */
      #ensureSessionID() {
        this.#sessionID ??= this.#cookies.get(this.#cookieName)?.value ?? crypto.randomUUID();
        return this.#sessionID;
      }
      /**
       * Ensures the storage is initialized.
       * This is called automatically when a storage operation is needed.
       */
      async #ensureStorage() {
        if (this.#storage) {
          return this.#storage;
        }
        if (this.#config.driver === "test") {
          this.#storage = this.#config.options.mockStorage;
          return this.#storage;
        }
        if (this.#config.driver === "fs" || this.#config.driver === "fsLite" || this.#config.driver === "fs-lite") {
          this.#config.options ??= {};
          this.#config.driver = "fs-lite";
          this.#config.options.base ??= ".astro/session";
        }
        if (!this.#config?.driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "No driver was defined in the session configuration and the adapter did not provide a default driver."
            )
          });
        }
        let driver = null;
        const driverPackage = await resolveSessionDriver(this.#config.driver);
        try {
          if (this.#config.driverModule) {
            driver = (await this.#config.driverModule()).default;
          } else if (driverPackage) {
            driver = (await import(driverPackage)).default;
          }
        } catch (err) {
          if (err.code === "ERR_MODULE_NOT_FOUND") {
            throw new AstroError(
              {
                ...SessionStorageInitError,
                message: SessionStorageInitError.message(
                  err.message.includes(`Cannot find package '${driverPackage}'`) ? "The driver module could not be found." : err.message,
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          throw err;
        }
        if (!driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "The module did not export a driver.",
              this.#config.driver
            )
          });
        }
        try {
          this.#storage = createStorage({
            driver: driver(this.#config.options)
          });
          return this.#storage;
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message("Unknown error", this.#config.driver)
            },
            { cause: err }
          );
        }
      }
    };
    __name(AstroSession, "AstroSession");
    __name(resolveSessionDriver, "resolveSessionDriver");
    apiContextRoutesSymbol = Symbol.for("context.routes");
    RenderContext = class {
      constructor(pipeline, locals, middleware, pathname, request, routeData, status, clientAddress, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = new URL(request.url), props = {}, partial = void 0, session = pipeline.manifest.sessionConfig ? new AstroSession(cookies, pipeline.manifest.sessionConfig) : void 0) {
        this.pipeline = pipeline;
        this.locals = locals;
        this.middleware = middleware;
        this.pathname = pathname;
        this.request = request;
        this.routeData = routeData;
        this.status = status;
        this.clientAddress = clientAddress;
        this.cookies = cookies;
        this.params = params;
        this.url = url;
        this.props = props;
        this.partial = partial;
        this.session = session;
      }
      /**
       * A flag that tells the render content if the rewriting was triggered
       */
      isRewriting = false;
      /**
       * A safety net in case of loops
       */
      counter = 0;
      static async create({
        locals = {},
        middleware,
        pathname,
        pipeline,
        request,
        routeData,
        clientAddress,
        status = 200,
        props,
        partial = void 0
      }) {
        const pipelineMiddleware = await pipeline.getMiddleware();
        setOriginPathname(request, pathname);
        return new RenderContext(
          pipeline,
          locals,
          sequence(...pipeline.internalMiddleware, middleware ?? pipelineMiddleware),
          pathname,
          request,
          routeData,
          status,
          clientAddress,
          void 0,
          void 0,
          void 0,
          props,
          partial
        );
      }
      /**
       * The main function of the RenderContext.
       *
       * Use this function to render any route known to Astro.
       * It attempts to render a route. A route can be a:
       *
       * - page
       * - redirect
       * - endpoint
       * - fallback
       */
      async render(componentInstance, slots = {}) {
        const { cookies, middleware, pipeline } = this;
        const { logger, serverLike, streaming, manifest: manifest2 } = pipeline;
        const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
          mod: componentInstance,
          routeData: this.routeData,
          routeCache: this.pipeline.routeCache,
          pathname: this.pathname,
          logger,
          serverLike,
          base: manifest2.base
        });
        const apiContext = this.createAPIContext(props);
        this.counter++;
        if (this.counter === 4) {
          return new Response("Loop Detected", {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
            status: 508,
            statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
          });
        }
        const lastNext = /* @__PURE__ */ __name(async (ctx, payload) => {
          if (payload) {
            pipeline.logger.debug("router", "Called rewriting to:", payload);
            const {
              routeData,
              componentInstance: newComponent,
              pathname,
              newUrl
            } = await pipeline.tryRewrite(payload, this.request);
            if (this.pipeline.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            this.routeData = routeData;
            componentInstance = newComponent;
            if (payload instanceof Request) {
              this.request = payload;
            } else {
              this.request = copyRequest(
                newUrl,
                this.request,
                // need to send the flag of the previous routeData
                routeData.prerender,
                this.pipeline.logger,
                this.routeData.route
              );
            }
            this.isRewriting = true;
            this.url = new URL(this.request.url);
            this.cookies = new AstroCookies(this.request);
            this.params = getParams(routeData, pathname);
            this.pathname = pathname;
            this.status = 200;
          }
          let response2;
          switch (this.routeData.type) {
            case "endpoint": {
              response2 = await renderEndpoint(
                componentInstance,
                ctx,
                this.routeData.prerender,
                logger
              );
              break;
            }
            case "redirect":
              return renderRedirect(this);
            case "page": {
              const result = await this.createResult(componentInstance);
              try {
                response2 = await renderPage(
                  result,
                  componentInstance?.default,
                  props,
                  slots,
                  streaming,
                  this.routeData
                );
              } catch (e) {
                result.cancelled = true;
                throw e;
              }
              response2.headers.set(ROUTE_TYPE_HEADER, "page");
              if (this.routeData.route === "/404" || this.routeData.route === "/500") {
                response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
              }
              if (this.isRewriting) {
                response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
              }
              break;
            }
            case "fallback": {
              return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
            }
          }
          const responseCookies = getCookiesFromResponse(response2);
          if (responseCookies) {
            cookies.merge(responseCookies);
          }
          return response2;
        }, "lastNext");
        if (isRouteExternalRedirect(this.routeData)) {
          return renderRedirect(this);
        }
        const response = await callMiddleware(middleware, apiContext, lastNext);
        if (response.headers.get(ROUTE_TYPE_HEADER)) {
          response.headers.delete(ROUTE_TYPE_HEADER);
        }
        attachCookiesToResponse(response, cookies);
        return response;
      }
      createAPIContext(props) {
        const context = this.createActionAPIContext();
        const redirect = /* @__PURE__ */ __name((path, status = 302) => new Response(null, { status, headers: { Location: path } }), "redirect");
        Reflect.set(context, apiContextRoutesSymbol, this.pipeline);
        return Object.assign(context, {
          props,
          redirect,
          getActionResult: createGetActionResult(context.locals),
          callAction: createCallAction(context)
        });
      }
      async #executeRewrite(reroutePayload) {
        this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
        const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
          reroutePayload,
          this.request
        );
        if (this.pipeline.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
          throw new AstroError({
            ...ForbiddenRewrite,
            message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
            hint: ForbiddenRewrite.hint(routeData.component)
          });
        }
        this.routeData = routeData;
        if (reroutePayload instanceof Request) {
          this.request = reroutePayload;
        } else {
          this.request = copyRequest(
            newUrl,
            this.request,
            // need to send the flag of the previous routeData
            routeData.prerender,
            this.pipeline.logger,
            this.routeData.route
          );
        }
        this.url = new URL(this.request.url);
        this.cookies = new AstroCookies(this.request);
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.isRewriting = true;
        this.status = 200;
        return await this.render(componentInstance);
      }
      createActionAPIContext() {
        const renderContext = this;
        const { cookies, params, pipeline, url, session } = this;
        const generator = `Astro v${ASTRO_VERSION}`;
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        return {
          cookies,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          generator,
          get locals() {
            return renderContext.locals;
          },
          set locals(_) {
            throw new AstroError(LocalsReassigned);
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          rewrite,
          request: this.request,
          site: pipeline.site,
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          },
          session
        };
      }
      async createResult(mod) {
        const { cookies, pathname, pipeline, routeData, status } = this;
        const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
        const { links, scripts, styles } = await pipeline.headElements(routeData);
        const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
        const headers = new Headers({ "Content-Type": "text/html" });
        const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
        const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
        const response = {
          status: actionResult?.error ? actionResult?.error.status : status,
          statusText: actionResult?.error ? actionResult?.error.type : "OK",
          get headers() {
            return headers;
          },
          // Disallow `Astro.response.headers = new Headers`
          set headers(_) {
            throw new AstroError(AstroResponseHeadersReassigned);
          }
        };
        const result = {
          base: manifest2.base,
          cancelled: false,
          clientDirectives,
          inlinedScripts,
          componentMetadata,
          compressHTML,
          cookies,
          /** This function returns the `Astro` faux-global */
          createAstro: (astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots),
          links,
          params: this.params,
          partial,
          pathname,
          renderers: renderers2,
          resolve,
          response,
          request: this.request,
          scripts,
          styles,
          actionResult,
          serverIslandNameMap: manifest2.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
          key: manifest2.key,
          trailingSlash: manifest2.trailingSlash,
          _metadata: {
            hasHydrationScript: false,
            rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
            hasRenderedHead: false,
            renderedScripts: /* @__PURE__ */ new Set(),
            hasDirectives: /* @__PURE__ */ new Set(),
            headInTree: false,
            extraHead: [],
            propagators: /* @__PURE__ */ new Set()
          }
        };
        return result;
      }
      #astroPagePartial;
      /**
       * The Astro global is sourced in 3 different phases:
       * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
       * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
       * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
       *
       * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
       */
      createAstro(result, astroStaticPartial, props, slotValues) {
        let astroPagePartial;
        if (this.isRewriting) {
          astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(
            result,
            astroStaticPartial
          );
        } else {
          astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(
            result,
            astroStaticPartial
          );
        }
        const astroComponentPartial = { props, self: null };
        const Astro = Object.assign(
          Object.create(astroPagePartial),
          astroComponentPartial
        );
        let _slots;
        Object.defineProperty(Astro, "slots", {
          get: () => {
            if (!_slots) {
              _slots = new Slots(
                result,
                slotValues,
                this.pipeline.logger
              );
            }
            return _slots;
          }
        });
        return Astro;
      }
      createAstroPagePartial(result, astroStaticPartial) {
        const renderContext = this;
        const { cookies, locals, params, pipeline, url, session } = this;
        const { response } = result;
        const redirect = /* @__PURE__ */ __name((path, status = 302) => {
          if (this.request[responseSentSymbol]) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          return new Response(null, { status, headers: { Location: path } });
        }, "redirect");
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        return {
          generator: astroStaticPartial.generator,
          glob: astroStaticPartial.glob,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          cookies,
          session,
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          locals,
          redirect,
          rewrite,
          request: this.request,
          response,
          site: pipeline.site,
          getActionResult: createGetActionResult(locals),
          get callAction() {
            return createCallAction(this);
          },
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          }
        };
      }
      getClientAddress() {
        const { pipeline, request, routeData, clientAddress } = this;
        if (routeData.prerender) {
          throw new AstroError(PrerenderClientAddressNotAvailable);
        }
        if (clientAddress) {
          return clientAddress;
        }
        if (clientAddressSymbol in request) {
          return Reflect.get(request, clientAddressSymbol);
        }
        if (pipeline.adapterName) {
          throw new AstroError({
            ...ClientAddressNotAvailable,
            message: ClientAddressNotAvailable.message(pipeline.adapterName)
          });
        }
        throw new AstroError(StaticClientAddressNotAvailable);
      }
      /**
       * API Context may be created multiple times per request, i18n data needs to be computed only once.
       * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
       */
      #currentLocale;
      computeCurrentLocale() {
        const {
          url,
          pipeline: { i18n },
          routeData
        } = this;
        if (!i18n)
          return;
        const { defaultLocale, locales, strategy } = i18n;
        const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
        if (this.#currentLocale) {
          return this.#currentLocale;
        }
        let computedLocale;
        if (isRouteServerIsland(routeData)) {
          let referer = this.request.headers.get("referer");
          if (referer) {
            if (URL.canParse(referer)) {
              referer = new URL(referer).pathname;
            }
            computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
          }
        } else {
          let pathname = routeData.pathname;
          if (!routeData.pattern.test(url.pathname)) {
            for (const fallbackRoute of routeData.fallbackRoutes) {
              if (fallbackRoute.pattern.test(url.pathname)) {
                pathname = fallbackRoute.pathname;
                break;
              }
            }
          }
          pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname;
          computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
        }
        this.#currentLocale = computedLocale ?? fallbackTo;
        return this.#currentLocale;
      }
      #preferredLocale;
      computePreferredLocale() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n)
          return;
        return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
      }
      #preferredLocaleList;
      computePreferredLocaleList() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n)
          return;
        return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
      }
    };
    __name(RenderContext, "RenderContext");
    __name(sequence, "sequence");
    __name(defineMiddleware, "defineMiddleware");
  }
});

// .wrangler/tmp/pages-9XcfGz/pages/_image.astro.mjs
var image_astro_exports = {};
__export(image_astro_exports, {
  page: () => page,
  renderers: () => renderers
});
var prerender, GET, _page, page;
var init_image_astro = __esm({
  ".wrangler/tmp/pages-9XcfGz/pages/_image.astro.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_astro_renderers_O4SP2Us9();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    prerender = false;
    GET = /* @__PURE__ */ __name((ctx) => {
      const href = ctx.url.searchParams.get("href");
      if (!href) {
        return new Response("Missing 'href' query parameter", {
          status: 400,
          statusText: "Missing 'href' query parameter"
        });
      }
      return fetch(new URL(href, ctx.url.origin));
    }, "GET");
    _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      GET,
      prerender
    }, Symbol.toStringTag, { value: "Module" }));
    page = /* @__PURE__ */ __name(() => _page, "page");
  }
});

// .wrangler/tmp/pages-9XcfGz/pages/_---path_.astro.mjs
var path_astro_exports = {};
__export(path_astro_exports, {
  page: () => page2,
  renderers: () => renderers
});
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min)
    return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = requireReact(), k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  __name(q, "q");
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime)
    return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
  }
  return jsxRuntime.exports;
}
function VerifyNumber(x) {
  if (!Number.isFinite(x)) {
    console.trace();
    throw `Value is not a finite number: ${x}`;
  }
  return x;
}
function Frac(x) {
  return x - Math.floor(x);
}
function GetStar(body) {
  const index = StarList.indexOf(body);
  return index >= 0 ? StarTable[index] : null;
}
function UserDefinedStar(body) {
  const star = GetStar(body);
  return star && star.dist > 0 ? star : null;
}
function DeltaT_EspenakMeeus(ut) {
  var u, u2, u3, u4, u5, u6, u7;
  const y = 2e3 + (ut - 14) / DAYS_PER_TROPICAL_YEAR;
  if (y < -500) {
    u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }
  if (y < 500) {
    u = y / 100;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    return 10583.6 - 1014.41 * u + 33.78311 * u2 - 5.952053 * u3 - 0.1798452 * u4 + 0.022174192 * u5 + 0.0090316521 * u6;
  }
  if (y < 1600) {
    u = (y - 1e3) / 100;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    return 1574.2 - 556.01 * u + 71.23472 * u2 + 0.319781 * u3 - 0.8503463 * u4 - 5050998e-9 * u5 + 0.0083572073 * u6;
  }
  if (y < 1700) {
    u = y - 1600;
    u2 = u * u;
    u3 = u * u2;
    return 120 - 0.9808 * u - 0.01532 * u2 + u3 / 7129;
  }
  if (y < 1800) {
    u = y - 1700;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    return 8.83 + 0.1603 * u - 59285e-7 * u2 + 13336e-8 * u3 - u4 / 1174e3;
  }
  if (y < 1860) {
    u = y - 1800;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    u7 = u3 * u4;
    return 13.72 - 0.332447 * u + 68612e-7 * u2 + 41116e-7 * u3 - 37436e-8 * u4 + 121272e-10 * u5 - 1699e-10 * u6 + 875e-12 * u7;
  }
  if (y < 1900) {
    u = y - 1860;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    return 7.62 + 0.5737 * u - 0.251754 * u2 + 0.01680668 * u3 - 4473624e-10 * u4 + u5 / 233174;
  }
  if (y < 1920) {
    u = y - 1900;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    return -2.79 + 1.494119 * u - 0.0598939 * u2 + 61966e-7 * u3 - 197e-6 * u4;
  }
  if (y < 1941) {
    u = y - 1920;
    u2 = u * u;
    u3 = u * u2;
    return 21.2 + 0.84493 * u - 0.0761 * u2 + 20936e-7 * u3;
  }
  if (y < 1961) {
    u = y - 1950;
    u2 = u * u;
    u3 = u * u2;
    return 29.07 + 0.407 * u - u2 / 233 + u3 / 2547;
  }
  if (y < 1986) {
    u = y - 1975;
    u2 = u * u;
    u3 = u * u2;
    return 45.45 + 1.067 * u - u2 / 260 - u3 / 718;
  }
  if (y < 2005) {
    u = y - 2e3;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    return 63.86 + 0.3345 * u - 0.060374 * u2 + 17275e-7 * u3 + 651814e-9 * u4 + 2373599e-11 * u5;
  }
  if (y < 2050) {
    u = y - 2e3;
    return 62.92 + 0.32217 * u + 5589e-6 * u * u;
  }
  if (y < 2150) {
    u = (y - 1820) / 100;
    return -20 + 32 * u * u - 0.5628 * (2150 - y);
  }
  u = (y - 1820) / 100;
  return -20 + 32 * u * u;
}
function TerrestrialTime(ut) {
  return ut + DeltaT(ut) / 86400;
}
function InterpolateTime(time1, time2, fraction) {
  return new AstroTime(time1.ut + fraction * (time2.ut - time1.ut));
}
function MakeTime(date) {
  if (date instanceof AstroTime) {
    return date;
  }
  return new AstroTime(date);
}
function iau2000b(time) {
  function mod(x) {
    return x % ASEC360 * ASEC2RAD;
  }
  __name(mod, "mod");
  const t = time.tt / 36525;
  const elp = mod(128710479305e-5 + t * 1295965810481e-4);
  const f = mod(335779.526232 + t * 17395272628478e-4);
  const d = mod(107226070369e-5 + t * 1602961601209e-3);
  const om = mod(450160.398036 - t * 69628905431e-4);
  let sarg = Math.sin(om);
  let carg = Math.cos(om);
  let dp = (-172064161 - 174666 * t) * sarg + 33386 * carg;
  let de = (92052331 + 9086 * t) * carg + 15377 * sarg;
  let arg = 2 * (f - d + om);
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (-13170906 - 1675 * t) * sarg - 13696 * carg;
  de += (5730336 - 3015 * t) * carg - 4587 * sarg;
  arg = 2 * (f + om);
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (-2276413 - 234 * t) * sarg + 2796 * carg;
  de += (978459 - 485 * t) * carg + 1374 * sarg;
  arg = 2 * om;
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (2074554 + 207 * t) * sarg - 698 * carg;
  de += (-897492 + 470 * t) * carg - 291 * sarg;
  sarg = Math.sin(elp);
  carg = Math.cos(elp);
  dp += (1475877 - 3633 * t) * sarg + 11817 * carg;
  de += (73871 - 184 * t) * carg - 1924 * sarg;
  return {
    dpsi: -135e-6 + dp * 1e-7,
    deps: 388e-6 + de * 1e-7
  };
}
function mean_obliq(time) {
  var t = time.tt / 36525;
  var asec = ((((-434e-10 * t - 576e-9) * t + 20034e-7) * t - 1831e-7) * t - 46.836769) * t + 84381.406;
  return asec / 3600;
}
function e_tilt(time) {
  if (!cache_e_tilt || Math.abs(cache_e_tilt.tt - time.tt) > 1e-6) {
    const nut = iau2000b(time);
    const mean_ob = mean_obliq(time);
    const true_ob = mean_ob + nut.deps / 3600;
    cache_e_tilt = {
      tt: time.tt,
      dpsi: nut.dpsi,
      deps: nut.deps,
      ee: nut.dpsi * Math.cos(mean_ob * DEG2RAD) / 15,
      mobl: mean_ob,
      tobl: true_ob
    };
  }
  return cache_e_tilt;
}
function obl_ecl2equ_vec(oblDegrees, pos) {
  const obl = oblDegrees * DEG2RAD;
  const cos_obl = Math.cos(obl);
  const sin_obl = Math.sin(obl);
  return [
    pos[0],
    pos[1] * cos_obl - pos[2] * sin_obl,
    pos[1] * sin_obl + pos[2] * cos_obl
  ];
}
function ecl2equ_vec(time, pos) {
  return obl_ecl2equ_vec(mean_obliq(time), pos);
}
function CalcMoon(time) {
  const T = time.tt / 36525;
  function DeclareArray1(xmin, xmax) {
    const array = [];
    let i;
    for (i = 0; i <= xmax - xmin; ++i) {
      array.push(0);
    }
    return { min: xmin, array };
  }
  __name(DeclareArray1, "DeclareArray1");
  function DeclareArray2(xmin, xmax, ymin, ymax) {
    const array = [];
    for (let i = 0; i <= xmax - xmin; ++i) {
      array.push(DeclareArray1(ymin, ymax));
    }
    return { min: xmin, array };
  }
  __name(DeclareArray2, "DeclareArray2");
  function ArrayGet2(a, x, y) {
    const m = a.array[x - a.min];
    return m.array[y - m.min];
  }
  __name(ArrayGet2, "ArrayGet2");
  function ArraySet2(a, x, y, v) {
    const m = a.array[x - a.min];
    m.array[y - m.min] = v;
  }
  __name(ArraySet2, "ArraySet2");
  let S, MAX, ARG, FAC, I, J, T2, DGAM, DLAM, N, GAM1C, SINPI, L0, L, LS, F, D, DL0, DL, DLS, DF, DD, DS;
  let coArray = DeclareArray2(-6, 6, 1, 4);
  let siArray = DeclareArray2(-6, 6, 1, 4);
  function CO(x, y) {
    return ArrayGet2(coArray, x, y);
  }
  __name(CO, "CO");
  function SI(x, y) {
    return ArrayGet2(siArray, x, y);
  }
  __name(SI, "SI");
  function SetCO(x, y, v) {
    return ArraySet2(coArray, x, y, v);
  }
  __name(SetCO, "SetCO");
  function SetSI(x, y, v) {
    return ArraySet2(siArray, x, y, v);
  }
  __name(SetSI, "SetSI");
  function AddThe(c1, s1, c2, s2, func) {
    func(c1 * c2 - s1 * s2, s1 * c2 + c1 * s2);
  }
  __name(AddThe, "AddThe");
  function Sine(phi) {
    return Math.sin(PI2 * phi);
  }
  __name(Sine, "Sine");
  T2 = T * T;
  DLAM = 0;
  DS = 0;
  GAM1C = 0;
  SINPI = 3422.7;
  var S1 = Sine(0.19833 + 0.05611 * T);
  var S2 = Sine(0.27869 + 0.04508 * T);
  var S3 = Sine(0.16827 - 0.36903 * T);
  var S4 = Sine(0.34734 - 5.37261 * T);
  var S5 = Sine(0.10498 - 5.37899 * T);
  var S6 = Sine(0.42681 - 0.41855 * T);
  var S7 = Sine(0.14943 - 5.37511 * T);
  DL0 = 0.84 * S1 + 0.31 * S2 + 14.27 * S3 + 7.26 * S4 + 0.28 * S5 + 0.24 * S6;
  DL = 2.94 * S1 + 0.31 * S2 + 14.27 * S3 + 9.34 * S4 + 1.12 * S5 + 0.83 * S6;
  DLS = -6.4 * S1 - 1.89 * S6;
  DF = 0.21 * S1 + 0.31 * S2 + 14.27 * S3 - 88.7 * S4 - 15.3 * S5 + 0.24 * S6 - 1.86 * S7;
  DD = DL0 - DLS;
  DGAM = -3332e-9 * Sine(0.59734 - 5.37261 * T) - 539e-9 * Sine(0.35498 - 5.37899 * T) - 64e-9 * Sine(0.39943 - 5.37511 * T);
  L0 = PI2 * Frac(0.60643382 + 1336.85522467 * T - 313e-8 * T2) + DL0 / ARC;
  L = PI2 * Frac(0.37489701 + 1325.55240982 * T + 2565e-8 * T2) + DL / ARC;
  LS = PI2 * Frac(0.99312619 + 99.99735956 * T - 44e-8 * T2) + DLS / ARC;
  F = PI2 * Frac(0.25909118 + 1342.2278298 * T - 892e-8 * T2) + DF / ARC;
  D = PI2 * Frac(0.82736186 + 1236.85308708 * T - 397e-8 * T2) + DD / ARC;
  for (I = 1; I <= 4; ++I) {
    switch (I) {
      case 1:
        ARG = L;
        MAX = 4;
        FAC = 1.000002208;
        break;
      case 2:
        ARG = LS;
        MAX = 3;
        FAC = 0.997504612 - 2495388e-9 * T;
        break;
      case 3:
        ARG = F;
        MAX = 4;
        FAC = 1.000002708 + 139.978 * DGAM;
        break;
      case 4:
        ARG = D;
        MAX = 6;
        FAC = 1;
        break;
      default:
        throw `Internal error: I = ${I}`;
    }
    SetCO(0, I, 1);
    SetCO(1, I, Math.cos(ARG) * FAC);
    SetSI(0, I, 0);
    SetSI(1, I, Math.sin(ARG) * FAC);
    for (J = 2; J <= MAX; ++J) {
      AddThe(CO(J - 1, I), SI(J - 1, I), CO(1, I), SI(1, I), (c, s) => (SetCO(J, I, c), SetSI(J, I, s)));
    }
    for (J = 1; J <= MAX; ++J) {
      SetCO(-J, I, CO(J, I));
      SetSI(-J, I, -SI(J, I));
    }
  }
  function Term(p, q, r2, s) {
    var result = { x: 1, y: 0 };
    var I2 = [0, p, q, r2, s];
    for (var k = 1; k <= 4; ++k)
      if (I2[k] !== 0)
        AddThe(result.x, result.y, CO(I2[k], k), SI(I2[k], k), (c, s2) => (result.x = c, result.y = s2));
    return result;
  }
  __name(Term, "Term");
  function AddSol(coeffl, coeffs, coeffg, coeffp, p, q, r2, s) {
    var result = Term(p, q, r2, s);
    DLAM += coeffl * result.y;
    DS += coeffs * result.y;
    GAM1C += coeffg * result.x;
    SINPI += coeffp * result.x;
  }
  __name(AddSol, "AddSol");
  AddSol(13.902, 14.06, -1e-3, 0.2607, 0, 0, 0, 4);
  AddSol(0.403, -4.01, 0.394, 23e-4, 0, 0, 0, 3);
  AddSol(2369.912, 2373.36, 0.601, 28.2333, 0, 0, 0, 2);
  AddSol(-125.154, -112.79, -0.725, -0.9781, 0, 0, 0, 1);
  AddSol(1.979, 6.98, -0.445, 0.0433, 1, 0, 0, 4);
  AddSol(191.953, 192.72, 0.029, 3.0861, 1, 0, 0, 2);
  AddSol(-8.466, -13.51, 0.455, -0.1093, 1, 0, 0, 1);
  AddSol(22639.5, 22609.07, 0.079, 186.5398, 1, 0, 0, 0);
  AddSol(18.609, 3.59, -0.094, 0.0118, 1, 0, 0, -1);
  AddSol(-4586.465, -4578.13, -0.077, 34.3117, 1, 0, 0, -2);
  AddSol(3.215, 5.44, 0.192, -0.0386, 1, 0, 0, -3);
  AddSol(-38.428, -38.64, 1e-3, 0.6008, 1, 0, 0, -4);
  AddSol(-0.393, -1.43, -0.092, 86e-4, 1, 0, 0, -6);
  AddSol(-0.289, -1.59, 0.123, -53e-4, 0, 1, 0, 4);
  AddSol(-24.42, -25.1, 0.04, -0.3, 0, 1, 0, 2);
  AddSol(18.023, 17.93, 7e-3, 0.1494, 0, 1, 0, 1);
  AddSol(-668.146, -126.98, -1.302, -0.3997, 0, 1, 0, 0);
  AddSol(0.56, 0.32, -1e-3, -37e-4, 0, 1, 0, -1);
  AddSol(-165.145, -165.06, 0.054, 1.9178, 0, 1, 0, -2);
  AddSol(-1.877, -6.46, -0.416, 0.0339, 0, 1, 0, -4);
  AddSol(0.213, 1.02, -0.074, 54e-4, 2, 0, 0, 4);
  AddSol(14.387, 14.78, -0.017, 0.2833, 2, 0, 0, 2);
  AddSol(-0.586, -1.2, 0.054, -0.01, 2, 0, 0, 1);
  AddSol(769.016, 767.96, 0.107, 10.1657, 2, 0, 0, 0);
  AddSol(1.75, 2.01, -0.018, 0.0155, 2, 0, 0, -1);
  AddSol(-211.656, -152.53, 5.679, -0.3039, 2, 0, 0, -2);
  AddSol(1.225, 0.91, -0.03, -88e-4, 2, 0, 0, -3);
  AddSol(-30.773, -34.07, -0.308, 0.3722, 2, 0, 0, -4);
  AddSol(-0.57, -1.4, -0.074, 0.0109, 2, 0, 0, -6);
  AddSol(-2.921, -11.75, 0.787, -0.0484, 1, 1, 0, 2);
  AddSol(1.267, 1.52, -0.022, 0.0164, 1, 1, 0, 1);
  AddSol(-109.673, -115.18, 0.461, -0.949, 1, 1, 0, 0);
  AddSol(-205.962, -182.36, 2.056, 1.4437, 1, 1, 0, -2);
  AddSol(0.233, 0.36, 0.012, -25e-4, 1, 1, 0, -3);
  AddSol(-4.391, -9.66, -0.471, 0.0673, 1, 1, 0, -4);
  AddSol(0.283, 1.53, -0.111, 6e-3, 1, -1, 0, 4);
  AddSol(14.577, 31.7, -1.54, 0.2302, 1, -1, 0, 2);
  AddSol(147.687, 138.76, 0.679, 1.1528, 1, -1, 0, 0);
  AddSol(-1.089, 0.55, 0.021, 0, 1, -1, 0, -1);
  AddSol(28.475, 23.59, -0.443, -0.2257, 1, -1, 0, -2);
  AddSol(-0.276, -0.38, -6e-3, -36e-4, 1, -1, 0, -3);
  AddSol(0.636, 2.27, 0.146, -0.0102, 1, -1, 0, -4);
  AddSol(-0.189, -1.68, 0.131, -28e-4, 0, 2, 0, 2);
  AddSol(-7.486, -0.66, -0.037, -86e-4, 0, 2, 0, 0);
  AddSol(-8.096, -16.35, -0.74, 0.0918, 0, 2, 0, -2);
  AddSol(-5.741, -0.04, 0, -9e-4, 0, 0, 2, 2);
  AddSol(0.255, 0, 0, 0, 0, 0, 2, 1);
  AddSol(-411.608, -0.2, 0, -0.0124, 0, 0, 2, 0);
  AddSol(0.584, 0.84, 0, 71e-4, 0, 0, 2, -1);
  AddSol(-55.173, -52.14, 0, -0.1052, 0, 0, 2, -2);
  AddSol(0.254, 0.25, 0, -17e-4, 0, 0, 2, -3);
  AddSol(0.025, -1.67, 0, 31e-4, 0, 0, 2, -4);
  AddSol(1.06, 2.96, -0.166, 0.0243, 3, 0, 0, 2);
  AddSol(36.124, 50.64, -1.3, 0.6215, 3, 0, 0, 0);
  AddSol(-13.193, -16.4, 0.258, -0.1187, 3, 0, 0, -2);
  AddSol(-1.187, -0.74, 0.042, 74e-4, 3, 0, 0, -4);
  AddSol(-0.293, -0.31, -2e-3, 46e-4, 3, 0, 0, -6);
  AddSol(-0.29, -1.45, 0.116, -51e-4, 2, 1, 0, 2);
  AddSol(-7.649, -10.56, 0.259, -0.1038, 2, 1, 0, 0);
  AddSol(-8.627, -7.59, 0.078, -0.0192, 2, 1, 0, -2);
  AddSol(-2.74, -2.54, 0.022, 0.0324, 2, 1, 0, -4);
  AddSol(1.181, 3.32, -0.212, 0.0213, 2, -1, 0, 2);
  AddSol(9.703, 11.67, -0.151, 0.1268, 2, -1, 0, 0);
  AddSol(-0.352, -0.37, 1e-3, -28e-4, 2, -1, 0, -1);
  AddSol(-2.494, -1.17, -3e-3, -17e-4, 2, -1, 0, -2);
  AddSol(0.36, 0.2, -0.012, -43e-4, 2, -1, 0, -4);
  AddSol(-1.167, -1.25, 8e-3, -0.0106, 1, 2, 0, 0);
  AddSol(-7.412, -6.12, 0.117, 0.0484, 1, 2, 0, -2);
  AddSol(-0.311, -0.65, -0.032, 44e-4, 1, 2, 0, -4);
  AddSol(0.757, 1.82, -0.105, 0.0112, 1, -2, 0, 2);
  AddSol(2.58, 2.32, 0.027, 0.0196, 1, -2, 0, 0);
  AddSol(2.533, 2.4, -0.014, -0.0212, 1, -2, 0, -2);
  AddSol(-0.344, -0.57, -0.025, 36e-4, 0, 3, 0, -2);
  AddSol(-0.992, -0.02, 0, 0, 1, 0, 2, 2);
  AddSol(-45.099, -0.02, 0, -1e-3, 1, 0, 2, 0);
  AddSol(-0.179, -9.52, 0, -0.0833, 1, 0, 2, -2);
  AddSol(-0.301, -0.33, 0, 14e-4, 1, 0, 2, -4);
  AddSol(-6.382, -3.37, 0, -0.0481, 1, 0, -2, 2);
  AddSol(39.528, 85.13, 0, -0.7136, 1, 0, -2, 0);
  AddSol(9.366, 0.71, 0, -0.0112, 1, 0, -2, -2);
  AddSol(0.202, 0.02, 0, 0, 1, 0, -2, -4);
  AddSol(0.415, 0.1, 0, 13e-4, 0, 1, 2, 0);
  AddSol(-2.152, -2.26, 0, -66e-4, 0, 1, 2, -2);
  AddSol(-1.44, -1.3, 0, 14e-4, 0, 1, -2, 2);
  AddSol(0.384, -0.04, 0, 0, 0, 1, -2, -2);
  AddSol(1.938, 3.6, -0.145, 0.0401, 4, 0, 0, 0);
  AddSol(-0.952, -1.58, 0.052, -0.013, 4, 0, 0, -2);
  AddSol(-0.551, -0.94, 0.032, -97e-4, 3, 1, 0, 0);
  AddSol(-0.482, -0.57, 5e-3, -45e-4, 3, 1, 0, -2);
  AddSol(0.681, 0.96, -0.026, 0.0115, 3, -1, 0, 0);
  AddSol(-0.297, -0.27, 2e-3, -9e-4, 2, 2, 0, -2);
  AddSol(0.254, 0.21, -3e-3, 0, 2, -2, 0, -2);
  AddSol(-0.25, -0.22, 4e-3, 14e-4, 1, 3, 0, -2);
  AddSol(-3.996, 0, 0, 4e-4, 2, 0, 2, 0);
  AddSol(0.557, -0.75, 0, -9e-3, 2, 0, 2, -2);
  AddSol(-0.459, -0.38, 0, -53e-4, 2, 0, -2, 2);
  AddSol(-1.298, 0.74, 0, 4e-4, 2, 0, -2, 0);
  AddSol(0.538, 1.14, 0, -0.0141, 2, 0, -2, -2);
  AddSol(0.263, 0.02, 0, 0, 1, 1, 2, 0);
  AddSol(0.426, 0.07, 0, -6e-4, 1, 1, -2, -2);
  AddSol(-0.304, 0.03, 0, 3e-4, 1, -1, 2, 0);
  AddSol(-0.372, -0.19, 0, -27e-4, 1, -1, -2, 2);
  AddSol(0.418, 0, 0, 0, 0, 0, 4, 0);
  AddSol(-0.33, -0.04, 0, 0, 3, 0, 2, 0);
  function ADDN(coeffn, p, q, r2, s) {
    return coeffn * Term(p, q, r2, s).y;
  }
  __name(ADDN, "ADDN");
  N = 0;
  N += ADDN(-526.069, 0, 0, 1, -2);
  N += ADDN(-3.352, 0, 0, 1, -4);
  N += ADDN(44.297, 1, 0, 1, -2);
  N += ADDN(-6, 1, 0, 1, -4);
  N += ADDN(20.599, -1, 0, 1, 0);
  N += ADDN(-30.598, -1, 0, 1, -2);
  N += ADDN(-24.649, -2, 0, 1, 0);
  N += ADDN(-2, -2, 0, 1, -2);
  N += ADDN(-22.571, 0, 1, 1, -2);
  N += ADDN(10.985, 0, -1, 1, -2);
  DLAM += 0.82 * Sine(0.7736 - 62.5512 * T) + 0.31 * Sine(0.0466 - 125.1025 * T) + 0.35 * Sine(0.5785 - 25.1042 * T) + 0.66 * Sine(0.4591 + 1335.8075 * T) + 0.64 * Sine(0.313 - 91.568 * T) + 1.14 * Sine(0.148 + 1331.2898 * T) + 0.21 * Sine(0.5918 + 1056.5859 * T) + 0.44 * Sine(0.5784 + 1322.8595 * T) + 0.24 * Sine(0.2275 - 5.7374 * T) + 0.28 * Sine(0.2965 + 2.6929 * T) + 0.33 * Sine(0.3132 + 6.3368 * T);
  S = F + DS / ARC;
  let lat_seconds = (1.000002708 + 139.978 * DGAM) * (18518.511 + 1.189 + GAM1C) * Math.sin(S) - 6.24 * Math.sin(3 * S) + N;
  return {
    geo_eclip_lon: PI2 * Frac((L0 + DLAM / ARC) / PI2),
    geo_eclip_lat: Math.PI / (180 * 3600) * lat_seconds,
    distance_au: ARC * EARTH_EQUATORIAL_RADIUS_AU / (0.999953253 * SINPI)
  };
}
function rotate(rot, vec) {
  return [
    rot.rot[0][0] * vec[0] + rot.rot[1][0] * vec[1] + rot.rot[2][0] * vec[2],
    rot.rot[0][1] * vec[0] + rot.rot[1][1] * vec[1] + rot.rot[2][1] * vec[2],
    rot.rot[0][2] * vec[0] + rot.rot[1][2] * vec[1] + rot.rot[2][2] * vec[2]
  ];
}
function precession(pos, time, dir) {
  const r2 = precession_rot(time, dir);
  return rotate(r2, pos);
}
function precession_rot(time, dir) {
  const t = time.tt / 36525;
  let eps0 = 84381.406;
  let psia = ((((-951e-10 * t + 132851e-9) * t - 114045e-8) * t - 1.0790069) * t + 5038.481507) * t;
  let omegaa = ((((3337e-10 * t - 467e-9) * t - 772503e-8) * t + 0.0512623) * t - 0.025754) * t + eps0;
  let chia = ((((-56e-9 * t + 170663e-9) * t - 121197e-8) * t - 2.3814292) * t + 10.556403) * t;
  eps0 *= ASEC2RAD;
  psia *= ASEC2RAD;
  omegaa *= ASEC2RAD;
  chia *= ASEC2RAD;
  const sa = Math.sin(eps0);
  const ca2 = Math.cos(eps0);
  const sb = Math.sin(-psia);
  const cb = Math.cos(-psia);
  const sc = Math.sin(-omegaa);
  const cc = Math.cos(-omegaa);
  const sd = Math.sin(chia);
  const cd = Math.cos(chia);
  const xx = cd * cb - sb * sd * cc;
  const yx = cd * sb * ca2 + sd * cc * cb * ca2 - sa * sd * sc;
  const zx = cd * sb * sa + sd * cc * cb * sa + ca2 * sd * sc;
  const xy = -sd * cb - sb * cd * cc;
  const yy = -sd * sb * ca2 + cd * cc * cb * ca2 - sa * cd * sc;
  const zy = -sd * sb * sa + cd * cc * cb * sa + ca2 * cd * sc;
  const xz = sb * sc;
  const yz = -sc * cb * ca2 - sa * cc;
  const zz = -sc * cb * sa + cc * ca2;
  if (dir === PrecessDirection.Into2000) {
    return new RotationMatrix([
      [xx, yx, zx],
      [xy, yy, zy],
      [xz, yz, zz]
    ]);
  }
  if (dir === PrecessDirection.From2000) {
    return new RotationMatrix([
      [xx, xy, xz],
      [yx, yy, yz],
      [zx, zy, zz]
    ]);
  }
  throw "Invalid precess direction";
}
function nutation(pos, time, dir) {
  const r2 = nutation_rot(time, dir);
  return rotate(r2, pos);
}
function nutation_rot(time, dir) {
  const tilt = e_tilt(time);
  const oblm = tilt.mobl * DEG2RAD;
  const oblt = tilt.tobl * DEG2RAD;
  const psi = tilt.dpsi * ASEC2RAD;
  const cobm = Math.cos(oblm);
  const sobm = Math.sin(oblm);
  const cobt = Math.cos(oblt);
  const sobt = Math.sin(oblt);
  const cpsi = Math.cos(psi);
  const spsi = Math.sin(psi);
  const xx = cpsi;
  const yx = -spsi * cobm;
  const zx = -spsi * sobm;
  const xy = spsi * cobt;
  const yy = cpsi * cobm * cobt + sobm * sobt;
  const zy = cpsi * sobm * cobt - cobm * sobt;
  const xz = spsi * sobt;
  const yz = cpsi * cobm * sobt - sobm * cobt;
  const zz = cpsi * sobm * sobt + cobm * cobt;
  if (dir === PrecessDirection.From2000) {
    return new RotationMatrix([
      [xx, xy, xz],
      [yx, yy, yz],
      [zx, zy, zz]
    ]);
  }
  if (dir === PrecessDirection.Into2000) {
    return new RotationMatrix([
      [xx, yx, zx],
      [xy, yy, zy],
      [xz, yz, zz]
    ]);
  }
  throw "Invalid precess direction";
}
function gyration(pos, time, dir) {
  return dir === PrecessDirection.Into2000 ? precession(nutation(pos, time, dir), time, dir) : nutation(precession(pos, time, dir), time, dir);
}
function SunPosition(date) {
  const time = MakeTime(date).AddDays(-1 / C_AUDAY);
  const earth2000 = CalcVsop(vsop.Earth, time);
  const sun2000 = [-earth2000.x, -earth2000.y, -earth2000.z];
  const [gx, gy, gz] = gyration(sun2000, time, PrecessDirection.From2000);
  const true_obliq = DEG2RAD * e_tilt(time).tobl;
  const cos_ob = Math.cos(true_obliq);
  const sin_ob = Math.sin(true_obliq);
  const vec = new Vector(gx, gy, gz, time);
  const sun_ecliptic = RotateEquatorialToEcliptic(vec, cos_ob, sin_ob);
  return sun_ecliptic;
}
function RotateEquatorialToEcliptic(equ, cos_ob, sin_ob) {
  const ex = equ.x;
  const ey = equ.y * cos_ob + equ.z * sin_ob;
  const ez = -equ.y * sin_ob + equ.z * cos_ob;
  const xyproj = Math.hypot(ex, ey);
  let elon = 0;
  if (xyproj > 0) {
    elon = RAD2DEG * Math.atan2(ey, ex);
    if (elon < 0)
      elon += 360;
  }
  let elat = RAD2DEG * Math.atan2(ez, xyproj);
  let ecl = new Vector(ex, ey, ez, equ.t);
  return new EclipticCoordinates(ecl, elat, elon);
}
function Ecliptic(eqj) {
  const et = e_tilt(eqj.t);
  const eqj_pos = [eqj.x, eqj.y, eqj.z];
  const mean_pos = precession(eqj_pos, eqj.t, PrecessDirection.From2000);
  const [x, y, z] = nutation(mean_pos, eqj.t, PrecessDirection.From2000);
  const eqd = new Vector(x, y, z, eqj.t);
  const tobl = et.tobl * DEG2RAD;
  return RotateEquatorialToEcliptic(eqd, Math.cos(tobl), Math.sin(tobl));
}
function GeoMoon(date) {
  const time = MakeTime(date);
  const moon = CalcMoon(time);
  const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
  const gepos = [
    dist_cos_lat * Math.cos(moon.geo_eclip_lon),
    dist_cos_lat * Math.sin(moon.geo_eclip_lon),
    moon.distance_au * Math.sin(moon.geo_eclip_lat)
  ];
  const mpos1 = ecl2equ_vec(time, gepos);
  const mpos2 = precession(mpos1, time, PrecessDirection.Into2000);
  return new Vector(mpos2[0], mpos2[1], mpos2[2], time);
}
function VsopFormula(formula, t, clamp_angle) {
  let tpower = 1;
  let coord = 0;
  for (let series of formula) {
    let sum = 0;
    for (let [ampl, phas, freq] of series)
      sum += ampl * Math.cos(phas + t * freq);
    let incr = tpower * sum;
    if (clamp_angle)
      incr %= PI2;
    coord += incr;
    tpower *= t;
  }
  return coord;
}
function VsopDeriv(formula, t) {
  let tpower = 1;
  let dpower = 0;
  let deriv = 0;
  let s = 0;
  for (let series of formula) {
    let sin_sum = 0;
    let cos_sum = 0;
    for (let [ampl, phas, freq] of series) {
      let angle = phas + t * freq;
      sin_sum += ampl * freq * Math.sin(angle);
      if (s > 0)
        cos_sum += ampl * Math.cos(angle);
    }
    deriv += s * dpower * cos_sum - tpower * sin_sum;
    dpower = tpower;
    tpower *= t;
    ++s;
  }
  return deriv;
}
function VsopRotate(eclip) {
  return new TerseVector(eclip[0] + 44036e-11 * eclip[1] - 190919e-12 * eclip[2], -479966e-12 * eclip[0] + 0.917482137087 * eclip[1] - 0.397776982902 * eclip[2], 0.397776982902 * eclip[1] + 0.917482137087 * eclip[2]);
}
function VsopSphereToRect(lon, lat, radius) {
  const r_coslat = radius * Math.cos(lat);
  const coslon = Math.cos(lon);
  const sinlon = Math.sin(lon);
  return [
    r_coslat * coslon,
    r_coslat * sinlon,
    radius * Math.sin(lat)
  ];
}
function CalcVsop(model, time) {
  const t = time.tt / DAYS_PER_MILLENNIUM;
  const lon = VsopFormula(model[LON_INDEX], t, true);
  const lat = VsopFormula(model[LAT_INDEX], t, false);
  const rad = VsopFormula(model[RAD_INDEX], t, false);
  const eclip = VsopSphereToRect(lon, lat, rad);
  return VsopRotate(eclip).ToAstroVector(time);
}
function CalcVsopPosVel(model, tt) {
  const t = tt / DAYS_PER_MILLENNIUM;
  const lon = VsopFormula(model[LON_INDEX], t, true);
  const lat = VsopFormula(model[LAT_INDEX], t, false);
  const rad = VsopFormula(model[RAD_INDEX], t, false);
  const dlon_dt = VsopDeriv(model[LON_INDEX], t);
  const dlat_dt = VsopDeriv(model[LAT_INDEX], t);
  const drad_dt = VsopDeriv(model[RAD_INDEX], t);
  const coslon = Math.cos(lon);
  const sinlon = Math.sin(lon);
  const coslat = Math.cos(lat);
  const sinlat = Math.sin(lat);
  const vx = +(drad_dt * coslat * coslon) - rad * sinlat * coslon * dlat_dt - rad * coslat * sinlon * dlon_dt;
  const vy = +(drad_dt * coslat * sinlon) - rad * sinlat * sinlon * dlat_dt + rad * coslat * coslon * dlon_dt;
  const vz = +(drad_dt * sinlat) + rad * coslat * dlat_dt;
  const eclip_pos = VsopSphereToRect(lon, lat, rad);
  const eclip_vel = [
    vx / DAYS_PER_MILLENNIUM,
    vy / DAYS_PER_MILLENNIUM,
    vz / DAYS_PER_MILLENNIUM
  ];
  const equ_pos = VsopRotate(eclip_pos);
  const equ_vel = VsopRotate(eclip_vel);
  return new body_state_t(tt, equ_pos, equ_vel);
}
function AdjustBarycenter(ssb, time, body, pmass) {
  const shift = pmass / (pmass + SUN_GM);
  const planet = CalcVsop(vsop[body], time);
  ssb.x += shift * planet.x;
  ssb.y += shift * planet.y;
  ssb.z += shift * planet.z;
}
function CalcSolarSystemBarycenter(time) {
  const ssb = new Vector(0, 0, 0, time);
  AdjustBarycenter(ssb, time, Body.Jupiter, JUPITER_GM);
  AdjustBarycenter(ssb, time, Body.Saturn, SATURN_GM);
  AdjustBarycenter(ssb, time, Body.Uranus, URANUS_GM);
  AdjustBarycenter(ssb, time, Body.Neptune, NEPTUNE_GM);
  return ssb;
}
function BodyStateFromTable(entry) {
  let [tt, [rx, ry, rz], [vx, vy, vz]] = entry;
  return new body_state_t(tt, new TerseVector(rx, ry, rz), new TerseVector(vx, vy, vz));
}
function AdjustBarycenterPosVel(ssb, tt, body, planet_gm) {
  const shift = planet_gm / (planet_gm + SUN_GM);
  const planet = CalcVsopPosVel(vsop[body], tt);
  ssb.r.incr(planet.r.mul(shift));
  ssb.v.incr(planet.v.mul(shift));
  return planet;
}
function AccelerationIncrement(small_pos, gm, major_pos) {
  const delta = major_pos.sub(small_pos);
  const r2 = delta.quadrature();
  return delta.mul(gm / (r2 * Math.sqrt(r2)));
}
function UpdatePosition(dt, r2, v, a) {
  return new TerseVector(r2.x + dt * (v.x + dt * a.x / 2), r2.y + dt * (v.y + dt * a.y / 2), r2.z + dt * (v.z + dt * a.z / 2));
}
function UpdateVelocity(dt, v, a) {
  return new TerseVector(v.x + dt * a.x, v.y + dt * a.y, v.z + dt * a.z);
}
function GravSim(tt2, calc1) {
  const dt = tt2 - calc1.tt;
  const bary2 = new major_bodies_t(tt2);
  const approx_pos = UpdatePosition(dt, calc1.r, calc1.v, calc1.a);
  const mean_acc = bary2.Acceleration(approx_pos).mean(calc1.a);
  const pos = UpdatePosition(dt, calc1.r, calc1.v, mean_acc);
  const vel = calc1.v.add(mean_acc.mul(dt));
  const acc = bary2.Acceleration(pos);
  const grav = new body_grav_calc_t(tt2, pos, vel, acc);
  return new grav_sim_t(bary2, grav);
}
function ClampIndex(frac, nsteps) {
  const index = Math.floor(frac);
  if (index < 0)
    return 0;
  if (index >= nsteps)
    return nsteps - 1;
  return index;
}
function GravFromState(entry) {
  const state = BodyStateFromTable(entry);
  const bary = new major_bodies_t(state.tt);
  const r2 = state.r.add(bary.Sun.r);
  const v = state.v.add(bary.Sun.v);
  const a = bary.Acceleration(r2);
  const grav = new body_grav_calc_t(state.tt, r2, v, a);
  return new grav_sim_t(bary, grav);
}
function GetSegment(cache, tt) {
  const t0 = PlutoStateTable[0][0];
  if (tt < t0 || tt > PlutoStateTable[PLUTO_NUM_STATES - 1][0]) {
    return null;
  }
  const seg_index = ClampIndex((tt - t0) / PLUTO_TIME_STEP, PLUTO_NUM_STATES - 1);
  if (!cache[seg_index]) {
    const seg = cache[seg_index] = [];
    seg[0] = GravFromState(PlutoStateTable[seg_index]).grav;
    seg[PLUTO_NSTEPS - 1] = GravFromState(PlutoStateTable[seg_index + 1]).grav;
    let i;
    let step_tt = seg[0].tt;
    for (i = 1; i < PLUTO_NSTEPS - 1; ++i)
      seg[i] = GravSim(step_tt += PLUTO_DT, seg[i - 1]).grav;
    step_tt = seg[PLUTO_NSTEPS - 1].tt;
    var reverse = [];
    reverse[PLUTO_NSTEPS - 1] = seg[PLUTO_NSTEPS - 1];
    for (i = PLUTO_NSTEPS - 2; i > 0; --i)
      reverse[i] = GravSim(step_tt -= PLUTO_DT, reverse[i + 1]).grav;
    for (i = PLUTO_NSTEPS - 2; i > 0; --i) {
      const ramp = i / (PLUTO_NSTEPS - 1);
      seg[i].r = seg[i].r.mul(1 - ramp).add(reverse[i].r.mul(ramp));
      seg[i].v = seg[i].v.mul(1 - ramp).add(reverse[i].v.mul(ramp));
      seg[i].a = seg[i].a.mul(1 - ramp).add(reverse[i].a.mul(ramp));
    }
  }
  return cache[seg_index];
}
function CalcPlutoOneWay(entry, target_tt, dt) {
  let sim = GravFromState(entry);
  const n = Math.ceil((target_tt - sim.grav.tt) / dt);
  for (let i = 0; i < n; ++i)
    sim = GravSim(i + 1 === n ? target_tt : sim.grav.tt + dt, sim.grav);
  return sim;
}
function CalcPluto(time, helio) {
  let r2, v, bary;
  const seg = GetSegment(pluto_cache, time.tt);
  if (!seg) {
    let sim;
    if (time.tt < PlutoStateTable[0][0])
      sim = CalcPlutoOneWay(PlutoStateTable[0], time.tt, -146);
    else
      sim = CalcPlutoOneWay(PlutoStateTable[PLUTO_NUM_STATES - 1], time.tt, 146);
    r2 = sim.grav.r;
    v = sim.grav.v;
    bary = sim.bary;
  } else {
    const left = ClampIndex((time.tt - seg[0].tt) / PLUTO_DT, PLUTO_NSTEPS - 1);
    const s1 = seg[left];
    const s2 = seg[left + 1];
    const acc = s1.a.mean(s2.a);
    const ra = UpdatePosition(time.tt - s1.tt, s1.r, s1.v, acc);
    const va = UpdateVelocity(time.tt - s1.tt, s1.v, acc);
    const rb = UpdatePosition(time.tt - s2.tt, s2.r, s2.v, acc);
    const vb = UpdateVelocity(time.tt - s2.tt, s2.v, acc);
    const ramp = (time.tt - s1.tt) / PLUTO_DT;
    r2 = ra.mul(1 - ramp).add(rb.mul(ramp));
    v = va.mul(1 - ramp).add(vb.mul(ramp));
  }
  {
    if (!bary)
      bary = new major_bodies_t(time.tt);
    r2 = r2.sub(bary.Sun.r);
    v = v.sub(bary.Sun.v);
  }
  return new StateVector(r2.x, r2.y, r2.z, v.x, v.y, v.z, time);
}
function HelioVector(body, date) {
  var time = MakeTime(date);
  if (body in vsop)
    return CalcVsop(vsop[body], time);
  if (body === Body.Pluto) {
    const p = CalcPluto(time);
    return new Vector(p.x, p.y, p.z, time);
  }
  if (body === Body.Sun)
    return new Vector(0, 0, 0, time);
  if (body === Body.Moon) {
    var e = CalcVsop(vsop.Earth, time);
    var m = GeoMoon(time);
    return new Vector(e.x + m.x, e.y + m.y, e.z + m.z, time);
  }
  if (body === Body.EMB) {
    const e2 = CalcVsop(vsop.Earth, time);
    const m2 = GeoMoon(time);
    const denom = 1 + EARTH_MOON_MASS_RATIO;
    return new Vector(e2.x + m2.x / denom, e2.y + m2.y / denom, e2.z + m2.z / denom, time);
  }
  if (body === Body.SSB)
    return CalcSolarSystemBarycenter(time);
  const star = UserDefinedStar(body);
  if (star) {
    const sphere = new Spherical(star.dec, 15 * star.ra, star.dist);
    return VectorFromSphere(sphere, time);
  }
  throw `HelioVector: Unknown body "${body}"`;
}
function CorrectLightTravel(func, time) {
  let ltime = time;
  let dt = 0;
  for (let iter = 0; iter < 10; ++iter) {
    const pos = func(ltime);
    const lt = pos.Length() / C_AUDAY;
    if (lt > 1)
      throw `Object is too distant for light-travel solver.`;
    const ltime2 = time.AddDays(-lt);
    dt = Math.abs(ltime2.tt - ltime.tt);
    if (dt < 1e-9)
      return pos;
    ltime = ltime2;
  }
  throw `Light-travel time solver did not converge: dt = ${dt}`;
}
function BackdatePosition(date, observerBody, targetBody, aberration) {
  const time = MakeTime(date);
  if (UserDefinedStar(targetBody)) {
    const tvec = HelioVector(targetBody, time);
    const ovec = HelioVector(observerBody, time);
    return new Vector(tvec.x - ovec.x, tvec.y - ovec.y, tvec.z - ovec.z, time);
  }
  let observerPos;
  {
    observerPos = HelioVector(observerBody, time);
  }
  const bpos = new BodyPosition(observerBody, targetBody, aberration, observerPos);
  return CorrectLightTravel((t) => bpos.Position(t), time);
}
function GeoVector(body, date, aberration) {
  const time = MakeTime(date);
  switch (body) {
    case Body.Earth:
      return new Vector(0, 0, 0, time);
    case Body.Moon:
      return GeoMoon(time);
    default:
      const vec = BackdatePosition(time, Body.Earth, body, aberration);
      vec.t = time;
      return vec;
  }
}
function QuadInterp(tm, dt, fa, fm, fb) {
  let Q = (fb + fa) / 2 - fm;
  let R = (fb - fa) / 2;
  let S = fm;
  let x;
  if (Q == 0) {
    if (R == 0) {
      return null;
    }
    x = -S / R;
    if (x < -1 || x > 1)
      return null;
  } else {
    let u = R * R - 4 * Q * S;
    if (u <= 0)
      return null;
    let ru = Math.sqrt(u);
    let x1 = (-R + ru) / (2 * Q);
    let x2 = (-R - ru) / (2 * Q);
    if (-1 <= x1 && x1 <= 1) {
      if (-1 <= x2 && x2 <= 1)
        return null;
      x = x1;
    } else if (-1 <= x2 && x2 <= 1) {
      x = x2;
    } else {
      return null;
    }
  }
  let t = tm + x * dt;
  let df_dt = (2 * Q * x + R) / dt;
  return { t, df_dt };
}
function Search(f, t1, t2, options) {
  const dt_tolerance_seconds = VerifyNumber(options && options.dt_tolerance_seconds || 1);
  const dt_days = Math.abs(dt_tolerance_seconds / SECONDS_PER_DAY);
  let f1 = options && options.init_f1 || f(t1);
  let f2 = options && options.init_f2 || f(t2);
  let fmid = NaN;
  let iter = 0;
  let iter_limit = options && options.iter_limit || 20;
  let calc_fmid = true;
  while (true) {
    if (++iter > iter_limit)
      throw `Excessive iteration in Search()`;
    let tmid = InterpolateTime(t1, t2, 0.5);
    let dt = tmid.ut - t1.ut;
    if (Math.abs(dt) < dt_days) {
      return tmid;
    }
    if (calc_fmid)
      fmid = f(tmid);
    else
      calc_fmid = true;
    let q = QuadInterp(tmid.ut, t2.ut - tmid.ut, f1, fmid, f2);
    if (q) {
      let tq = MakeTime(q.t);
      let fq = f(tq);
      if (q.df_dt !== 0) {
        if (Math.abs(fq / q.df_dt) < dt_days) {
          return tq;
        }
        let dt_guess = 1.2 * Math.abs(fq / q.df_dt);
        if (dt_guess < dt / 10) {
          let tleft = tq.AddDays(-dt_guess);
          let tright = tq.AddDays(+dt_guess);
          if ((tleft.ut - t1.ut) * (tleft.ut - t2.ut) < 0) {
            if ((tright.ut - t1.ut) * (tright.ut - t2.ut) < 0) {
              let fleft = f(tleft);
              let fright = f(tright);
              if (fleft < 0 && fright >= 0) {
                f1 = fleft;
                f2 = fright;
                t1 = tleft;
                t2 = tright;
                fmid = fq;
                calc_fmid = false;
                continue;
              }
            }
          }
        }
      }
    }
    if (f1 < 0 && fmid >= 0) {
      t2 = tmid;
      f2 = fmid;
      continue;
    }
    if (fmid < 0 && f2 >= 0) {
      t1 = tmid;
      f1 = fmid;
      continue;
    }
    return null;
  }
}
function LongitudeOffset(diff) {
  let offset = diff;
  while (offset <= -180)
    offset += 360;
  while (offset > 180)
    offset -= 360;
  return offset;
}
function NormalizeLongitude(lon) {
  while (lon < 0)
    lon += 360;
  while (lon >= 360)
    lon -= 360;
  return lon;
}
function SearchSunLongitude(targetLon, dateStart, limitDays) {
  function sun_offset(t) {
    let pos = SunPosition(t);
    return LongitudeOffset(pos.elon - targetLon);
  }
  __name(sun_offset, "sun_offset");
  VerifyNumber(targetLon);
  VerifyNumber(limitDays);
  let t1 = MakeTime(dateStart);
  let t2 = t1.AddDays(limitDays);
  return Search(sun_offset, t1, t2, { dt_tolerance_seconds: 0.01 });
}
function PairLongitude(body1, body2, date) {
  if (body1 === Body.Earth || body2 === Body.Earth)
    throw "The Earth does not have a longitude as seen from itself.";
  const time = MakeTime(date);
  const vector1 = GeoVector(body1, time, false);
  const eclip1 = Ecliptic(vector1);
  const vector2 = GeoVector(body2, time, false);
  const eclip2 = Ecliptic(vector2);
  return NormalizeLongitude(eclip1.elon - eclip2.elon);
}
function MoonPhase(date) {
  return PairLongitude(Body.Moon, Body.Sun, date);
}
function SearchMoonPhase(targetLon, dateStart, limitDays) {
  function moon_offset(t) {
    let mlon = MoonPhase(t);
    return LongitudeOffset(mlon - targetLon);
  }
  __name(moon_offset, "moon_offset");
  VerifyNumber(targetLon);
  VerifyNumber(limitDays);
  const uncertainty = 1.5;
  const ta = MakeTime(dateStart);
  let ya = moon_offset(ta);
  let est_dt, dt1, dt2;
  {
    if (ya > 0)
      ya -= 360;
    est_dt = -(MEAN_SYNODIC_MONTH * ya) / 360;
    dt1 = est_dt - uncertainty;
    if (dt1 > limitDays)
      return null;
    dt2 = Math.min(limitDays, est_dt + uncertainty);
  }
  const t1 = ta.AddDays(dt1);
  const t2 = ta.AddDays(dt2);
  return Search(moon_offset, t1, t2, { dt_tolerance_seconds: 0.1 });
}
function SearchMoonQuarter(dateStart) {
  let phaseStart = MoonPhase(dateStart);
  let quarterStart = Math.floor(phaseStart / 90);
  let quarter = (quarterStart + 1) % 4;
  let time = SearchMoonPhase(90 * quarter, dateStart, 10);
  if (!time)
    throw "Cannot find moon quarter";
  return new MoonQuarter(quarter, time);
}
function NextMoonQuarter(mq) {
  let date = new Date(mq.time.date.getTime() + 6 * MILLIS_PER_DAY);
  return SearchMoonQuarter(date);
}
function Seasons(year) {
  function find(targetLon, month, day) {
    let startDate = new Date(Date.UTC(year, month - 1, day));
    let time = SearchSunLongitude(targetLon, startDate, 20);
    if (!time)
      throw `Cannot find season change near ${startDate.toISOString()}`;
    return time;
  }
  __name(find, "find");
  if (year instanceof Date && Number.isFinite(year.getTime()))
    year = year.getUTCFullYear();
  if (!Number.isSafeInteger(year))
    throw `Cannot calculate seasons because year argument ${year} is neither a Date nor a safe integer.`;
  let mar_equinox = find(0, 3, 10);
  let jun_solstice = find(90, 6, 10);
  let sep_equinox = find(180, 9, 10);
  let dec_solstice = find(270, 12, 10);
  return new SeasonInfo(mar_equinox, jun_solstice, sep_equinox, dec_solstice);
}
function VectorFromSphere(sphere, time) {
  time = MakeTime(time);
  const radlat = sphere.lat * DEG2RAD;
  const radlon = sphere.lon * DEG2RAD;
  const rcoslat = sphere.dist * Math.cos(radlat);
  return new Vector(rcoslat * Math.cos(radlon), rcoslat * Math.sin(radlon), sphere.dist * Math.sin(radlat), time);
}
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
async function getFullMoonDates(startYear, endYear) {
  const dates = [];
  console.log(`Calculating full moons from ${startYear} to ${endYear}`);
  let searchTime = MakeTime(startYear);
  let moonQuarter = SearchMoonQuarter(searchTime);
  while (moonQuarter) {
    const date = new Date(moonQuarter.time.toString());
    const year = date.getUTCFullYear();
    if (year > endYear) {
      break;
    }
    if (moonQuarter.quarter === 2) {
      const formattedDate = formatDate(date);
      console.log(`Found full moon on: ${formattedDate}`);
      dates.push(formattedDate);
    }
    moonQuarter = NextMoonQuarter(moonQuarter);
  }
  return dates;
}
async function getSolarEvents(startYear, endYear) {
  const dates = [];
  console.log(`Calculating solar events from ${startYear} to ${endYear}`);
  for (let year = startYear; year <= endYear; year++) {
    try {
      const seasons = Seasons(year);
      const march = new Date(seasons.mar_equinox.toString());
      console.log(`Spring equinox found: ${march}`);
      dates.push(formatDate(march));
      const june = new Date(seasons.jun_solstice.toString());
      console.log(`Summer solstice found: ${june}`);
      dates.push(formatDate(june));
      const sept = new Date(seasons.sep_equinox.toString());
      console.log(`Fall equinox found: ${sept}`);
      dates.push(formatDate(sept));
      const dec = new Date(seasons.dec_solstice.toString());
      console.log(`Winter solstice found: ${dec}`);
      dates.push(formatDate(dec));
    } catch (error2) {
      console.error(`Error calculating solar events for ${year}:`, error2);
    }
  }
  return dates;
}
var jsxRuntime, reactJsxRuntime_production_min, hasRequiredReactJsxRuntime_production_min, hasRequiredJsxRuntime, jsxRuntimeExports, C_AUDAY, KM_PER_AU, DEG2RAD, RAD2DEG, DAYS_PER_TROPICAL_YEAR, J2000, PI2, ARC, ASEC2RAD, ASEC180, ASEC360, MEAN_SYNODIC_MONTH, SECONDS_PER_DAY, MILLIS_PER_DAY, EARTH_EQUATORIAL_RADIUS_KM, EARTH_EQUATORIAL_RADIUS_AU, EARTH_MOON_MASS_RATIO, SUN_GM, JUPITER_GM, SATURN_GM, URANUS_GM, NEPTUNE_GM, Body, StarList, StarTable, PrecessDirection, vsop, DeltaT, AstroTime, cache_e_tilt, Vector, StateVector, Spherical, RotationMatrix, EclipticCoordinates, DAYS_PER_MILLENNIUM, LON_INDEX, LAT_INDEX, RAD_INDEX, PLUTO_NUM_STATES, PLUTO_TIME_STEP, PLUTO_DT, PLUTO_NSTEPS, PlutoStateTable, TerseVector, body_state_t, major_bodies_t, body_grav_calc_t, grav_sim_t, pluto_cache, BodyPosition, MoonQuarter, SeasonInfo, ApsisKind, EclipseKind, NodeEventKind, Calendar, $$Astro, $$, $$file, $$url, _page2, page2;
var init_path_astro = __esm({
  ".wrangler/tmp/pages-9XcfGz/pages/_---path_.astro.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_BXn8oDq3();
    init_astro_renderers_O4SP2Us9();
    init_astro_renderers_O4SP2Us9();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    jsxRuntime = { exports: {} };
    reactJsxRuntime_production_min = {};
    __name(requireReactJsxRuntime_production_min, "requireReactJsxRuntime_production_min");
    __name(requireJsxRuntime, "requireJsxRuntime");
    jsxRuntimeExports = requireJsxRuntime();
    C_AUDAY = 173.1446326846693;
    KM_PER_AU = 14959787069098932e-8;
    DEG2RAD = 0.017453292519943295;
    RAD2DEG = 57.29577951308232;
    DAYS_PER_TROPICAL_YEAR = 365.24217;
    J2000 = /* @__PURE__ */ new Date("2000-01-01T12:00:00Z");
    PI2 = 2 * Math.PI;
    ARC = 3600 * (180 / Math.PI);
    ASEC2RAD = 484813681109536e-20;
    ASEC180 = 180 * 60 * 60;
    ASEC360 = 2 * ASEC180;
    MEAN_SYNODIC_MONTH = 29.530588;
    SECONDS_PER_DAY = 24 * 3600;
    MILLIS_PER_DAY = SECONDS_PER_DAY * 1e3;
    EARTH_EQUATORIAL_RADIUS_KM = 6378.1366;
    EARTH_EQUATORIAL_RADIUS_AU = EARTH_EQUATORIAL_RADIUS_KM / KM_PER_AU;
    EARTH_MOON_MASS_RATIO = 81.30056;
    SUN_GM = 2959122082855911e-19;
    JUPITER_GM = 2825345909524226e-22;
    SATURN_GM = 8459715185680659e-23;
    URANUS_GM = 1292024916781969e-23;
    NEPTUNE_GM = 1524358900784276e-23;
    __name(VerifyNumber, "VerifyNumber");
    __name(Frac, "Frac");
    (function(Body2) {
      Body2["Sun"] = "Sun";
      Body2["Moon"] = "Moon";
      Body2["Mercury"] = "Mercury";
      Body2["Venus"] = "Venus";
      Body2["Earth"] = "Earth";
      Body2["Mars"] = "Mars";
      Body2["Jupiter"] = "Jupiter";
      Body2["Saturn"] = "Saturn";
      Body2["Uranus"] = "Uranus";
      Body2["Neptune"] = "Neptune";
      Body2["Pluto"] = "Pluto";
      Body2["SSB"] = "SSB";
      Body2["EMB"] = "EMB";
      Body2["Star1"] = "Star1";
      Body2["Star2"] = "Star2";
      Body2["Star3"] = "Star3";
      Body2["Star4"] = "Star4";
      Body2["Star5"] = "Star5";
      Body2["Star6"] = "Star6";
      Body2["Star7"] = "Star7";
      Body2["Star8"] = "Star8";
    })(Body || (Body = {}));
    StarList = [
      Body.Star1,
      Body.Star2,
      Body.Star3,
      Body.Star4,
      Body.Star5,
      Body.Star6,
      Body.Star7,
      Body.Star8
    ];
    StarTable = [
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 },
      { ra: 0, dec: 0, dist: 0 }
    ];
    __name(GetStar, "GetStar");
    __name(UserDefinedStar, "UserDefinedStar");
    (function(PrecessDirection2) {
      PrecessDirection2[PrecessDirection2["From2000"] = 0] = "From2000";
      PrecessDirection2[PrecessDirection2["Into2000"] = 1] = "Into2000";
    })(PrecessDirection || (PrecessDirection = {}));
    vsop = {
      Mercury: [
        [
          [
            [4.40250710144, 0, 0],
            [0.40989414977, 1.48302034195, 26087.9031415742],
            [0.050462942, 4.47785489551, 52175.8062831484],
            [0.00855346844, 1.16520322459, 78263.70942472259],
            [0.00165590362, 4.11969163423, 104351.61256629678],
            [34561897e-11, 0.77930768443, 130439.51570787099],
            [7583476e-11, 3.71348404924, 156527.41884944518]
          ],
          [
            [26087.90313685529, 0, 0],
            [0.01131199811, 6.21874197797, 26087.9031415742],
            [0.00292242298, 3.04449355541, 52175.8062831484],
            [75775081e-11, 6.08568821653, 78263.70942472259],
            [19676525e-11, 2.80965111777, 104351.61256629678]
          ]
        ],
        [
          [
            [0.11737528961, 1.98357498767, 26087.9031415742],
            [0.02388076996, 5.03738959686, 52175.8062831484],
            [0.01222839532, 3.14159265359, 0],
            [0.0054325181, 1.79644363964, 78263.70942472259],
            [0.0012977877, 4.83232503958, 104351.61256629678],
            [31866927e-11, 1.58088495658, 130439.51570787099],
            [7963301e-11, 4.60972126127, 156527.41884944518]
          ],
          [
            [0.00274646065, 3.95008450011, 26087.9031415742],
            [99737713e-11, 3.14159265359, 0]
          ]
        ],
        [
          [
            [0.39528271651, 0, 0],
            [0.07834131818, 6.19233722598, 26087.9031415742],
            [0.00795525558, 2.95989690104, 52175.8062831484],
            [0.00121281764, 6.01064153797, 78263.70942472259],
            [21921969e-11, 2.77820093972, 104351.61256629678],
            [4354065e-11, 5.82894543774, 130439.51570787099]
          ],
          [
            [0.0021734774, 4.65617158665, 26087.9031415742],
            [44141826e-11, 1.42385544001, 52175.8062831484]
          ]
        ]
      ],
      Venus: [
        [
          [
            [3.17614666774, 0, 0],
            [0.01353968419, 5.59313319619, 10213.285546211],
            [89891645e-11, 5.30650047764, 20426.571092422],
            [5477194e-11, 4.41630661466, 7860.4193924392],
            [3455741e-11, 2.6996444782, 11790.6290886588],
            [2372061e-11, 2.99377542079, 3930.2096962196],
            [1317168e-11, 5.18668228402, 26.2983197998],
            [1664146e-11, 4.25018630147, 1577.3435424478],
            [1438387e-11, 4.15745084182, 9683.5945811164],
            [1200521e-11, 6.15357116043, 30639.856638633]
          ],
          [
            [10213.28554621638, 0, 0],
            [95617813e-11, 2.4640651111, 10213.285546211],
            [7787201e-11, 0.6247848222, 20426.571092422]
          ]
        ],
        [
          [
            [0.05923638472, 0.26702775812, 10213.285546211],
            [40107978e-11, 1.14737178112, 20426.571092422],
            [32814918e-11, 3.14159265359, 0]
          ],
          [
            [0.00287821243, 1.88964962838, 10213.285546211]
          ]
        ],
        [
          [
            [0.72334820891, 0, 0],
            [0.00489824182, 4.02151831717, 10213.285546211],
            [1658058e-11, 4.90206728031, 20426.571092422],
            [1378043e-11, 1.12846591367, 11790.6290886588],
            [1632096e-11, 2.84548795207, 7860.4193924392],
            [498395e-11, 2.58682193892, 9683.5945811164],
            [221985e-11, 2.01346696541, 19367.1891622328],
            [237454e-11, 2.55136053886, 15720.8387848784]
          ],
          [
            [34551041e-11, 0.89198706276, 10213.285546211]
          ]
        ]
      ],
      Earth: [
        [
          [
            [1.75347045673, 0, 0],
            [0.03341656453, 4.66925680415, 6283.0758499914],
            [34894275e-11, 4.62610242189, 12566.1516999828],
            [3417572e-11, 2.82886579754, 3.523118349],
            [3497056e-11, 2.74411783405, 5753.3848848968],
            [3135899e-11, 3.62767041756, 77713.7714681205],
            [2676218e-11, 4.41808345438, 7860.4193924392],
            [2342691e-11, 6.13516214446, 3930.2096962196],
            [1273165e-11, 2.03709657878, 529.6909650946],
            [1324294e-11, 0.74246341673, 11506.7697697936],
            [901854e-11, 2.04505446477, 26.2983197998],
            [1199167e-11, 1.10962946234, 1577.3435424478],
            [857223e-11, 3.50849152283, 398.1490034082],
            [779786e-11, 1.17882681962, 5223.6939198022],
            [99025e-10, 5.23268072088, 5884.9268465832],
            [753141e-11, 2.53339052847, 5507.5532386674],
            [505267e-11, 4.58292599973, 18849.2275499742],
            [492392e-11, 4.20505711826, 775.522611324],
            [356672e-11, 2.91954114478, 0.0673103028],
            [284125e-11, 1.89869240932, 796.2980068164],
            [242879e-11, 0.34481445893, 5486.777843175],
            [317087e-11, 5.84901948512, 11790.6290886588],
            [271112e-11, 0.31486255375, 10977.078804699],
            [206217e-11, 4.80646631478, 2544.3144198834],
            [205478e-11, 1.86953770281, 5573.1428014331],
            [202318e-11, 2.45767790232, 6069.7767545534],
            [126225e-11, 1.08295459501, 20.7753954924],
            [155516e-11, 0.83306084617, 213.299095438]
          ],
          [
            [6283.0758499914, 0, 0],
            [0.00206058863, 2.67823455808, 6283.0758499914],
            [4303419e-11, 2.63512233481, 12566.1516999828]
          ],
          [
            [8721859e-11, 1.07253635559, 6283.0758499914]
          ]
        ],
        [
          [],
          [
            [0.00227777722, 3.4137662053, 6283.0758499914],
            [3805678e-11, 3.37063423795, 12566.1516999828]
          ]
        ],
        [
          [
            [1.00013988784, 0, 0],
            [0.01670699632, 3.09846350258, 6283.0758499914],
            [13956024e-11, 3.05524609456, 12566.1516999828],
            [308372e-10, 5.19846674381, 77713.7714681205],
            [1628463e-11, 1.17387558054, 5753.3848848968],
            [1575572e-11, 2.84685214877, 7860.4193924392],
            [924799e-11, 5.45292236722, 11506.7697697936],
            [542439e-11, 4.56409151453, 3930.2096962196],
            [47211e-10, 3.66100022149, 5884.9268465832],
            [85831e-11, 1.27079125277, 161000.6857376741],
            [57056e-11, 2.01374292245, 83996.84731811189],
            [55736e-11, 5.2415979917, 71430.69561812909],
            [174844e-11, 3.01193636733, 18849.2275499742],
            [243181e-11, 4.2734953079, 11790.6290886588]
          ],
          [
            [0.00103018607, 1.10748968172, 6283.0758499914],
            [1721238e-11, 1.06442300386, 12566.1516999828]
          ],
          [
            [4359385e-11, 5.78455133808, 6283.0758499914]
          ]
        ]
      ],
      Mars: [
        [
          [
            [6.20347711581, 0, 0],
            [0.18656368093, 5.0503710027, 3340.6124266998],
            [0.01108216816, 5.40099836344, 6681.2248533996],
            [91798406e-11, 5.75478744667, 10021.8372800994],
            [27744987e-11, 5.97049513147, 3.523118349],
            [10610235e-11, 2.93958560338, 2281.2304965106],
            [12315897e-11, 0.84956094002, 2810.9214616052],
            [8926784e-11, 4.15697846427, 0.0172536522],
            [8715691e-11, 6.11005153139, 13362.4497067992],
            [6797556e-11, 0.36462229657, 398.1490034082],
            [7774872e-11, 3.33968761376, 5621.8429232104],
            [3575078e-11, 1.6618650571, 2544.3144198834],
            [4161108e-11, 0.22814971327, 2942.4634232916],
            [3075252e-11, 0.85696614132, 191.4482661116],
            [2628117e-11, 0.64806124465, 3337.0893083508],
            [2937546e-11, 6.07893711402, 0.0673103028],
            [2389414e-11, 5.03896442664, 796.2980068164],
            [2579844e-11, 0.02996736156, 3344.1355450488],
            [1528141e-11, 1.14979301996, 6151.533888305],
            [1798806e-11, 0.65634057445, 529.6909650946],
            [1264357e-11, 3.62275122593, 5092.1519581158],
            [1286228e-11, 3.06796065034, 2146.1654164752],
            [1546404e-11, 2.91579701718, 1751.539531416],
            [1024902e-11, 3.69334099279, 8962.4553499102],
            [891566e-11, 0.18293837498, 16703.062133499],
            [858759e-11, 2.4009381194, 2914.0142358238],
            [832715e-11, 2.46418619474, 3340.5951730476],
            [83272e-10, 4.49495782139, 3340.629680352],
            [712902e-11, 3.66335473479, 1059.3819301892],
            [748723e-11, 3.82248614017, 155.4203994342],
            [723861e-11, 0.67497311481, 3738.761430108],
            [635548e-11, 2.92182225127, 8432.7643848156],
            [655162e-11, 0.48864064125, 3127.3133312618],
            [550474e-11, 3.81001042328, 0.9803210682],
            [55275e-10, 4.47479317037, 1748.016413067],
            [425966e-11, 0.55364317304, 6283.0758499914],
            [415131e-11, 0.49662285038, 213.299095438],
            [472167e-11, 3.62547124025, 1194.4470102246],
            [306551e-11, 0.38052848348, 6684.7479717486],
            [312141e-11, 0.99853944405, 6677.7017350506],
            [293198e-11, 4.22131299634, 20.7753954924],
            [302375e-11, 4.48618007156, 3532.0606928114],
            [274027e-11, 0.54222167059, 3340.545116397],
            [281079e-11, 5.88163521788, 1349.8674096588],
            [231183e-11, 1.28242156993, 3870.3033917944],
            [283602e-11, 5.7688543494, 3149.1641605882],
            [236117e-11, 5.75503217933, 3333.498879699],
            [274033e-11, 0.13372524985, 3340.6797370026],
            [299395e-11, 2.78323740866, 6254.6266625236]
          ],
          [
            [3340.61242700512, 0, 0],
            [0.01457554523, 3.60433733236, 3340.6124266998],
            [0.00168414711, 3.92318567804, 6681.2248533996],
            [20622975e-11, 4.26108844583, 10021.8372800994],
            [3452392e-11, 4.7321039319, 3.523118349],
            [2586332e-11, 4.60670058555, 13362.4497067992],
            [841535e-11, 4.45864030426, 2281.2304965106]
          ],
          [
            [58152577e-11, 2.04961712429, 3340.6124266998],
            [13459579e-11, 2.45738706163, 6681.2248533996]
          ]
        ],
        [
          [
            [0.03197134986, 3.76832042431, 3340.6124266998],
            [0.00298033234, 4.10616996305, 6681.2248533996],
            [0.00289104742, 0, 0],
            [31365539e-11, 4.4465105309, 10021.8372800994],
            [34841e-9, 4.7881254926, 13362.4497067992]
          ],
          [
            [0.00217310991, 6.04472194776, 3340.6124266998],
            [20976948e-11, 3.14159265359, 0],
            [12834709e-11, 1.60810667915, 6681.2248533996]
          ]
        ],
        [
          [
            [1.53033488271, 0, 0],
            [0.1418495316, 3.47971283528, 3340.6124266998],
            [0.00660776362, 3.81783443019, 6681.2248533996],
            [46179117e-11, 4.15595316782, 10021.8372800994],
            [8109733e-11, 5.55958416318, 2810.9214616052],
            [7485318e-11, 1.77239078402, 5621.8429232104],
            [5523191e-11, 1.3643630377, 2281.2304965106],
            [382516e-10, 4.49407183687, 13362.4497067992],
            [2306537e-11, 0.09081579001, 2544.3144198834],
            [1999396e-11, 5.36059617709, 3337.0893083508],
            [2484394e-11, 4.9254563992, 2942.4634232916],
            [1960195e-11, 4.74249437639, 3344.1355450488],
            [1167119e-11, 2.11260868341, 5092.1519581158],
            [1102816e-11, 5.00908403998, 398.1490034082],
            [899066e-11, 4.40791133207, 529.6909650946],
            [992252e-11, 5.83861961952, 6151.533888305],
            [807354e-11, 2.10217065501, 1059.3819301892],
            [797915e-11, 3.44839203899, 796.2980068164],
            [740975e-11, 1.49906336885, 2146.1654164752]
          ],
          [
            [0.01107433345, 2.03250524857, 3340.6124266998],
            [0.00103175887, 2.37071847807, 6681.2248533996],
            [128772e-9, 0, 0],
            [1081588e-10, 2.70888095665, 10021.8372800994]
          ],
          [
            [44242249e-11, 0.47930604954, 3340.6124266998],
            [8138042e-11, 0.86998389204, 6681.2248533996]
          ]
        ]
      ],
      Jupiter: [
        [
          [
            [0.59954691494, 0, 0],
            [0.09695898719, 5.06191793158, 529.6909650946],
            [0.00573610142, 1.44406205629, 7.1135470008],
            [0.00306389205, 5.41734730184, 1059.3819301892],
            [97178296e-11, 4.14264726552, 632.7837393132],
            [72903078e-11, 3.64042916389, 522.5774180938],
            [64263975e-11, 3.41145165351, 103.0927742186],
            [39806064e-11, 2.29376740788, 419.4846438752],
            [38857767e-11, 1.27231755835, 316.3918696566],
            [27964629e-11, 1.7845459182, 536.8045120954],
            [1358973e-10, 5.7748104079, 1589.0728952838],
            [8246349e-11, 3.5822792584, 206.1855484372],
            [8768704e-11, 3.63000308199, 949.1756089698],
            [7368042e-11, 5.0810119427, 735.8765135318],
            [626315e-10, 0.02497628807, 213.299095438],
            [6114062e-11, 4.51319998626, 1162.4747044078],
            [4905396e-11, 1.32084470588, 110.2063212194],
            [5305285e-11, 1.30671216791, 14.2270940016],
            [5305441e-11, 4.18625634012, 1052.2683831884],
            [4647248e-11, 4.69958103684, 3.9321532631],
            [3045023e-11, 4.31676431084, 426.598190876],
            [2609999e-11, 1.56667394063, 846.0828347512],
            [2028191e-11, 1.06376530715, 3.1813937377],
            [1764763e-11, 2.14148655117, 1066.49547719],
            [1722972e-11, 3.88036268267, 1265.5674786264],
            [1920945e-11, 0.97168196472, 639.897286314],
            [1633223e-11, 3.58201833555, 515.463871093],
            [1431999e-11, 4.29685556046, 625.6701923124],
            [973272e-11, 4.09764549134, 95.9792272178]
          ],
          [
            [529.69096508814, 0, 0],
            [0.00489503243, 4.2208293947, 529.6909650946],
            [0.00228917222, 6.02646855621, 7.1135470008],
            [30099479e-11, 4.54540782858, 1059.3819301892],
            [2072092e-10, 5.45943156902, 522.5774180938],
            [12103653e-11, 0.16994816098, 536.8045120954],
            [6067987e-11, 4.42422292017, 103.0927742186],
            [5433968e-11, 3.98480737746, 419.4846438752],
            [4237744e-11, 5.89008707199, 14.2270940016]
          ],
          [
            [47233601e-11, 4.32148536482, 7.1135470008],
            [30649436e-11, 2.929777887, 529.6909650946],
            [14837605e-11, 3.14159265359, 0]
          ]
        ],
        [
          [
            [0.02268615702, 3.55852606721, 529.6909650946],
            [0.00109971634, 3.90809347197, 1059.3819301892],
            [0.00110090358, 0, 0],
            [8101428e-11, 3.60509572885, 522.5774180938],
            [6043996e-11, 4.25883108339, 1589.0728952838],
            [6437782e-11, 0.30627119215, 536.8045120954]
          ],
          [
            [78203446e-11, 1.52377859742, 529.6909650946]
          ]
        ],
        [
          [
            [5.20887429326, 0, 0],
            [0.25209327119, 3.49108639871, 529.6909650946],
            [0.00610599976, 3.84115365948, 1059.3819301892],
            [0.00282029458, 2.57419881293, 632.7837393132],
            [0.00187647346, 2.07590383214, 522.5774180938],
            [86792905e-11, 0.71001145545, 419.4846438752],
            [72062974e-11, 0.21465724607, 536.8045120954],
            [65517248e-11, 5.9799588479, 316.3918696566],
            [29134542e-11, 1.67759379655, 103.0927742186],
            [30135335e-11, 2.16132003734, 949.1756089698],
            [23453271e-11, 3.54023522184, 735.8765135318],
            [22283743e-11, 4.19362594399, 1589.0728952838],
            [23947298e-11, 0.2745803748, 7.1135470008],
            [13032614e-11, 2.96042965363, 1162.4747044078],
            [970336e-10, 1.90669633585, 206.1855484372],
            [12749023e-11, 2.71550286592, 1052.2683831884],
            [7057931e-11, 2.18184839926, 1265.5674786264],
            [6137703e-11, 6.26418240033, 846.0828347512],
            [2616976e-11, 2.00994012876, 1581.959348283]
          ],
          [
            [0.0127180152, 2.64937512894, 529.6909650946],
            [61661816e-11, 3.00076460387, 1059.3819301892],
            [53443713e-11, 3.89717383175, 522.5774180938],
            [31185171e-11, 4.88276958012, 536.8045120954],
            [41390269e-11, 0, 0]
          ]
        ]
      ],
      Saturn: [
        [
          [
            [0.87401354025, 0, 0],
            [0.11107659762, 3.96205090159, 213.299095438],
            [0.01414150957, 4.58581516874, 7.1135470008],
            [0.00398379389, 0.52112032699, 206.1855484372],
            [0.00350769243, 3.30329907896, 426.598190876],
            [0.00206816305, 0.24658372002, 103.0927742186],
            [792713e-9, 3.84007056878, 220.4126424388],
            [23990355e-11, 4.66976924553, 110.2063212194],
            [16573588e-11, 0.43719228296, 419.4846438752],
            [14906995e-11, 5.76903183869, 316.3918696566],
            [1582029e-10, 0.93809155235, 632.7837393132],
            [14609559e-11, 1.56518472, 3.9321532631],
            [13160301e-11, 4.44891291899, 14.2270940016],
            [15053543e-11, 2.71669915667, 639.897286314],
            [13005299e-11, 5.98119023644, 11.0457002639],
            [10725067e-11, 3.12939523827, 202.2533951741],
            [5863206e-11, 0.23656938524, 529.6909650946],
            [5227757e-11, 4.20783365759, 3.1813937377],
            [6126317e-11, 1.76328667907, 277.0349937414],
            [5019687e-11, 3.17787728405, 433.7117378768],
            [459255e-10, 0.61977744975, 199.0720014364],
            [4005867e-11, 2.24479718502, 63.7358983034],
            [2953796e-11, 0.98280366998, 95.9792272178],
            [387367e-10, 3.22283226966, 138.5174968707],
            [2461186e-11, 2.03163875071, 735.8765135318],
            [3269484e-11, 0.77492638211, 949.1756089698],
            [1758145e-11, 3.2658010994, 522.5774180938],
            [1640172e-11, 5.5050445305, 846.0828347512],
            [1391327e-11, 4.02333150505, 323.5054166574],
            [1580648e-11, 4.37265307169, 309.2783226558],
            [1123498e-11, 2.83726798446, 415.5524906121],
            [1017275e-11, 3.71700135395, 227.5261894396],
            [848642e-11, 3.1915017083, 209.3669421749]
          ],
          [
            [213.2990952169, 0, 0],
            [0.01297370862, 1.82834923978, 213.299095438],
            [0.00564345393, 2.88499717272, 7.1135470008],
            [93734369e-11, 1.06311793502, 426.598190876],
            [0.00107674962, 2.27769131009, 206.1855484372],
            [40244455e-11, 2.04108104671, 220.4126424388],
            [19941774e-11, 1.2795439047, 103.0927742186],
            [10511678e-11, 2.7488034213, 14.2270940016],
            [6416106e-11, 0.38238295041, 639.897286314],
            [4848994e-11, 2.43037610229, 419.4846438752],
            [4056892e-11, 2.92133209468, 110.2063212194],
            [3768635e-11, 3.6496533078, 3.9321532631]
          ],
          [
            [0.0011644133, 1.17988132879, 7.1135470008],
            [91841837e-11, 0.0732519584, 213.299095438],
            [36661728e-11, 0, 0],
            [15274496e-11, 4.06493179167, 206.1855484372]
          ]
        ],
        [
          [
            [0.04330678039, 3.60284428399, 213.299095438],
            [0.00240348302, 2.85238489373, 426.598190876],
            [84745939e-11, 0, 0],
            [30863357e-11, 3.48441504555, 220.4126424388],
            [34116062e-11, 0.57297307557, 206.1855484372],
            [1473407e-10, 2.11846596715, 639.897286314],
            [9916667e-11, 5.79003188904, 419.4846438752],
            [6993564e-11, 4.7360468972, 7.1135470008],
            [4807588e-11, 5.43305312061, 316.3918696566]
          ],
          [
            [0.00198927992, 4.93901017903, 213.299095438],
            [36947916e-11, 3.14159265359, 0],
            [17966989e-11, 0.5197943111, 426.598190876]
          ]
        ],
        [
          [
            [9.55758135486, 0, 0],
            [0.52921382865, 2.39226219573, 213.299095438],
            [0.01873679867, 5.2354960466, 206.1855484372],
            [0.01464663929, 1.64763042902, 426.598190876],
            [0.00821891141, 5.93520042303, 316.3918696566],
            [0.00547506923, 5.0153261898, 103.0927742186],
            [0.0037168465, 2.27114821115, 220.4126424388],
            [0.00361778765, 3.13904301847, 7.1135470008],
            [0.00140617506, 5.70406606781, 632.7837393132],
            [0.00108974848, 3.29313390175, 110.2063212194],
            [69006962e-11, 5.94099540992, 419.4846438752],
            [61053367e-11, 0.94037691801, 639.897286314],
            [48913294e-11, 1.55733638681, 202.2533951741],
            [34143772e-11, 0.19519102597, 277.0349937414],
            [32401773e-11, 5.47084567016, 949.1756089698],
            [20936596e-11, 0.46349251129, 735.8765135318],
            [9796004e-11, 5.20477537945, 1265.5674786264],
            [11993338e-11, 5.98050967385, 846.0828347512],
            [208393e-9, 1.52102476129, 433.7117378768],
            [15298404e-11, 3.0594381494, 529.6909650946],
            [6465823e-11, 0.17732249942, 1052.2683831884],
            [11380257e-11, 1.7310542704, 522.5774180938],
            [3419618e-11, 4.94550542171, 1581.959348283]
          ],
          [
            [0.0618298134, 0.2584351148, 213.299095438],
            [0.00506577242, 0.71114625261, 206.1855484372],
            [0.00341394029, 5.79635741658, 426.598190876],
            [0.00188491195, 0.47215589652, 220.4126424388],
            [0.00186261486, 3.14159265359, 0],
            [0.00143891146, 1.40744822888, 7.1135470008]
          ],
          [
            [0.00436902572, 4.78671677509, 213.299095438]
          ]
        ]
      ],
      Uranus: [
        [
          [
            [5.48129294297, 0, 0],
            [0.09260408234, 0.89106421507, 74.7815985673],
            [0.01504247898, 3.6271926092, 1.4844727083],
            [0.00365981674, 1.89962179044, 73.297125859],
            [0.00272328168, 3.35823706307, 149.5631971346],
            [70328461e-11, 5.39254450063, 63.7358983034],
            [68892678e-11, 6.09292483287, 76.2660712756],
            [61998615e-11, 2.26952066061, 2.9689454166],
            [61950719e-11, 2.85098872691, 11.0457002639],
            [2646877e-10, 3.14152083966, 71.8126531507],
            [25710476e-11, 6.11379840493, 454.9093665273],
            [2107885e-10, 4.36059339067, 148.0787244263],
            [17818647e-11, 1.74436930289, 36.6485629295],
            [14613507e-11, 4.73732166022, 3.9321532631],
            [11162509e-11, 5.8268179635, 224.3447957019],
            [1099791e-10, 0.48865004018, 138.5174968707],
            [9527478e-11, 2.95516862826, 35.1640902212],
            [7545601e-11, 5.236265824, 109.9456887885],
            [4220241e-11, 3.23328220918, 70.8494453042],
            [40519e-9, 2.277550173, 151.0476698429],
            [3354596e-11, 1.0654900738, 4.4534181249],
            [2926718e-11, 4.62903718891, 9.5612275556],
            [349034e-10, 5.48306144511, 146.594251718],
            [3144069e-11, 4.75199570434, 77.7505439839],
            [2922333e-11, 5.35235361027, 85.8272988312],
            [2272788e-11, 4.36600400036, 70.3281804424],
            [2051219e-11, 1.51773566586, 0.1118745846],
            [2148602e-11, 0.60745949945, 38.1330356378],
            [1991643e-11, 4.92437588682, 277.0349937414],
            [1376226e-11, 2.04283539351, 65.2203710117],
            [1666902e-11, 3.62744066769, 380.12776796],
            [1284107e-11, 3.11347961505, 202.2533951741],
            [1150429e-11, 0.93343589092, 3.1813937377],
            [1533221e-11, 2.58594681212, 52.6901980395],
            [1281604e-11, 0.54271272721, 222.8603229936],
            [1372139e-11, 4.19641530878, 111.4301614968],
            [1221029e-11, 0.1990065003, 108.4612160802],
            [946181e-11, 1.19253165736, 127.4717966068],
            [1150989e-11, 4.17898916639, 33.6796175129]
          ],
          [
            [74.7815986091, 0, 0],
            [0.00154332863, 5.24158770553, 74.7815985673],
            [24456474e-11, 1.71260334156, 1.4844727083],
            [9258442e-11, 0.4282973235, 11.0457002639],
            [8265977e-11, 1.50218091379, 63.7358983034],
            [915016e-10, 1.41213765216, 149.5631971346]
          ]
        ],
        [
          [
            [0.01346277648, 2.61877810547, 74.7815985673],
            [623414e-9, 5.08111189648, 149.5631971346],
            [61601196e-11, 3.14159265359, 0],
            [9963722e-11, 1.61603805646, 76.2660712756],
            [992616e-10, 0.57630380333, 73.297125859]
          ],
          [
            [34101978e-11, 0.01321929936, 74.7815985673]
          ]
        ],
        [
          [
            [19.21264847206, 0, 0],
            [0.88784984413, 5.60377527014, 74.7815985673],
            [0.03440836062, 0.32836099706, 73.297125859],
            [0.0205565386, 1.7829515933, 149.5631971346],
            [0.0064932241, 4.52247285911, 76.2660712756],
            [0.00602247865, 3.86003823674, 63.7358983034],
            [0.00496404167, 1.40139935333, 454.9093665273],
            [0.00338525369, 1.58002770318, 138.5174968707],
            [0.00243509114, 1.57086606044, 71.8126531507],
            [0.00190522303, 1.99809394714, 1.4844727083],
            [0.00161858838, 2.79137786799, 148.0787244263],
            [0.00143706183, 1.38368544947, 11.0457002639],
            [93192405e-11, 0.17437220467, 36.6485629295],
            [71424548e-11, 4.24509236074, 224.3447957019],
            [89806014e-11, 3.66105364565, 109.9456887885],
            [39009723e-11, 1.66971401684, 70.8494453042],
            [46677296e-11, 1.39976401694, 35.1640902212],
            [39025624e-11, 3.36234773834, 277.0349937414],
            [36755274e-11, 3.88649278513, 146.594251718],
            [30348723e-11, 0.70100838798, 151.0476698429],
            [29156413e-11, 3.180563367, 77.7505439839],
            [22637073e-11, 0.72518687029, 529.6909650946],
            [11959076e-11, 1.7504339214, 984.6003316219],
            [25620756e-11, 5.25656086672, 380.12776796]
          ],
          [
            [0.01479896629, 3.67205697578, 74.7815985673]
          ]
        ]
      ],
      Neptune: [
        [
          [
            [5.31188633046, 0, 0],
            [0.0179847553, 2.9010127389, 38.1330356378],
            [0.01019727652, 0.48580922867, 1.4844727083],
            [0.00124531845, 4.83008090676, 36.6485629295],
            [42064466e-11, 5.41054993053, 2.9689454166],
            [37714584e-11, 6.09221808686, 35.1640902212],
            [33784738e-11, 1.24488874087, 76.2660712756],
            [16482741e-11, 7727998e-11, 491.5579294568],
            [9198584e-11, 4.93747051954, 39.6175083461],
            [899425e-10, 0.27462171806, 175.1660598002]
          ],
          [
            [38.13303563957, 0, 0],
            [16604172e-11, 4.86323329249, 1.4844727083],
            [15744045e-11, 2.27887427527, 38.1330356378]
          ]
        ],
        [
          [
            [0.03088622933, 1.44104372644, 38.1330356378],
            [27780087e-11, 5.91271884599, 76.2660712756],
            [27623609e-11, 0, 0],
            [15355489e-11, 2.52123799551, 36.6485629295],
            [15448133e-11, 3.50877079215, 39.6175083461]
          ]
        ],
        [
          [
            [30.07013205828, 0, 0],
            [0.27062259632, 1.32999459377, 38.1330356378],
            [0.01691764014, 3.25186135653, 36.6485629295],
            [0.00807830553, 5.18592878704, 1.4844727083],
            [0.0053776051, 4.52113935896, 35.1640902212],
            [0.00495725141, 1.5710564165, 491.5579294568],
            [0.00274571975, 1.84552258866, 175.1660598002],
            [1201232e-10, 1.92059384991, 1021.2488945514],
            [0.00121801746, 5.79754470298, 76.2660712756],
            [0.00100896068, 0.3770272493, 73.297125859],
            [0.00135134092, 3.37220609835, 39.6175083461],
            [7571796e-11, 1.07149207335, 388.4651552382]
          ]
        ]
      ]
    };
    __name(DeltaT_EspenakMeeus, "DeltaT_EspenakMeeus");
    DeltaT = DeltaT_EspenakMeeus;
    __name(TerrestrialTime, "TerrestrialTime");
    AstroTime = class {
      /**
       * @param {FlexibleDateTime} date
       *      A JavaScript Date object, a numeric UTC value expressed in J2000 days, or another AstroTime object.
       */
      constructor(date) {
        if (date instanceof AstroTime) {
          this.date = date.date;
          this.ut = date.ut;
          this.tt = date.tt;
          return;
        }
        const MillisPerDay = 1e3 * 3600 * 24;
        if (date instanceof Date && Number.isFinite(date.getTime())) {
          this.date = date;
          this.ut = (date.getTime() - J2000.getTime()) / MillisPerDay;
          this.tt = TerrestrialTime(this.ut);
          return;
        }
        if (Number.isFinite(date)) {
          this.date = new Date(J2000.getTime() + date * MillisPerDay);
          this.ut = date;
          this.tt = TerrestrialTime(this.ut);
          return;
        }
        throw "Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.";
      }
      /**
       * @brief Creates an `AstroTime` value from a Terrestrial Time (TT) day value.
       *
       * This function can be used in rare cases where a time must be based
       * on Terrestrial Time (TT) rather than Universal Time (UT).
       * Most developers will want to invoke `new AstroTime(ut)` with a universal time
       * instead of this function, because usually time is based on civil time adjusted
       * by leap seconds to match the Earth's rotation, rather than the uniformly
       * flowing TT used to calculate solar system dynamics. In rare cases
       * where the caller already knows TT, this function is provided to create
       * an `AstroTime` value that can be passed to Astronomy Engine functions.
       *
       * @param {number} tt
       *      The number of days since the J2000 epoch as expressed in Terrestrial Time.
       *
       * @returns {AstroTime}
       *      An `AstroTime` object for the specified terrestrial time.
       */
      static FromTerrestrialTime(tt) {
        let time = new AstroTime(tt);
        for (; ; ) {
          const err = tt - time.tt;
          if (Math.abs(err) < 1e-12)
            return time;
          time = time.AddDays(err);
        }
      }
      /**
       * Formats an `AstroTime` object as an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
       * date/time string in UTC, to millisecond resolution.
       * Example: `2018-08-17T17:22:04.050Z`
       * @returns {string}
       */
      toString() {
        return this.date.toISOString();
      }
      /**
       * Returns a new `AstroTime` object adjusted by the floating point number of days.
       * Does NOT modify the original `AstroTime` object.
       *
       * @param {number} days
       *      The floating point number of days by which to adjust the given date and time.
       *      Positive values adjust the date toward the future, and
       *      negative values adjust the date toward the past.
       *
       * @returns {AstroTime}
       */
      AddDays(days) {
        return new AstroTime(this.ut + days);
      }
    };
    __name(AstroTime, "AstroTime");
    __name(InterpolateTime, "InterpolateTime");
    __name(MakeTime, "MakeTime");
    __name(iau2000b, "iau2000b");
    __name(mean_obliq, "mean_obliq");
    __name(e_tilt, "e_tilt");
    __name(obl_ecl2equ_vec, "obl_ecl2equ_vec");
    __name(ecl2equ_vec, "ecl2equ_vec");
    __name(CalcMoon, "CalcMoon");
    __name(rotate, "rotate");
    __name(precession, "precession");
    __name(precession_rot, "precession_rot");
    __name(nutation, "nutation");
    __name(nutation_rot, "nutation_rot");
    __name(gyration, "gyration");
    Vector = class {
      constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
      }
      /**
       * Returns the length of the vector in astronomical units (AU).
       * @returns {number}
       */
      Length() {
        return Math.hypot(this.x, this.y, this.z);
      }
    };
    __name(Vector, "Vector");
    StateVector = class {
      constructor(x, y, z, vx, vy, vz, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.t = t;
      }
    };
    __name(StateVector, "StateVector");
    Spherical = class {
      constructor(lat, lon, dist) {
        this.lat = VerifyNumber(lat);
        this.lon = VerifyNumber(lon);
        this.dist = VerifyNumber(dist);
      }
    };
    __name(Spherical, "Spherical");
    RotationMatrix = class {
      constructor(rot) {
        this.rot = rot;
      }
    };
    __name(RotationMatrix, "RotationMatrix");
    EclipticCoordinates = class {
      constructor(vec, elat, elon) {
        this.vec = vec;
        this.elat = VerifyNumber(elat);
        this.elon = VerifyNumber(elon);
      }
    };
    __name(EclipticCoordinates, "EclipticCoordinates");
    __name(SunPosition, "SunPosition");
    __name(RotateEquatorialToEcliptic, "RotateEquatorialToEcliptic");
    __name(Ecliptic, "Ecliptic");
    __name(GeoMoon, "GeoMoon");
    __name(VsopFormula, "VsopFormula");
    __name(VsopDeriv, "VsopDeriv");
    DAYS_PER_MILLENNIUM = 365250;
    LON_INDEX = 0;
    LAT_INDEX = 1;
    RAD_INDEX = 2;
    __name(VsopRotate, "VsopRotate");
    __name(VsopSphereToRect, "VsopSphereToRect");
    __name(CalcVsop, "CalcVsop");
    __name(CalcVsopPosVel, "CalcVsopPosVel");
    __name(AdjustBarycenter, "AdjustBarycenter");
    __name(CalcSolarSystemBarycenter, "CalcSolarSystemBarycenter");
    PLUTO_NUM_STATES = 51;
    PLUTO_TIME_STEP = 29200;
    PLUTO_DT = 146;
    PLUTO_NSTEPS = 201;
    PlutoStateTable = [
      [-73e4, [-26.118207232108, -14.376168177825, 3.384402515299], [0.0016339372163656, -0.0027861699588508, -0.0013585880229445]],
      [-700800, [41.974905202127, -0.448502952929, -12.770351505989], [73458569351457e-17, 0.0022785014891658, 48619778602049e-17]],
      [-671600, [14.706930780744, 44.269110540027, 9.353698474772], [-0.00210001479998, 22295915939915e-17, 70143443551414e-17]],
      [-642400, [-29.441003929957, -6.43016153057, 6.858481011305], [84495803960544e-17, -0.0030783914758711, -0.0012106305981192]],
      [-613200, [39.444396946234, -6.557989760571, -13.913760296463], [0.0011480029005873, 0.0022400006880665, 35168075922288e-17]],
      [-584e3, [20.2303809507, 43.266966657189, 7.382966091923], [-0.0019754081700585, 53457141292226e-17, 75929169129793e-17]],
      [-554800, [-30.65832536462, 2.093818874552, 9.880531138071], [61010603013347e-18, -0.0031326500935382, -99346125151067e-17]],
      [-525600, [35.737703251673, -12.587706024764, -14.677847247563], [0.0015802939375649, 0.0021347678412429, 19074436384343e-17]],
      [-496400, [25.466295188546, 41.367478338417, 5.216476873382], [-0.0018054401046468, 8328308359951e-16, 80260156912107e-17]],
      [-467200, [-29.847174904071, 10.636426313081, 12.297904180106], [-63257063052907e-17, -0.0029969577578221, -74476074151596e-17]],
      [-438e3, [30.774692107687, -18.236637015304, -14.945535879896], [0.0020113162005465, 0.0019353827024189, -20937793168297e-19]],
      [-408800, [30.243153324028, 38.656267888503, 2.938501750218], [-0.0016052508674468, 0.0011183495337525, 83333973416824e-17]],
      [-379600, [-27.288984772533, 18.643162147874, 14.023633623329], [-0.0011856388898191, -0.0027170609282181, -49015526126399e-17]],
      [-350400, [24.519605196774, -23.245756064727, -14.626862367368], [0.0024322321483154, 0.0016062008146048, -23369181613312e-17]],
      [-321200, [34.505274805875, 35.125338586954, 0.557361475637], [-0.0013824391637782, 0.0013833397561817, 84823598806262e-17]],
      [-292e3, [-23.275363915119, 25.818514298769, 15.055381588598], [-0.0016062295460975, -0.0023395961498533, -24377362639479e-17]],
      [-262800, [17.050384798092, -27.180376290126, -13.608963321694], [0.0028175521080578, 0.0011358749093955, -49548725258825e-17]],
      [-233600, [38.093671910285, 30.880588383337, -1.843688067413], [-0.0011317697153459, 0.0016128814698472, 84177586176055e-17]],
      [-204400, [-18.197852930878, 31.932869934309, 15.438294826279], [-0.0019117272501813, -0.0019146495909842, -19657304369835e-18]],
      [-175200, [8.528924039997, -29.618422200048, -11.805400994258], [0.0031034370787005, 5139363329243e-16, -77293066202546e-17]],
      [-146e3, [40.94685725864, 25.904973592021, -4.256336240499], [-83652705194051e-17, 0.0018129497136404, 8156422827306e-16]],
      [-116800, [-12.326958895325, 36.881883446292, 15.217158258711], [-0.0021166103705038, -0.001481442003599, 17401209844705e-17]],
      [-87600, [-0.633258375909, -30.018759794709, -9.17193287495], [0.0032016994581737, -25279858672148e-17, -0.0010411088271861]],
      [-58400, [42.936048423883, 20.344685584452, -6.588027007912], [-50525450073192e-17, 0.0019910074335507, 77440196540269e-17]],
      [-29200, [-5.975910552974, 40.61180995846, 14.470131723673], [-0.0022184202156107, -0.0010562361130164, 33652250216211e-17]],
      [0, [-9.875369580774, -27.978926224737, -5.753711824704], [0.0030287533248818, -0.0011276087003636, -0.0012651326732361]],
      [29200, [43.958831986165, 14.214147973292, -8.808306227163], [-14717608981871e-17, 0.0021404187242141, 71486567806614e-17]],
      [58400, [0.67813676352, 43.094461639362, 13.243238780721], [-0.0022358226110718, -63233636090933e-17, 47664798895648e-17]],
      [87600, [-18.282602096834, -23.30503958666, -1.766620508028], [0.0025567245263557, -0.0019902940754171, -0.0013943491701082]],
      [116800, [43.873338744526, 7.700705617215, -10.814273666425], [23174803055677e-17, 0.0022402163127924, 62988756452032e-17]],
      [146e3, [7.392949027906, 44.382678951534, 11.629500214854], [-0.002193281545383, -21751799585364e-17, 59556516201114e-17]],
      [175200, [-24.981690229261, -16.204012851426, 2.466457544298], [0.001819398914958, -0.0026765419531201, -0.0013848283502247]],
      [204400, [42.530187039511, 0.845935508021, -12.554907527683], [65059779150669e-17, 0.0022725657282262, 51133743202822e-17]],
      [233600, [13.999526486822, 44.462363044894, 9.669418486465], [-0.0021079296569252, 17533423831993e-17, 69128485798076e-17]],
      [262800, [-29.184024803031, -7.371243995762, 6.493275957928], [93581363109681e-17, -0.0030610357109184, -0.0012364201089345]],
      [292e3, [39.831980671753, -6.078405766765, -13.909815358656], [0.0011117769689167, 0.0022362097830152, 36230548231153e-17]],
      [321200, [20.294955108476, 43.417190420251, 7.450091985932], [-0.0019742157451535, 53102050468554e-17, 75938408813008e-17]],
      [350400, [-30.66999230216, 2.318743558955, 9.973480913858], [45605107450676e-18, -0.0031308219926928, -99066533301924e-17]],
      [379600, [35.626122155983, -12.897647509224, -14.777586508444], [0.0016015684949743, 0.0021171931182284, 18002516202204e-17]],
      [408800, [26.133186148561, 41.232139187599, 5.00640132622], [-0.0017857704419579, 86046232702817e-17, 80614690298954e-17]],
      [438e3, [-29.57674022923, 11.863535943587, 12.631323039872], [-72292830060955e-17, -0.0029587820140709, -708242964503e-15]],
      [467200, [29.910805787391, -19.159019294, -15.013363865194], [0.0020871080437997, 0.0018848372554514, -38528655083926e-18]],
      [496400, [31.375957451819, 38.050372720763, 2.433138343754], [-0.0015546055556611, 0.0011699815465629, 83565439266001e-17]],
      [525600, [-26.360071336928, 20.662505904952, 14.414696258958], [-0.0013142373118349, -0.0026236647854842, -42542017598193e-17]],
      [554800, [22.599441488648, -24.508879898306, -14.484045731468], [0.0025454108304806, 0.0014917058755191, -30243665086079e-17]],
      [584e3, [35.877864013014, 33.894226366071, -0.224524636277], [-0.0012941245730845, 0.0014560427668319, 84762160640137e-17]],
      [613200, [-21.538149762417, 28.204068269761, 15.321973799534], [-0.001731211740901, -0.0021939631314577, -1631691327518e-16]],
      [642400, [13.971521374415, -28.339941764789, -13.083792871886], [0.0029334630526035, 91860931752944e-17, -59939422488627e-17]],
      [671600, [39.526942044143, 28.93989736011, -2.872799527539], [-0.0010068481658095, 0.001702113288809, 83578230511981e-17]],
      [700800, [-15.576200701394, 34.399412961275, 15.466033737854], [-0.0020098814612884, -0.0017191109825989, 70414782780416e-18]],
      [73e4, [4.24325283709, -30.118201690825, -10.707441231349], [0.0031725847067411, 1609846120227e-16, -90672150593868e-17]]
    ];
    TerseVector = class {
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      clone() {
        return new TerseVector(this.x, this.y, this.z);
      }
      ToAstroVector(t) {
        return new Vector(this.x, this.y, this.z, t);
      }
      static zero() {
        return new TerseVector(0, 0, 0);
      }
      quadrature() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }
      add(other) {
        return new TerseVector(this.x + other.x, this.y + other.y, this.z + other.z);
      }
      sub(other) {
        return new TerseVector(this.x - other.x, this.y - other.y, this.z - other.z);
      }
      incr(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
      }
      decr(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
      }
      mul(scalar) {
        return new TerseVector(scalar * this.x, scalar * this.y, scalar * this.z);
      }
      div(scalar) {
        return new TerseVector(this.x / scalar, this.y / scalar, this.z / scalar);
      }
      mean(other) {
        return new TerseVector((this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
      }
      neg() {
        return new TerseVector(-this.x, -this.y, -this.z);
      }
    };
    __name(TerseVector, "TerseVector");
    body_state_t = class {
      constructor(tt, r2, v) {
        this.tt = tt;
        this.r = r2;
        this.v = v;
      }
      clone() {
        return new body_state_t(this.tt, this.r, this.v);
      }
      sub(other) {
        return new body_state_t(this.tt, this.r.sub(other.r), this.v.sub(other.v));
      }
    };
    __name(body_state_t, "body_state_t");
    __name(BodyStateFromTable, "BodyStateFromTable");
    __name(AdjustBarycenterPosVel, "AdjustBarycenterPosVel");
    __name(AccelerationIncrement, "AccelerationIncrement");
    major_bodies_t = class {
      constructor(tt) {
        let ssb = new body_state_t(tt, new TerseVector(0, 0, 0), new TerseVector(0, 0, 0));
        this.Jupiter = AdjustBarycenterPosVel(ssb, tt, Body.Jupiter, JUPITER_GM);
        this.Saturn = AdjustBarycenterPosVel(ssb, tt, Body.Saturn, SATURN_GM);
        this.Uranus = AdjustBarycenterPosVel(ssb, tt, Body.Uranus, URANUS_GM);
        this.Neptune = AdjustBarycenterPosVel(ssb, tt, Body.Neptune, NEPTUNE_GM);
        this.Jupiter.r.decr(ssb.r);
        this.Jupiter.v.decr(ssb.v);
        this.Saturn.r.decr(ssb.r);
        this.Saturn.v.decr(ssb.v);
        this.Uranus.r.decr(ssb.r);
        this.Uranus.v.decr(ssb.v);
        this.Neptune.r.decr(ssb.r);
        this.Neptune.v.decr(ssb.v);
        this.Sun = new body_state_t(tt, ssb.r.mul(-1), ssb.v.mul(-1));
      }
      Acceleration(pos) {
        let acc = AccelerationIncrement(pos, SUN_GM, this.Sun.r);
        acc.incr(AccelerationIncrement(pos, JUPITER_GM, this.Jupiter.r));
        acc.incr(AccelerationIncrement(pos, SATURN_GM, this.Saturn.r));
        acc.incr(AccelerationIncrement(pos, URANUS_GM, this.Uranus.r));
        acc.incr(AccelerationIncrement(pos, NEPTUNE_GM, this.Neptune.r));
        return acc;
      }
    };
    __name(major_bodies_t, "major_bodies_t");
    body_grav_calc_t = class {
      constructor(tt, r2, v, a) {
        this.tt = tt;
        this.r = r2;
        this.v = v;
        this.a = a;
      }
      clone() {
        return new body_grav_calc_t(this.tt, this.r.clone(), this.v.clone(), this.a.clone());
      }
    };
    __name(body_grav_calc_t, "body_grav_calc_t");
    grav_sim_t = class {
      constructor(bary, grav) {
        this.bary = bary;
        this.grav = grav;
      }
    };
    __name(grav_sim_t, "grav_sim_t");
    __name(UpdatePosition, "UpdatePosition");
    __name(UpdateVelocity, "UpdateVelocity");
    __name(GravSim, "GravSim");
    pluto_cache = [];
    __name(ClampIndex, "ClampIndex");
    __name(GravFromState, "GravFromState");
    __name(GetSegment, "GetSegment");
    __name(CalcPlutoOneWay, "CalcPlutoOneWay");
    __name(CalcPluto, "CalcPluto");
    __name(HelioVector, "HelioVector");
    __name(CorrectLightTravel, "CorrectLightTravel");
    BodyPosition = class {
      constructor(observerBody, targetBody, aberration, observerPos) {
        this.observerBody = observerBody;
        this.targetBody = targetBody;
        this.aberration = aberration;
        this.observerPos = observerPos;
      }
      Position(time) {
        if (this.aberration) {
          this.observerPos = HelioVector(this.observerBody, time);
        }
        const targetPos = HelioVector(this.targetBody, time);
        return new Vector(targetPos.x - this.observerPos.x, targetPos.y - this.observerPos.y, targetPos.z - this.observerPos.z, time);
      }
    };
    __name(BodyPosition, "BodyPosition");
    __name(BackdatePosition, "BackdatePosition");
    __name(GeoVector, "GeoVector");
    __name(QuadInterp, "QuadInterp");
    __name(Search, "Search");
    __name(LongitudeOffset, "LongitudeOffset");
    __name(NormalizeLongitude, "NormalizeLongitude");
    __name(SearchSunLongitude, "SearchSunLongitude");
    __name(PairLongitude, "PairLongitude");
    __name(MoonPhase, "MoonPhase");
    __name(SearchMoonPhase, "SearchMoonPhase");
    MoonQuarter = class {
      constructor(quarter, time) {
        this.quarter = quarter;
        this.time = time;
      }
    };
    __name(MoonQuarter, "MoonQuarter");
    __name(SearchMoonQuarter, "SearchMoonQuarter");
    __name(NextMoonQuarter, "NextMoonQuarter");
    SeasonInfo = class {
      constructor(mar_equinox, jun_solstice, sep_equinox, dec_solstice) {
        this.mar_equinox = mar_equinox;
        this.jun_solstice = jun_solstice;
        this.sep_equinox = sep_equinox;
        this.dec_solstice = dec_solstice;
      }
    };
    __name(SeasonInfo, "SeasonInfo");
    __name(Seasons, "Seasons");
    (function(ApsisKind2) {
      ApsisKind2[ApsisKind2["Pericenter"] = 0] = "Pericenter";
      ApsisKind2[ApsisKind2["Apocenter"] = 1] = "Apocenter";
    })(ApsisKind || (ApsisKind = {}));
    __name(VectorFromSphere, "VectorFromSphere");
    (function(EclipseKind2) {
      EclipseKind2["Penumbral"] = "penumbral";
      EclipseKind2["Partial"] = "partial";
      EclipseKind2["Annular"] = "annular";
      EclipseKind2["Total"] = "total";
    })(EclipseKind || (EclipseKind = {}));
    (function(NodeEventKind2) {
      NodeEventKind2[NodeEventKind2["Invalid"] = 0] = "Invalid";
      NodeEventKind2[NodeEventKind2["Ascending"] = 1] = "Ascending";
      NodeEventKind2[NodeEventKind2["Descending"] = -1] = "Descending";
    })(NodeEventKind || (NodeEventKind = {}));
    __name(formatDate, "formatDate");
    __name(getFullMoonDates, "getFullMoonDates");
    __name(getSolarEvents, "getSolarEvents");
    Calendar = /* @__PURE__ */ __name(({
      year = (/* @__PURE__ */ new Date()).getFullYear(),
      forPrint = false,
      printColumns = 3,
      totalMonths = 15,
      size = "letter",
      orientation = "portrait",
      rows = 4,
      columns = 3,
      header = true,
      testing = false
    }) => {
      const [windowWidth, setWindowWidth] = reactExports.useState(0);
      const [visibleMonths, setVisibleMonths] = reactExports.useState(14);
      const [columnCount, setColumnCount] = reactExports.useState(1);
      const showYearHeader = header;
      const baseYear = year;
      const nextYear = baseYear + 1;
      const [fullMoonDates, setFullMoonDates] = reactExports.useState([]);
      const [solarEvents, setSolarEvents] = reactExports.useState({});
      reactExports.useEffect(() => {
        console.log("Calendar: Starting astronomical calculations for year:", baseYear);
        async function fetchAstronomicalData() {
          try {
            const moons = await getFullMoonDates(baseYear, nextYear);
            console.log("Calendar: Received full moon dates:", moons);
            setFullMoonDates(moons);
            const events = await getSolarEvents(baseYear, nextYear);
            console.log("Calendar: Received solar events:", events);
            const eventMap = {};
            events.forEach((date) => {
              const month = parseInt(date.split("-")[1]);
              const type = month === 3 || month === 9 ? "equinox" : "solstice";
              console.log(`Calendar: Adding ${type} event for ${date}`);
              eventMap[date] = type;
            });
            console.log("Calendar: Final solar events map:", eventMap);
            setSolarEvents(eventMap);
          } catch (error2) {
            console.error("Error fetching astronomical data:", error2);
          }
        }
        __name(fetchAstronomicalData, "fetchAstronomicalData");
        fetchAstronomicalData();
      }, [baseYear, nextYear]);
      reactExports.useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = /* @__PURE__ */ __name(() => {
          if (forPrint) {
            const defaultMonths = printColumns === 4 ? 16 : 15;
            const months3 = totalMonths ? Math.max(12, totalMonths) : defaultMonths;
            setColumnCount(printColumns);
            setVisibleMonths(months3);
            return;
          }
          const width = window.innerWidth;
          let columns2 = 1;
          let months2 = 14;
          if (width >= 1200) {
            columns2 = 4;
            months2 = 16;
          } else if (width >= 900) {
            columns2 = 3;
            months2 = 15;
          } else if (width >= 600) {
            columns2 = 2;
            months2 = 14;
          }
          setWindowWidth(width);
          setColumnCount(columns2);
          setVisibleMonths(months2);
        }, "handleResize");
        handleResize();
        if (!forPrint) {
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
        }
      }, [forPrint, printColumns, totalMonths]);
      const months = Array.from({ length: 18 }, (_, i) => {
        const monthIndex = i % 12;
        const yearOffset = Math.floor(i / 12);
        const year2 = baseYear + yearOffset;
        console.log(`Generating month ${monthIndex + 1} for year ${year2}`);
        return {
          month: monthIndex,
          year: year2
        };
      });
      const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
      const getMonthData = /* @__PURE__ */ __name((month, year2) => {
        console.log(`Getting data for month ${month + 1}, year ${year2}`);
        const firstDay = new Date(year2, month, 1);
        const lastDay = new Date(year2, month + 1, 0);
        const previousMonthLastDay = new Date(year2, month, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const previousMonthDays = previousMonthLastDay.getDate();
        const monthData = [];
        let currentWeek = [];
        for (let i = 0; i < startingDay; i++) {
          currentWeek.push({
            date: previousMonthDays - startingDay + i + 1,
            currentMonth: false,
            fullMoon: false
          });
        }
        for (let day = 1; day <= daysInMonth; day++) {
          const dateString = `${year2}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isFullMoon = fullMoonDates.includes(dateString);
          const specialDay = solarEvents[dateString];
          if (isFullMoon) {
            console.log(`Calendar: Found full moon on ${dateString}`);
          }
          if (specialDay) {
            console.log(`Calendar: Found ${specialDay} on ${dateString}`);
          }
          currentWeek.push({
            date: day,
            currentMonth: true,
            fullMoon: isFullMoon,
            isSpecialDay: specialDay
          });
          if (currentWeek.length === 7) {
            monthData.push(currentWeek);
            currentWeek = [];
          }
        }
        let nextMonthDay = 1;
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: nextMonthDay++,
            currentMonth: false,
            fullMoon: false
          });
        }
        if (currentWeek.length > 0) {
          monthData.push(currentWeek);
        }
        return monthData;
      }, "getMonthData");
      const calendarStyle = {
        "--print-columns": forPrint ? printColumns : columnCount
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `calendar ${forPrint ? "print" : ""}`, style: calendarStyle, children: [
        showYearHeader && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: baseYear }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-grid", children: months.slice(0, visibleMonths).map(({ month, year: year2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "month", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "month-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: new Date(year2, month).toLocaleString("default", { month: "long" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "week-days", children: weekDays.map((day, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "week-day", children: day }, index)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "month-grid", children: getMonthData(month, year2).flat().map((day, dayIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `calendar-day${!day.currentMonth ? " other-month" : ""}`,
              children: [
                !day.fullMoon && !day.isSpecialDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "date", children: day.date }),
                day.fullMoon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "day-marker-moon-full" }),
                day.isSpecialDay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `day-marker-${day.isSpecialDay}` })
              ]
            },
            dayIndex
          )) })
        ] }, `${year2}-${month}`)) })
      ] });
    }, "Calendar");
    $$Astro = createAstro();
    $$ = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
      Astro2.self = $$;
      const { path } = Astro2.params;
      const segments = path?.split("/") || [];
      const url = new URL(Astro2.request.url);
      const searchParams = Object.fromEntries(url.searchParams);
      if (path === "favicon.ico") {
        return new Response(null, { status: 204 });
      }
      if (!segments.length || segments[0] === "") {
        return Astro2.redirect(`/${(/* @__PURE__ */ new Date()).getFullYear()}`);
      }
      let [year, size, orientation, lastSegment] = segments;
      const yearNum = parseInt(year);
      if (isNaN(yearNum)) {
        throw new Error(`Invalid year: ${year}`);
      }
      const showHeader = searchParams.header !== "false";
      const isTesting = searchParams.test === "true";
      return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calendar ${year}</title>${renderHead()}</head> <body> <div style="padding: 20px;"> <h1>Calendar ${year}</h1> <div id="error-display" style="display: none; color: red; padding: 1em; margin: 1em; border: 1px solid red;"></div> <div id="root"> ${renderComponent($$result, "Calendar", Calendar, { "client:visible": true, "year": yearNum, "header": showHeader, "testing": isTesting, "client:component-hydration": "visible", "client:component-path": "/Users/todd/Github/CascadeProjects/calendar-thing/src/components/Calendar", "client:component-export": "Calendar" })} </div> </div> ${renderScript($$result, "/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
    }, "/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro", void 0);
    $$file = "/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro";
    $$url = "/[...path]";
    _page2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$,
      file: $$file,
      url: $$url
    }, Symbol.toStringTag, { value: "Module" }));
    page2 = /* @__PURE__ */ __name(() => _page2, "page");
  }
});

// .wrangler/tmp/pages-9XcfGz/_astro-internal_middleware.mjs
var astro_internal_middleware_exports = {};
__export(astro_internal_middleware_exports, {
  onRequest: () => onRequest
});
var onRequest$1, onRequest;
var init_astro_internal_middleware = __esm({
  ".wrangler/tmp/pages-9XcfGz/_astro-internal_middleware.mjs"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_astro_designed_error_pages_ooUQbXF3();
    init_server_BXn8oDq3();
    init_index_CdAnqvIQ();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    onRequest$1 = /* @__PURE__ */ __name((context, next) => {
      if (context.isPrerendered) {
        context.locals.runtime ??= {
          env: process.env
        };
      }
      return next();
    }, "onRequest$1");
    onRequest = sequence(
      onRequest$1
    );
  }
});

// .wrangler/tmp/bundle-mRILPr/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-mRILPr/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/pages-9XcfGz/8nn2ytkxe4c.js
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/pages-9XcfGz/bundledWorker-0.04413021625900693.mjs
init_checked_fetch();
init_modules_watch_stub();
init_astro_renderers_O4SP2Us9();

// .wrangler/tmp/pages-9XcfGz/chunks/_@astrojs-ssr-adapter_DGuYgNaH.mjs
init_checked_fetch();
init_modules_watch_stub();
init_index_CdAnqvIQ();
init_server_BXn8oDq3();
init_astro_designed_error_pages_ooUQbXF3();

// .wrangler/tmp/pages-9XcfGz/chunks/noop-middleware_DP_6rnQF.mjs
init_checked_fetch();
init_modules_watch_stub();
init_server_BXn8oDq3();
globalThis.process ??= {};
globalThis.process.env ??= {};
var NOOP_MIDDLEWARE_FN = /* @__PURE__ */ __name(async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
}, "NOOP_MIDDLEWARE_FN");

// .wrangler/tmp/pages-9XcfGz/chunks/_@astrojs-ssr-adapter_DGuYgNaH.mjs
globalThis.process ??= {};
globalThis.process.env ??= {};
function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n)
    return (_, next) => next();
  const payload = {
    ...i18n,
    trailingSlash,
    base,
    format
  };
  const _redirectToDefaultLocale = redirectToDefaultLocale(payload);
  const _noFoundForNonLocaleRoute = notFound(payload);
  const _requestHasLocale = requestHasLocale(payload.locales);
  const _redirectToFallback = redirectToFallback(payload);
  const prefixAlways = /* @__PURE__ */ __name((context, response) => {
    const url = context.url;
    if (url.pathname === base + "/" || url.pathname === base) {
      return _redirectToDefaultLocale(context);
    } else if (!_requestHasLocale(context)) {
      return _noFoundForNonLocaleRoute(context, response);
    }
    return void 0;
  }, "prefixAlways");
  const prefixOtherLocales = /* @__PURE__ */ __name((context, response) => {
    let pathnameContainsDefaultLocale = false;
    const url = context.url;
    for (const segment of url.pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(i18n.defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return _noFoundForNonLocaleRoute(context);
    }
    return void 0;
  }, "prefixOtherLocales");
  return async (context, next) => {
    const response = await next();
    const type = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (type !== "page" && type !== "fallback") {
      return response;
    }
    if (requestIs404Or500(context.request, base)) {
      return response;
    }
    if (isRequestServerIsland(context.request, base)) {
      return response;
    }
    const { currentLocale } = context;
    switch (i18n.strategy) {
      case "manual": {
        return response;
      }
      case "domains-prefix-other-locales": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixOtherLocales(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        const result = prefixOtherLocales(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = _noFoundForNonLocaleRoute(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        const result = _noFoundForNonLocaleRoute(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "pathname-prefix-always": {
        const result = prefixAlways(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlways(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    return _redirectToFallback(context, response);
  };
}
__name(createI18nMiddleware, "createI18nMiddleware");
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
__name(localeHasntDomain, "localeHasntDomain");
var FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (request.method === "GET") {
      return next();
    }
    const sameOrigin = (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") === url.origin;
    const hasContentType = request.headers.has("content-type");
    if (hasContentType) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !sameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!sameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
__name(createOriginCheckMiddleware, "createOriginCheckMiddleware");
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
__name(hasFormLikeHeader, "hasFormLikeHeader");
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.hrefRoot);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
__name(createDefaultRoutes, "createDefaultRoutes");
var Pipeline = class {
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, serverLike, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2)) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.serverLike = serverLike;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat)
      );
    }
  }
  internalMiddleware;
  resolvedMiddleware = void 0;
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    } else if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest2 = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      if (this.manifest.checkOrigin) {
        this.resolvedMiddleware = sequence(createOriginCheckMiddleware(), onRequest2);
      } else {
        this.resolvedMiddleware = onRequest2;
      }
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
};
__name(Pipeline, "Pipeline");
var RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
var RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next(),
  renderers: []
};
var dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
var levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
__name(log, "log");
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
__name(isLogLevelEnabled, "isLogLevelEnabled");
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
__name(info, "info");
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
__name(warn, "warn");
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
__name(error, "error");
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
__name(debug, "debug");
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
__name(getEventPrefix, "getEventPrefix");
var Logger = class {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
};
__name(Logger, "Logger");
var AstroIntegrationLogger = class {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
};
__name(AstroIntegrationLogger, "AstroIntegrationLogger");
var consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.log;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  if (!assetsPrefix)
    return "";
  if (typeof assetsPrefix === "string")
    return assetsPrefix;
  const dotLessFileExtension = fileExtension2.slice(1);
  if (assetsPrefix[dotLessFileExtension]) {
    return assetsPrefix[dotLessFileExtension];
  }
  return assetsPrefix.fallback;
}
__name(getAssetsPrefix, "getAssetsPrefix");
function createAssetLink(href, base, assetsPrefix) {
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(href), assetsPrefix);
    return joinPaths(pf, slash(href));
  } else if (base) {
    return prependForwardSlash(joinPaths(base, slash(href)));
  } else {
    return href;
  }
}
__name(createAssetLink, "createAssetLink");
function createStylesheetElement(stylesheet, base, assetsPrefix) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
__name(createStylesheetElement, "createStylesheetElement");
function createStylesheetElementSet(stylesheets, base, assetsPrefix) {
  return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix)));
}
__name(createStylesheetElementSet, "createStylesheetElementSet");
function createModuleScriptElement(script, base, assetsPrefix) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
__name(createModuleScriptElement, "createModuleScriptElement");
function createModuleScriptElementWithSrc(src, base, assetsPrefix) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
__name(createModuleScriptElementWithSrc, "createModuleScriptElementWithSrc");
function redirectTemplate({ status, location, from }) {
  const delay = status === 302 ? 2 : 0;
  return `<!doctype html>
<title>Redirecting to: ${location}</title>
<meta http-equiv="refresh" content="${delay};url=${location}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${location}">
<body>
	<a href="${location}">Redirecting ${from ? `from <code>${from}</code> ` : ""}to <code>${location}</code></a>
</body>`;
}
__name(redirectTemplate, "redirectTemplate");
var AppPipeline = class extends Pipeline {
  #manifestData;
  static create(manifestData, {
    logger,
    manifest: manifest2,
    runtimeMode,
    renderers: renderers2,
    resolve,
    serverLike,
    streaming,
    defaultRoutes
  }) {
    const pipeline = new AppPipeline(
      logger,
      manifest2,
      runtimeMode,
      renderers2,
      resolve,
      serverLike,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      defaultRoutes
    );
    pipeline.#manifestData = manifestData;
    return pipeline;
  }
  headElements(routeData) {
    const routeInfo = this.manifest.routes.find((route) => route.routeData === routeData);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? []);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r2) => r2.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance),
          renderers: []
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
};
__name(AppPipeline, "AppPipeline");
var _manifest, _manifestData, _logger, _baseWithoutTrailingSlash, _pipeline, _adapterLogger, _renderOptionsDeprecationWarningShown, _createPipeline, createPipeline_fn, _getPathnameFromRequest, getPathnameFromRequest_fn, _computePathnameFromDomain, computePathnameFromDomain_fn, _redirectTrailingSlash, redirectTrailingSlash_fn, _renderError, renderError_fn, _mergeResponses, mergeResponses_fn, _getDefaultStatusCode, getDefaultStatusCode_fn;
var _App = class {
  constructor(manifest2, streaming = true) {
    /**
     * Creates a pipeline by reading the stored manifest
     *
     * @param manifestData
     * @param streaming
     * @private
     */
    __privateAdd(this, _createPipeline);
    /**
     * It removes the base from the request URL, prepends it with a forward slash and attempts to decoded it.
     *
     * If the decoding fails, it logs the error and return the pathname as is.
     * @param request
     * @private
     */
    __privateAdd(this, _getPathnameFromRequest);
    __privateAdd(this, _computePathnameFromDomain);
    __privateAdd(this, _redirectTrailingSlash);
    /**
     * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
     * This also handles pre-rendered /404 or /500 routes
     */
    __privateAdd(this, _renderError);
    __privateAdd(this, _mergeResponses);
    __privateAdd(this, _getDefaultStatusCode);
    __privateAdd(this, _manifest, void 0);
    __privateAdd(this, _manifestData, void 0);
    __privateAdd(this, _logger, new Logger({
      dest: consoleLogDestination,
      level: "info"
    }));
    __privateAdd(this, _baseWithoutTrailingSlash, void 0);
    __privateAdd(this, _pipeline, void 0);
    __privateAdd(this, _adapterLogger, void 0);
    __privateAdd(this, _renderOptionsDeprecationWarningShown, false);
    __privateSet(this, _manifest, manifest2);
    __privateSet(this, _manifestData, {
      routes: manifest2.routes.map((route) => route.routeData)
    });
    ensure404Route(__privateGet(this, _manifestData));
    __privateSet(this, _baseWithoutTrailingSlash, removeTrailingForwardSlash(__privateGet(this, _manifest).base));
    __privateSet(this, _pipeline, __privateMethod(this, _createPipeline, createPipeline_fn).call(this, __privateGet(this, _manifestData), streaming));
    __privateSet(this, _adapterLogger, new AstroIntegrationLogger(
      __privateGet(this, _logger).options,
      __privateGet(this, _manifest).adapterName
    ));
  }
  getAdapterLogger() {
    return __privateGet(this, _adapterLogger);
  }
  set setManifestData(newManifestData) {
    __privateSet(this, _manifestData, newManifestData);
  }
  removeBase(pathname) {
    if (pathname.startsWith(__privateGet(this, _manifest).base)) {
      return pathname.slice(__privateGet(this, _baseWithoutTrailingSlash).length + 1);
    }
    return pathname;
  }
  match(request) {
    const url = new URL(request.url);
    if (__privateGet(this, _manifest).assets.has(url.pathname))
      return void 0;
    let pathname = __privateMethod(this, _computePathnameFromDomain, computePathnameFromDomain_fn).call(this, request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    let routeData = matchRoute(pathname, __privateGet(this, _manifestData));
    if (!routeData || routeData.prerender)
      return void 0;
    return routeData;
  }
  async render(request, renderOptions) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    const url = new URL(request.url);
    const redirect = __privateMethod(this, _redirectTrailingSlash, redirectTrailingSlash_fn).call(this, url.pathname);
    if (redirect !== url.pathname) {
      const status = request.method === "GET" ? 301 : 308;
      return new Response(redirectTemplate({ status, location: redirect, from: request.url }), {
        status,
        headers: {
          location: redirect + url.search
        }
      });
    }
    addCookieHeader = renderOptions?.addCookieHeader;
    clientAddress = renderOptions?.clientAddress ?? Reflect.get(request, clientAddressSymbol);
    routeData = renderOptions?.routeData;
    locals = renderOptions?.locals;
    if (routeData) {
      __privateGet(this, _logger).debug(
        "router",
        "The adapter " + __privateGet(this, _manifest).adapterName + " provided a custom RouteData for ",
        request.url
      );
      __privateGet(this, _logger).debug("router", "RouteData:\n" + routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        __privateGet(this, _logger).error(null, error2.stack);
        return __privateMethod(this, _renderError, renderError_fn).call(this, request, { status: 500, error: error2, clientAddress });
      }
    }
    if (!routeData) {
      routeData = this.match(request);
      __privateGet(this, _logger).debug("router", "Astro matched the following route for " + request.url);
      __privateGet(this, _logger).debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      __privateGet(this, _logger).debug("router", "Astro hasn't found routes that match " + request.url);
      __privateGet(this, _logger).debug("router", "Here's the available routes:\n", __privateGet(this, _manifestData));
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, { locals, status: 404, clientAddress });
    }
    const pathname = __privateMethod(this, _getPathnameFromRequest, getPathnameFromRequest_fn).call(this, request);
    const defaultStatus = __privateMethod(this, _getDefaultStatusCode, getDefaultStatusCode_fn).call(this, routeData, pathname);
    let response;
    let session;
    try {
      const mod = await __privateGet(this, _pipeline).getModuleForRoute(routeData);
      const renderContext = await RenderContext.create({
        pipeline: __privateGet(this, _pipeline),
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus,
        clientAddress
      });
      session = renderContext.session;
      response = await renderContext.render(await mod.page());
    } catch (err) {
      __privateGet(this, _logger).error(null, err.stack || err.message || String(err));
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, { locals, status: 500, error: err, clientAddress });
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
        locals,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        clientAddress
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of _App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
};
var App = _App;
__name(App, "App");
_manifest = new WeakMap();
_manifestData = new WeakMap();
_logger = new WeakMap();
_baseWithoutTrailingSlash = new WeakMap();
_pipeline = new WeakMap();
_adapterLogger = new WeakMap();
_renderOptionsDeprecationWarningShown = new WeakMap();
_createPipeline = new WeakSet();
createPipeline_fn = /* @__PURE__ */ __name(function(manifestData, streaming = false) {
  return AppPipeline.create(manifestData, {
    logger: __privateGet(this, _logger),
    manifest: __privateGet(this, _manifest),
    runtimeMode: "production",
    renderers: __privateGet(this, _manifest).renderers,
    defaultRoutes: createDefaultRoutes(__privateGet(this, _manifest)),
    resolve: async (specifier) => {
      if (!(specifier in __privateGet(this, _manifest).entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = __privateGet(this, _manifest).entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, __privateGet(this, _manifest).base, __privateGet(this, _manifest).assetsPrefix);
      }
    },
    serverLike: true,
    streaming
  });
}, "#createPipeline");
_getPathnameFromRequest = new WeakSet();
getPathnameFromRequest_fn = /* @__PURE__ */ __name(function(request) {
  const url = new URL(request.url);
  const pathname = prependForwardSlash(this.removeBase(url.pathname));
  try {
    return decodeURI(pathname);
  } catch (e) {
    this.getAdapterLogger().error(e.toString());
    return pathname;
  }
}, "#getPathnameFromRequest");
_computePathnameFromDomain = new WeakSet();
computePathnameFromDomain_fn = /* @__PURE__ */ __name(function(request) {
  let pathname = void 0;
  const url = new URL(request.url);
  if (__privateGet(this, _manifest).i18n && (__privateGet(this, _manifest).i18n.strategy === "domains-prefix-always" || __privateGet(this, _manifest).i18n.strategy === "domains-prefix-other-locales" || __privateGet(this, _manifest).i18n.strategy === "domains-prefix-always-no-redirect")) {
    let host = request.headers.get("X-Forwarded-Host");
    let protocol = request.headers.get("X-Forwarded-Proto");
    if (protocol) {
      protocol = protocol + ":";
    } else {
      protocol = url.protocol;
    }
    if (!host) {
      host = request.headers.get("Host");
    }
    if (host && protocol) {
      host = host.split(":")[0];
      try {
        let locale;
        const hostAsUrl = new URL(`${protocol}//${host}`);
        for (const [domainKey, localeValue] of Object.entries(
          __privateGet(this, _manifest).i18n.domainLookupTable
        )) {
          const domainKeyAsUrl = new URL(domainKey);
          if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
            locale = localeValue;
            break;
          }
        }
        if (locale) {
          pathname = prependForwardSlash(
            joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
          );
          if (url.pathname.endsWith("/")) {
            pathname = appendForwardSlash(pathname);
          }
        }
      } catch (e) {
        __privateGet(this, _logger).error(
          "router",
          `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
        );
        __privateGet(this, _logger).error("router", `Error: ${e}`);
      }
    }
  }
  return pathname;
}, "#computePathnameFromDomain");
_redirectTrailingSlash = new WeakSet();
redirectTrailingSlash_fn = /* @__PURE__ */ __name(function(pathname) {
  const { trailingSlash } = __privateGet(this, _manifest);
  if (pathname === "/" || pathname.startsWith("/_")) {
    return pathname;
  }
  const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
  if (path !== pathname) {
    return path;
  }
  if (trailingSlash === "ignore") {
    return pathname;
  }
  if (trailingSlash === "always" && !hasFileExtension(pathname)) {
    return appendForwardSlash(pathname);
  }
  if (trailingSlash === "never") {
    return removeTrailingForwardSlash(pathname);
  }
  return pathname;
}, "#redirectTrailingSlash");
_renderError = new WeakSet();
renderError_fn = /* @__PURE__ */ __name(async function(request, {
  locals,
  status,
  response: originalResponse,
  skipMiddleware = false,
  error: error2,
  clientAddress
}) {
  const errorRoutePath = `/${status}${__privateGet(this, _manifest).trailingSlash === "always" ? "/" : ""}`;
  const errorRouteData = matchRoute(errorRoutePath, __privateGet(this, _manifestData));
  const url = new URL(request.url);
  if (errorRouteData) {
    if (errorRouteData.prerender) {
      const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
      const statusURL = new URL(
        `${__privateGet(this, _baseWithoutTrailingSlash)}/${status}${maybeDotHtml}`,
        url
      );
      if (statusURL.toString() !== request.url) {
        const response2 = await fetch(statusURL.toString());
        const override = { status };
        return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse, override);
      }
    }
    const mod = await __privateGet(this, _pipeline).getModuleForRoute(errorRouteData);
    let session;
    try {
      const renderContext = await RenderContext.create({
        locals,
        pipeline: __privateGet(this, _pipeline),
        middleware: skipMiddleware ? NOOP_MIDDLEWARE_FN : void 0,
        pathname: __privateMethod(this, _getPathnameFromRequest, getPathnameFromRequest_fn).call(this, request),
        request,
        routeData: errorRouteData,
        status,
        props: { error: error2 },
        clientAddress
      });
      session = renderContext.session;
      const response2 = await renderContext.render(await mod.page());
      return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse);
    } catch {
      if (skipMiddleware === false) {
        return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
          locals,
          status,
          response: originalResponse,
          skipMiddleware: true,
          clientAddress
        });
      }
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
  }
  const response = __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, new Response(null, { status }), originalResponse);
  Reflect.set(response, responseSentSymbol, true);
  return response;
}, "#renderError");
_mergeResponses = new WeakSet();
mergeResponses_fn = /* @__PURE__ */ __name(function(newResponse, originalResponse, override) {
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponse.headers
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
  } catch {
  }
  const mergedHeaders = new Map([
    ...Array.from(newResponse.headers),
    ...Array.from(originalResponse.headers)
  ]);
  const newHeaders = new Headers();
  for (const [name, value] of mergedHeaders) {
    newHeaders.set(name, value);
  }
  return new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: newHeaders
  });
}, "#mergeResponses");
_getDefaultStatusCode = new WeakSet();
getDefaultStatusCode_fn = /* @__PURE__ */ __name(function(routeData, pathname) {
  if (!routeData.pattern.test(pathname)) {
    for (const fallbackRoute of routeData.fallbackRoutes) {
      if (fallbackRoute.pattern.test(pathname)) {
        return 302;
      }
    }
  }
  const route = removeTrailingForwardSlash(routeData.route);
  if (route.endsWith("/404"))
    return 404;
  if (route.endsWith("/500"))
    return 500;
  return 200;
}, "#getDefaultStatusCode");
/**
 * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
 * For example,
 * ```ts
 * for (const cookie_ of App.getSetCookieFromResponse(response)) {
 *     const cookie: string = cookie_
 * }
 * ```
 * @param response The response to read cookies from.
 * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
 */
__publicField(App, "getSetCookieFromResponse", getSetCookiesFromResponse);
function createExports(manifest2) {
  const app = new App(manifest2);
  const fetch2 = /* @__PURE__ */ __name(async (request, env, context) => {
    const { pathname } = new URL(request.url);
    if (manifest2.assets.has(pathname)) {
      return env.ASSETS.fetch(request.url.replace(/\.html$/, ""));
    }
    const routeData = app.match(request);
    if (!routeData) {
      const asset = await env.ASSETS.fetch(request.url.replace(/index.html$/, "").replace(/\.html$/, ""));
      if (asset.status !== 404) {
        return asset;
      }
    }
    Reflect.set(request, Symbol.for("astro.clientAddress"), request.headers.get("cf-connecting-ip"));
    process.env.ASTRO_STUDIO_APP_TOKEN ??= (() => {
      if (typeof env.ASTRO_STUDIO_APP_TOKEN === "string") {
        return env.ASTRO_STUDIO_APP_TOKEN;
      }
    })();
    const locals = {
      runtime: {
        env,
        cf: request.cf,
        caches,
        ctx: {
          waitUntil: (promise) => context.waitUntil(promise),
          // Currently not available: https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions
          passThroughOnException: () => {
            throw new Error("`passThroughOnException` is currently not available in Cloudflare Pages. See https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions.");
          },
          props: {}
        }
      }
    };
    const response = await app.render(request, { routeData, locals });
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  }, "fetch");
  return { default: { fetch: fetch2 } };
}
__name(createExports, "createExports");
var serverEntrypointModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createExports
}, Symbol.toStringTag, { value: "Module" }));

// .wrangler/tmp/pages-9XcfGz/manifest_BnbhDUTk.mjs
init_checked_fetch();
init_modules_watch_stub();
init_server_BXn8oDq3();
init_astro_designed_error_pages_ooUQbXF3();
globalThis.process ??= {};
globalThis.process.env ??= {};
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
__name(sanitizeParams, "sanitizeParams");
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
__name(getParameter, "getParameter");
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
__name(getSegment, "getSegment");
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
__name(getRouteGenerator, "getRouteGenerator");
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}
__name(deserializeRouteData, "deserializeRouteData");
function deserializeManifest(serializedManifest) {
  const routes2 = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes2.push({
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
    routes: routes2,
    serverIslandNameMap,
    key
  };
}
__name(deserializeManifest, "deserializeManifest");
var manifest = deserializeManifest({ "hrefRoot": "file:///Users/todd/Github/CascadeProjects/calendar-thing/", "cacheDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/node_modules/.astro/", "outDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/", "srcDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/src/", "publicDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/public/", "buildClientDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/", "buildServerDir": "file:///Users/todd/Github/CascadeProjects/calendar-thing/dist/_worker.js/", "adapterName": "@astrojs/cloudflare", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "_meta": { "trailingSlash": "never" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "endpoint", "isIndex": false, "route": "/_image", "pattern": "^\\/_image$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "params": [], "component": "node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", "pathname": "/_image", "prerender": false, "fallbackRoutes": [], "origin": "internal", "_meta": { "trailingSlash": "never" } } }, { "file": "", "links": [], "scripts": [], "styles": [{ "type": "external", "src": "/_astro/_path_.CzpO_nMZ.css" }], "routeData": { "route": "/[...path]", "isIndex": false, "type": "page", "pattern": "^(?:\\/(.*?))?$", "segments": [[{ "content": "...path", "dynamic": true, "spread": true }]], "params": ["...path"], "component": "src/pages/[...path].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "never" } } }], "base": "/", "trailingSlash": "never", "compressHTML": true, "componentMetadata": [["/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "\0astro-internal:middleware": "_astro-internal_middleware.mjs", "\0@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js": "pages/_image.astro.mjs", "\0@astro-page:src/pages/[...path]@_@astro": "pages/_---path_.astro.mjs", "\0@astrojs-ssr-virtual-entry": "index.js", "\0@astro-renderers": "renderers.mjs", "\0@astrojs-ssr-adapter": "_@astrojs-ssr-adapter.mjs", "\0@astrojs-manifest": "manifest_BnbhDUTk.mjs", "/Users/todd/Github/CascadeProjects/calendar-thing/src/components/Calendar": "_astro/Calendar.BU2XUHqA.js", "@astrojs/react/client.js": "_astro/client.DuNRtjJN.js", "/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro?astro&type=script&index=0&lang.ts": "_astro/_...path_.astro_astro_type_script_index_0_lang.C7LH_0BE.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [["/Users/todd/Github/CascadeProjects/calendar-thing/src/pages/[...path].astro?astro&type=script&index=0&lang.ts", 'console.log("Calendar props:",{year:yearNum,header:showHeader,testing:isTesting});window.addEventListener("error",r=>{console.error("Client error:",r);const e=document.getElementById("error-display");e&&(e.style.display="block",e.textContent=r.message)});']], "assets": ["/_astro/_path_.CzpO_nMZ.css", "/_astro/Calendar.BU2XUHqA.js", "/_astro/client.DuNRtjJN.js", "/_astro/index.5vR-3Izp.js", "/_worker.js/_@astrojs-ssr-adapter.mjs", "/_worker.js/_astro-internal_middleware.mjs", "/_worker.js/index.js", "/_worker.js/renderers.mjs", "/_worker.js/_astro/_path_.CzpO_nMZ.css", "/_worker.js/chunks/_@astro-renderers_O4SP2Us9.mjs", "/_worker.js/chunks/_@astrojs-ssr-adapter_DGuYgNaH.mjs", "/_worker.js/chunks/astro-designed-error-pages_ooUQbXF3.mjs", "/_worker.js/chunks/astro_Dvk599kh.mjs", "/_worker.js/chunks/index_CdAnqvIQ.mjs", "/_worker.js/chunks/noop-middleware_DP_6rnQF.mjs", "/_worker.js/pages/_---path_.astro.mjs", "/_worker.js/pages/_image.astro.mjs", "/_worker.js/chunks/astro/server_BXn8oDq3.mjs"], "buildFormat": "directory", "checkOrigin": true, "serverIslandNameMap": [], "key": "9RGBlstoXZ12NoL21Y6HZLQijczxtBctKvGc9Vw/GQo=" });
if (manifest.sessionConfig)
  manifest.sessionConfig.driverModule = null;

// .wrangler/tmp/pages-9XcfGz/bundledWorker-0.04413021625900693.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_image_astro(), image_astro_exports)), "_page0");
var _page1 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_path_astro(), path_astro_exports)), "_page1");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/[...path].astro", _page1]
]);
var _manifest2 = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: () => Promise.resolve().then(() => (init_astro_internal_middleware(), astro_internal_middleware_exports))
});
var _args = void 0;
var _exports = createExports(_manifest2);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (_start in serverEntrypointModule) {
  serverEntrypointModule[_start](_manifest2, _args);
}

// node_modules/wrangler/templates/pages-dev-util.ts
init_checked_fetch();
init_modules_watch_stub();
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-9XcfGz/8nn2ytkxe4c.js
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*"
  ]
};
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
        if (__astrojsSsrVirtualEntry.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return __astrojsSsrVirtualEntry.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-mRILPr/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-mRILPr/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  pageMap
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*! https://mths.be/cssesc v3.0.0 by @mathias */
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-server-legacy.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
    @preserve

    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
/**
 * @fileoverview Astronomy calculation library for browser scripting and Node.js.
 * @author Don Cross <cosinekitty@gmail.com>
 * @license MIT
 */
//# sourceMappingURL=8nn2ytkxe4c.js.map
