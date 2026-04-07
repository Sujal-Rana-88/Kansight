import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold">Kansight</div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link className="text-muted hover:text-foreground" href="/login">
              Sign in
            </Link>
            <Link
              className="rounded-full bg-brand px-4 py-2 text-white"
              href="/signup"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Behavioral Intelligence
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Understand why users hesitate, drop, and convert with live AI insights.
            </h1>
            <p className="text-lg text-muted">
              Kansight turns subtle behavioral signals into real‑time intent scores,
              AI explanations, and product recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
                href="/signup"
              >
                Start tracking
              </Link>
              <Link
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold"
                href="/login"
              >
                View demo
              </Link>
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              Live highlights
            </div>
            <div className="mt-4 space-y-4 text-sm text-foreground">
              <div className="rounded-2xl border border-border p-4">
                AI detects price sensitivity in 38% of sessions.
              </div>
              <div className="rounded-2xl border border-border p-4">
                Avg hesitation score down 22% after urgency messaging.
              </div>
              <div className="rounded-2xl border border-border p-4">
                4.1x faster insight generation vs manual analysis.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
