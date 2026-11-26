"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type Highlight = {
  icon: IconName;
  title: string;
  description: string;
};

type Props = {
  title: string;
  label: string;
  description: string;
  icon: IconName;
  updated: string;
  draftNotice: ReactNode;
  highlights?: Highlight[];
  sections: LegalSection[];
  contactHeading: string;
  contactText: string;
  relatedDocuments: string[];
};

export function LegalPageLayout({
  title,
  label,
  description,
  icon,
  updated,
  draftNotice,
  highlights = [],
  sections,
  contactHeading,
  contactText,
  relatedDocuments,
}: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateActive = () => {
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 150)
          current = section.id;
      }
      setActiveId(current);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [sections]);

  const navigate = (id: string) => {
    const target = document.getElementById(id);
    window.history.replaceState(null, "", `#${id}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(
      () =>
        target
          ?.querySelector<HTMLElement>("h2")
          ?.focus({ preventScroll: true }),
      400,
    );
    setMobileOpen(false);
  };

  return (
    <div className="legal-page">
      <DesignHeader />
      <main>
        <section className="hero ph legal-hero">
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <Icon name="chev" size={14} />
              <span aria-current="page">{title}</span>
            </nav>
            <span className="cico legal-hero-icon">
              <Icon name={icon} size={28} />
            </span>
            <div>
              <span className="eyebrow">{label}</span>
            </div>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
            <p className="legal-meta">
              <Icon name="clock" size={14} />
              Last updated: <span>{updated}</span>
            </p>
          </div>
        </section>

        {highlights.length > 0 && (
          <section className="legal-highlights-section">
            <div className="wrap">
              <div className="fcg legal-highlights">
                {highlights.map((item) => (
                  <article className="tc" key={item.title}>
                    <span className="cico">
                      <Icon name={item.icon} size={22} />
                    </span>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="legal-main-section">
          <div className="wrap">
            <div className="legal-grid">
              <nav
                className={`legal-toc ${mobileOpen ? "open" : ""}`}
                aria-label="On this page"
              >
                <button
                  className="legal-toc-heading"
                  type="button"
                  aria-expanded={mobileOpen}
                  aria-controls="legal-toc-list"
                  onClick={() => setMobileOpen((value) => !value)}
                >
                  <span>On This Page</span>
                  <Icon name="chev" size={16} />
                </button>
                <ol id="legal-toc-list">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        className={activeId === section.id ? "active" : ""}
                        aria-current={
                          activeId === section.id ? "true" : undefined
                        }
                        onClick={() => navigate(section.id)}
                      >
                        <span>{index + 1}</span>
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <article className="ac legal-content">
                <div className="callout legal-draft-notice">
                  <Icon name="alert" size={20} />
                  <p>{draftNotice}</p>
                </div>
                {sections.map((section, index) => (
                  <section
                    className="legal-section"
                    id={section.id}
                    key={section.id}
                  >
                    <h2 tabIndex={-1}>
                      <span>{index + 1}</span>
                      {section.title}
                    </h2>
                    {section.content}
                  </section>
                ))}

                <div className="legal-contact-card">
                  <span className="cico">
                    <Icon name="shieldCheck" size={26} />
                  </span>
                  <div>
                    <h3>{contactHeading}</h3>
                    <p>{contactText}</p>
                  </div>
                  <Link
                    className="btn pr"
                    href="/contact?inquiry=privacy-concern"
                  >
                    Contact Us
                  </Link>
                </div>
                <div className="legal-related">
                  <h3>Related Legal Documents</h3>
                  <div>
                    {relatedDocuments.map((document) => (
                      <div className="legal-related-card" key={document}>
                        <span>
                          <Icon name="file" size={18} />
                        </span>
                        {document}
                        <span className="soon">Coming Soon</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn legal-back-top"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <Icon name="arrow" size={16} />
                  Back to top
                </button>
              </article>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}
