export const inquiryTypes = [
  "general-inquiry",
  "suggest-a-tool",
  "report-a-bug",
  "feature-request",
  "privacy-concern",
  "business-inquiry",
  "other",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const inquiryLabels: Record<InquiryType, string> = {
  "general-inquiry": "General Inquiry",
  "suggest-a-tool": "Suggest a Tool",
  "report-a-bug": "Report a Bug",
  "feature-request": "Feature Request",
  "privacy-concern": "Privacy Concern",
  "business-inquiry": "Business Inquiry",
  other: "Other",
};

export type ContactFields = {
  name: string;
  email: string;
  inquiry: InquiryType | "";
  tool: string;
  subject: string;
  message: string;
};

export type ContactField = keyof Omit<ContactFields, "tool">;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const MESSAGE_LIMIT = 2_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function isInquiryType(value: unknown): value is InquiryType {
  return (
    typeof value === "string" && inquiryTypes.includes(value as InquiryType)
  );
}

export function validateContactFields(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(fields.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!fields.inquiry) errors.inquiry = "Please select an inquiry type.";
  if (!fields.subject.trim()) errors.subject = "Please enter a subject.";
  if (!fields.message.trim()) errors.message = "Please enter a message.";
  else if (fields.message.length > MESSAGE_LIMIT)
    errors.message = `Message must be ${MESSAGE_LIMIT.toLocaleString("en-US")} characters or fewer.`;
  return errors;
}

export function showToolSelection(inquiry: InquiryType | "") {
  return inquiry === "report-a-bug" || inquiry === "feature-request";
}

export function parseContactPreset(
  inquiry: string | string[] | undefined,
  tool: string | string[] | undefined,
  validToolSlugs: ReadonlySet<string>,
) {
  const inquiryValue = Array.isArray(inquiry) ? inquiry[0] : inquiry;
  const toolValue = Array.isArray(tool) ? tool[0] : tool;
  const validInquiry = isInquiryType(inquiryValue) ? inquiryValue : "";
  return {
    inquiry: validInquiry,
    tool:
      showToolSelection(validInquiry) &&
      toolValue &&
      validToolSlugs.has(toolValue)
        ? toolValue
        : "",
  } as const;
}

export type ContactSubmissionResult = {
  status: "unavailable";
  message: string;
};

/** Future delivery services can replace this adapter without coupling transport to the form UI. */
export async function submitContactForm(
  fields: Readonly<ContactFields>,
): Promise<ContactSubmissionResult> {
  void fields;
  return {
    status: "unavailable",
    message:
      "Message delivery is not configured yet. Your information was not sent or stored.",
  };
}
