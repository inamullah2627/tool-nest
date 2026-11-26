import { describe, expect, it } from "vitest";
import {
  parseContactPreset,
  showToolSelection,
  submitContactForm,
  validateContactFields,
  type ContactFields,
} from "./contact";

const valid: ContactFields = {
  name: "Ayesha",
  email: "ayesha@example.com",
  inquiry: "general-inquiry",
  tool: "",
  subject: "Question",
  message: "How does this work?",
};

describe("contact form helpers", () => {
  it("validates required fields, email and message length", () => {
    expect(
      validateContactFields({
        ...valid,
        name: "",
        email: "bad",
        message: "x".repeat(2001),
      }),
    ).toEqual({
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Message must be 2,000 characters or fewer.",
    });
  });

  it("accepts a valid form", () => {
    expect(validateContactFields(valid)).toEqual({});
  });

  it("shows tools only for bug reports and feature requests", () => {
    expect(showToolSelection("report-a-bug")).toBe(true);
    expect(showToolSelection("feature-request")).toBe(true);
    expect(showToolSelection("suggest-a-tool")).toBe(false);
  });

  it("accepts only known inquiry and tool URL presets", () => {
    const tools = new Set(["word-counter"]);
    expect(parseContactPreset("report-a-bug", "word-counter", tools)).toEqual({
      inquiry: "report-a-bug",
      tool: "word-counter",
    });
    expect(parseContactPreset("invalid", "word-counter", tools)).toEqual({
      inquiry: "",
      tool: "",
    });
    expect(parseContactPreset("report-a-bug", "unknown", tools)).toEqual({
      inquiry: "report-a-bug",
      tool: "",
    });
  });

  it("never claims delivery while no service is configured", async () => {
    await expect(submitContactForm(valid)).resolves.toEqual({
      status: "unavailable",
      message:
        "Message delivery is not configured yet. Your information was not sent or stored.",
    });
  });
});
