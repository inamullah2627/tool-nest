import {
  beautifyCss,
  minifyCss,
  type CssProcessingOptions,
} from "@/lib/css/processor";

type Request = {
  input: string;
  mode: "minify" | "beautify";
  options: CssProcessingOptions;
};

self.onmessage = (event: MessageEvent<Request>) => {
  try {
    const { input, mode, options } = event.data;
    const output =
      mode === "minify"
        ? minifyCss(input, options)
        : beautifyCss(input, options);
    self.postMessage({ ok: true, output });
  } catch (error) {
    self.postMessage({
      ok: false,
      error:
        error instanceof Error && error.message
          ? `CSS processing failed: ${error.message}`
          : "CSS processing failed. Check that the input is valid standard CSS.",
    });
  }
};
