"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { categories, tools } from "@/data/tools";
import { BrandLogo } from "./brand-logo";
import { Icon } from "./icon";

const categoryIcon = {
  developer: "code",
  text: "type",
  seo: "search",
  image: "image",
  pdf: "file",
  calculators: "calc",
} as const;

export function DesignHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const goTools = () => router.push("/tools");
  return (
    <>
      <header>
        <div className="wrap">
          <BrandLogo />
          <nav className="main" aria-label="Primary">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
            <Link
              href="/tools"
              aria-current={pathname === "/tools" ? "page" : undefined}
            >
              All Tools
            </Link>
            <button
              aria-expanded={mega}
              aria-controls="mega"
              onClick={() => setMega(!mega)}
              onMouseEnter={() => setMega(true)}
            >
              Categories <Icon name="chev" size={16} />
            </button>
            <Link href="/#blog">Blog</Link>
            <Link href="/#about">About</Link>
          </nav>
          <div className="rt">
            <button className="ib" aria-label="Search tools" onClick={goTools}>
              <Icon name="search" />
            </button>
            <button
              className="ib tt"
              aria-label="Toggle dark mode"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Icon
                name={resolvedTheme === "dark" ? "sun" : "moon"}
                size={18}
              />
            </button>
            <Link href="/tools" className="btn pr hd-btn">
              Explore Tools
            </Link>
            <button
              className="ib burger"
              aria-label="Open menu"
              onClick={() => setDrawer(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className={`mega ${mega ? "open" : ""}`} id="mega">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={
                  category.active
                    ? `/tools?category=${category.id}`
                    : "/tools?availability=soon"
                }
                className="mi"
                style={{ "--c": category.color } as React.CSSProperties}
                onClick={() => setMega(false)}
              >
                <span className="t">
                  <span className="cico">
                    <Icon name={categoryIcon[category.id]} />
                  </span>
                  {category.name}
                  {!category.active && <span className="soon">Soon</span>}
                </span>
                <p>{category.description}</p>
                <span className="l">
                  {tools
                    .filter((tool) => tool.category === category.id)
                    .slice(0, 3)
                    .map((tool) => (
                      <span key={tool.id}>{tool.name}</span>
                    ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </header>
      <div className={`drawer ${drawer ? "open" : ""}`}>
        <button
          className="bk"
          aria-label="Close menu"
          onClick={() => setDrawer(false)}
        />
        <aside>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BrandLogo />
            <button
              className="ib"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
            >
              <Icon name="x" />
            </button>
          </div>
          {[
            ["Home", "/"],
            ["All Tools", "/tools"],
            ["Blog", "/#blog"],
            ["About", "/#about"],
          ].map(([label, href]) => (
            <Link
              className="dl"
              href={href}
              key={label}
              onClick={() => setDrawer(false)}
            >
              {label}
            </Link>
          ))}
          <p
            style={{
              font: "600 12px var(--bf)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "var(--m)",
              margin: "24px 0 4px",
            }}
          >
            Categories
          </p>
          {categories.map((category) => (
            <Link
              className="dl"
              href={
                category.active
                  ? `/tools?category=${category.id}`
                  : "/tools?availability=soon"
              }
              key={category.id}
              onClick={() => setDrawer(false)}
            >
              {category.name}
              {!category.active && <span className="soon">Soon</span>}
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}

export function DesignFooter() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div>
            <BrandLogo />
            <p className="bio">
              Free online tools for developers, designers, students and
              creators, gathered in one clean place.
            </p>
            <span className="tag">All your tools. One place.</span>
          </div>
          <div>
            <h4>Tool Categories</h4>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={
                      category.active
                        ? `/tools?category=${category.id}`
                        : "/tools?availability=soon"
                    }
                  >
                    {category.name.replace("Calculator Tools", "Calculators")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/tools">All Tools</Link>
              </li>
              <li>
                <Link href="/#blog">Blog</Link>
              </li>
              <li>
                <Link href="/#about">About Us</Link>
              </li>
              <li>
                <Link href="/#faq">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms &amp; Conditions</li>
              <li>Disclaimer</li>
            </ul>
          </div>
        </div>
        <div className="bb">
          <span>© 2026 ToolNest. All rights reserved.</span>
          <button
            className="btn tt"
            style={{ padding: "7px 12px" }}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} size={18} />{" "}
            {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </footer>
  );
}
