"use client";

export default function OrgSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold text-foreground">Organization Settings</div>
        <p className="mt-1 text-sm text-muted">
          Configure your workspace name, slug, and subscription plan.
        </p>
      </div>
      <div className="glass rounded-2xl p-6">
        <form className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Organization name
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Kansight Labs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Slug
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              placeholder="kansight"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Plan
            </label>
            <select className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm">
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </div>
          <button
            type="button"
            className="md:col-span-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
