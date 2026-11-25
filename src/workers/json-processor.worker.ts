import { processJson, type JsonProcessOptions } from "@/lib/json/processor";

self.onmessage = (
  event: MessageEvent<{ input: string; options: JsonProcessOptions }>,
) => {
  self.postMessage(processJson(event.data.input, event.data.options));
};
