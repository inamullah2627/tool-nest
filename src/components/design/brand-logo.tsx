import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="logo" aria-label="ToolNest home">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#brand-gradient)" />
        <rect x="9" y="7" width="5.5" height="5.5" rx="1.5" fill="#fff" />
        <rect
          x="17.5"
          y="7"
          width="5.5"
          height="5.5"
          rx="1.5"
          fill="#fff"
          opacity=".7"
        />
        <path
          d="M7 16.5c0 5 4 8.5 9 8.5s9-3.5 9-8.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      ToolNest
    </Link>
  );
}
