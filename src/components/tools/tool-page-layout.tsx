"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import { categoryMap } from "@/data/tools";
import type { Tool } from "@/types/tool";

export function ToolPageLayout({
  tool,
  icon,
  heading,
  description,
  children,
}: {
  tool: Tool;
  icon: IconName;
  heading: string;
  description: string;
  children: ReactNode;
}) {
  const category = categoryMap[tool.category];
  const { favorites, toggleFavorite } = usePreferences();
  const favorite = favorites.includes(tool.id);

  const share = async () => {
    const data = {
      title: tool.name,
      text: description,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <div
      className="tpg"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <DesignHeader />
      <main>
        <div className="wrap">
          <nav className="bcr tool-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <Icon name="home" size={14} />
              Home
            </Link>
            <Icon name="chev" size={14} />
            <Link href="/tools">All Tools</Link>
            <Icon name="chev" size={14} />
            <Link href={`/tools/category/${category.id}`}>{category.name}</Link>
            <Icon name="chev" size={14} />
            <span aria-current="page">{tool.name}</span>
          </nav>
          <div className="ti2">
            <div className="tool-title">
              <span className="cico cbig">
                <Icon name={icon} size={28} />
              </span>
              <div>
                <Link href={`/tools/category/${category.id}`} className="cat">
                  {category.name}
                </Link>
                <h1>{heading}</h1>
                <p className="lead">{description}</p>
              </div>
            </div>
            <div className="ta">
              <button
                className="btn"
                aria-pressed={favorite}
                onClick={() => toggleFavorite(tool.id)}
              >
                <Icon name="heart" size={16} />
                {favorite ? "Added to Favorites" : "Add to Favorites"}
              </button>
              <button className="btn" onClick={share}>
                <Icon name="share" size={16} />
                Share Tool
              </button>
            </div>
          </div>
          <div className="trust tool-trust">
            {["Free to Use", "No Registration", "Browser-Based Processing"].map(
              (item) => (
                <span key={item}>
                  <Icon name="check" size={16} />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
        {children}
      </main>
      <DesignFooter />
    </div>
  );
}
