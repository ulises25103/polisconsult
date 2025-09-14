import { SITE_CONFIG } from "../config.js";

export function isDebug() {
  try {
    const params = new URLSearchParams(window.location.search);
    const dbg = params.get("debug");
    if (dbg === "1" || dbg === "true") return true;
    if (dbg === "0" || dbg === "false") return false;
  } catch (_) {}

  if (typeof SITE_CONFIG?.DEBUG === "boolean") {
    return SITE_CONFIG.DEBUG;
  }

  const host = window.location?.hostname || "";
  return host === "localhost" || host === "127.0.0.1";
}

export function muteConsoleLogsInProd() {
  if (!isDebug()) {
    const noop = () => {};
    try {
      console.log = noop;
    } catch (_) {}
  }
}
