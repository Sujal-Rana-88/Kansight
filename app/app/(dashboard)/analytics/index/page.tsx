"use client";

import Link from "next/link";

const links = [
  { label: "Events Count", href: "/analytics/events-count" },
  { label: "Top Events", href: "/analytics/top-events" },
  { label: "Funnel", href: "/analytics/funnel" },
  { label: "Similar Users", href: "/analytics/similar-users" },
  { label: "Predict Conversion", href: "/analytics/predict-conversion" },
  { label: "AI Query", href: "/analytics/ai-query" },
  { label: "Anomalies", href: "/analytics/anomalies" },
];

export default function AnalyticsIndexPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold text-foreground">Analytics APIs</div>
        <p className="mt-1 text-sm text-muted">
          Quick links to every analytics endpoint.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="glass rounded-2xl p-4 text-sm font-semibold text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
