"use client";

import type { CSSProperties, FormEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";
import { tools } from "@/data/tools";
import {
  inquiryLabels,
  inquiryTypes,
  MESSAGE_LIMIT,
  showToolSelection,
  submitContactForm,
  validateContactFields,
  type ContactErrors,
  type ContactFields,
  type ContactField,
  type InquiryType,
} from "@/lib/contact/contact";

const emptyFields: ContactFields = {
  name: "",
  email: "",
  inquiry: "",
  tool: "",
  subject: "",
  message: "",
};

const purposes: Array<[IconName, string, string, string, InquiryType, string]> =
  [
    [
      "msg",
      "General Questions",
      "Have questions about ToolNest or how our tools work?",
      "Ask a Question",
      "general-inquiry",
      "#4F46E5",
    ],
    [
      "bulb",
      "Suggest a Tool",
      "Have an idea for a useful online tool? Share it with us.",
      "Suggest a Tool",
      "suggest-a-tool",
      "#9333EA",
    ],
    [
      "bug",
      "Report a Bug",
      "Found something that isn't working as expected? Help us improve it.",
      "Report an Issue",
      "report-a-bug",
      "#DC2626",
    ],
    [
      "shieldCheck",
      "Privacy Concerns",
      "Have questions about how ToolNest handles your information?",
      "Contact Us",
      "privacy-concern",
      "#059669",
    ],
  ];

const faqs = [
  [
    "Is ToolNest free to use?",
    "Yes. ToolNest is free to use, and no subscription is required.",
  ],
  [
    "Do I need an account to use ToolNest?",
    "No. You can use the tools without creating an account.",
  ],
  [
    "How can I suggest a new tool?",
    "Choose Suggest a Tool as the inquiry type and describe what the tool should do and who it would help.",
  ],
  [
    "How do I report a problem with a tool?",
    "Choose Report a Bug, select the relevant tool and describe what happened, what you expected and the browser or device you used.",
  ],
  [
    "Does ToolNest store contact information?",
    "No. Message delivery is not configured, so this form currently sends and stores nothing.",
  ],
  [
    "Can I request a feature for an existing tool?",
    "Yes. Choose Feature Request, select the tool and describe the improvement you have in mind.",
  ],
  [
    "How can I ask about privacy?",
    "Choose Privacy Concern and describe your question without including passwords or other sensitive details.",
  ],
] as const;

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <div className="contact-error" id={id}>
      {error && (
        <>
          <Icon name="alert" size={14} />
          {error}
        </>
      )}
    </div>
  );
}

export function ContactPage({
  initialInquiry,
  initialTool,
}: {
  initialInquiry: InquiryType | "";
  initialTool: string;
}) {
  const [fields, setFields] = useState<ContactFields>({
    ...emptyFields,
    inquiry: initialInquiry,
    tool: initialTool,
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const formCard = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  const update = (key: keyof ContactFields, value: string) => {
    setFields((current) => {
      const next = { ...current, [key]: value } as ContactFields;
      if (key === "inquiry" && !showToolSelection(value as InquiryType))
        next.tool = "";
      return next;
    });
    if (key !== "tool" && errors[key as ContactField]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
    setStatus("");
  };

  const selectPurpose = (inquiry: InquiryType) => {
    update("inquiry", inquiry);
    formCard.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(
      () => firstField.current?.focus({ preventScroll: true }),
      400,
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactFields(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus(
        "Please fix the highlighted fields. Your entries have been kept.",
      );
      const firstError = Object.keys(nextErrors)[0] as ContactField;
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }
    const result = await submitContactForm(fields);
    setStatus(result.message);
  };

  return (
    <div className="contact-page">
      <DesignHeader />
      <main>
        <section className="hero ph contact-hero">
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <Icon name="chev" size={14} />
              <span aria-current="page">Contact</span>
            </nav>
            <span className="eyebrow">
              <Icon name="msg" size={14} />
              GET IN TOUCH
            </span>
            <h1>We&apos;d Love to Hear From You</h1>
            <p className="lead">
              Have a question, found a bug or have an idea for a new tool? Share
              your feedback and help us make ToolNest better.
            </p>
          </div>
        </section>

        <section className="contact-main-section">
          <div className="wrap">
            <div className="contact-layout">
              <div className="contact-form-card" ref={formCard}>
                <h2>Send Us a Message</h2>
                <p>
                  Fill out the form below to share your questions, suggestions
                  or feedback.
                </p>
                {status && (
                  <div className="contact-status" role="alert">
                    <Icon name="info" size={18} />
                    <span>
                      <b>Submission unavailable</b>
                      {status}
                    </span>
                  </div>
                )}
                <form noValidate onSubmit={submit}>
                  <div className="contact-field-row">
                    <div className="contact-field">
                      <label htmlFor="contact-name">
                        Full Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={firstField}
                        className="contact-input"
                        id="contact-name"
                        value={fields.name}
                        onChange={(e) => update("name", e.target.value)}
                        autoComplete="name"
                        placeholder="Enter your name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby="contact-name-error"
                      />
                      <FieldError id="contact-name-error" error={errors.name} />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="contact-email">
                        Email Address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        className="contact-input"
                        id="contact-email"
                        type="email"
                        value={fields.email}
                        onChange={(e) => update("email", e.target.value)}
                        autoComplete="email"
                        placeholder="Enter your email address"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby="contact-email-error"
                      />
                      <FieldError
                        id="contact-email-error"
                        error={errors.email}
                      />
                    </div>
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-inquiry">
                      Inquiry Type <span aria-hidden="true">*</span>
                    </label>
                    <select
                      className="contact-input"
                      id="contact-inquiry"
                      value={fields.inquiry}
                      onChange={(e) => update("inquiry", e.target.value)}
                      aria-invalid={Boolean(errors.inquiry)}
                      aria-describedby="contact-inquiry-error"
                    >
                      <option value="">Select an inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {inquiryLabels[type]}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      id="contact-inquiry-error"
                      error={errors.inquiry}
                    />
                  </div>
                  {showToolSelection(fields.inquiry) && (
                    <div className="contact-field">
                      <label htmlFor="contact-tool">
                        Tool Name{" "}
                        <span className="contact-optional">Optional</span>
                      </label>
                      <select
                        className="contact-input"
                        id="contact-tool"
                        value={fields.tool}
                        onChange={(e) => update("tool", e.target.value)}
                      >
                        <option value="">Select a tool (optional)</option>
                        {tools.map((tool) => (
                          <option key={tool.slug} value={tool.slug}>
                            {tool.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="contact-field">
                    <label htmlFor="contact-subject">
                      Subject <span aria-hidden="true">*</span>
                    </label>
                    <input
                      className="contact-input"
                      id="contact-subject"
                      value={fields.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder="What is your message about?"
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby="contact-subject-error"
                    />
                    <FieldError
                      id="contact-subject-error"
                      error={errors.subject}
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-message">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      className="contact-input"
                      id="contact-message"
                      rows={6}
                      maxLength={MESSAGE_LIMIT}
                      value={fields.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us how we can help..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby="contact-message-error contact-count"
                    />
                    <div
                      className="contact-count"
                      id="contact-count"
                      aria-live="polite"
                    >
                      {fields.message.length.toLocaleString()} /{" "}
                      {MESSAGE_LIMIT.toLocaleString()}
                    </div>
                    <FieldError
                      id="contact-message-error"
                      error={errors.message}
                    />
                  </div>
                  <p className="contact-privacy">
                    This form does not send or store your information while
                    delivery is unconfigured. Please avoid passwords or
                    sensitive details. Read our{" "}
                    <Link href="/about#privacy">privacy overview</Link>.
                  </p>
                  <button className="btn pr contact-submit" type="submit">
                    <Icon name="send" size={16} />
                    Review Submission
                  </button>
                  <p className="contact-notice">
                    <Icon name="info" size={14} />
                    Message delivery is not configured. Submitting performs
                    validation only; nothing is transmitted or persisted.
                  </p>
                </form>
              </div>

              <aside
                className="contact-help"
                aria-labelledby="contact-help-title"
              >
                <h2 id="contact-help-title">How Can We Help?</h2>
                <div className="contact-purpose-list">
                  {purposes.map(
                    ([icon, title, description, action, inquiry, color]) => (
                      <article
                        className="tc contact-purpose"
                        style={{ "--c": color } as CSSProperties}
                        key={inquiry}
                      >
                        <span className="cico">
                          <Icon name={icon} size={22} />
                        </span>
                        <div>
                          <h3>{title}</h3>
                          <p>{description}</p>
                          <button
                            className="use"
                            type="button"
                            onClick={() => selectPurpose(inquiry)}
                          >
                            {action}
                            <Icon name="arrow" size={16} />
                          </button>
                        </div>
                      </article>
                    ),
                  )}
                </div>
                <div className="contact-resources">
                  <h3>Looking for Something Else?</h3>
                  {[
                    ["grid", "Explore All Tools", "/tools"],
                    ["layers", "Browse Tool Categories", "/#categories"],
                    ["file", "Read Our Blog", "/blog"],
                    ["user", "Learn About ToolNest", "/about"],
                  ].map(([icon, label, href]) => (
                    <Link key={label} href={href} className="contact-resource">
                      <span>
                        <Icon name={icon as IconName} size={18} />
                      </span>
                      {label}
                      <Icon name="arrow" size={16} />
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="contact-faq-section">
          <div className="wrap">
            <div className="sh c">
              <span className="eyebrow">QUICK ANSWERS</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq">
              {faqs.map(([question, answer], index) => (
                <div
                  className={`qi ${openFaq === index ? "open" : ""}`}
                  key={question}
                >
                  <button
                    type="button"
                    aria-expanded={openFaq === index}
                    aria-controls={`contact-faq-${index}`}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    {question}
                    <Icon name="plus" size={20} />
                  </button>
                  <p className="qa" id={`contact-faq-${index}`}>
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-feedback-section">
          <div className="wrap">
            <div className="contact-feedback">
              <div className="contact-feedback-copy">
                <span className="cico">
                  <Icon name="heart" size={26} />
                </span>
                <div>
                  <h2>Your Feedback Makes ToolNest Better</h2>
                  <p>
                    Every suggestion, bug report and piece of feedback helps us
                    understand what users need and improve the ToolNest
                    experience.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn pr"
                onClick={() => selectPurpose("general-inquiry")}
              >
                Share Your Feedback
              </button>
            </div>
          </div>
        </section>

        <section className="contact-cta-section">
          <div className="wrap">
            <div className="cta contact-cta">
              <span className="mono-d contact-mono-left">{"{ }"}</span>
              <span className="mono-d contact-mono-right">&lt;/&gt;</span>
              <h2>Find the Right Tool for Your Next Task</h2>
              <p>
                Explore our collection of free online utilities designed to
                simplify your everyday workflow.
              </p>
              <Link href="/tools" className="btn w">
                Explore All Tools
              </Link>
              <Link href="/#categories" className="sl">
                Browse Categories
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}
