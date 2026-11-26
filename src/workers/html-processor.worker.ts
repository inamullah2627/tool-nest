/// <reference lib="webworker" />

import {
  formatHtml,
  minifyHtml,
  type HtmlFormatOptions,
} from "../lib/html/processor";

type Request = {
  input: string;
  mode: "format" | "minify";
  options: HtmlFormatOptions;
};

self.onmessage = async (event: MessageEvent<Request>) => {
  try {
    const { input, mode, options } = event.data;
    const output =
      mode === "format"
        ? formatHtml(input, options)
        : await minifyHtml(input, options.preserveLineBreaks);
    self.postMessage({ ok: true, output });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : "HTML processing failed.",
    });
  }
};
