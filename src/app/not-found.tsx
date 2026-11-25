import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty-page container">
      <span className="eyebrow">404</span>
      <h1>That page isn’t in the nest</h1>
      <p>The destination may be planned for a future ToolNest release.</p>
      <Link href="/tools" className="button primary">
        Explore all tools
      </Link>
    </section>
  );
}
