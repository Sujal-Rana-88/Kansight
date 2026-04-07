"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "../../components/card";
import { ChartCard } from "../../components/chart-card";
import { Table } from "../../components/table";
import {
  aiInsights,
  eventsOverTime,
  funnelData,
  kpiCards,
  topEvents,
  topProducts,
  topUsers,
} from "../../lib/mock";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title} title={card.title} value={card.value} trend={card.trend} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Events Over Time" subtitle="Last 7 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventsOverTime}>
                <XAxis dataKey="date" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Top Events" subtitle="By volume">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs text-muted">
            {topEvents.map((event) => (
              <div key={event.name} className="flex items-center justify-between">
                <span>{event.name}</span>
                <span className="font-semibold text-foreground">{event.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <Table columns={["Product", "ID", "Events", "CVR"]} rows={topProducts} />
          <Table columns={["User", "Segment", "Intent", "Hesitation"]} rows={topUsers} />
        </div>
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold text-foreground">Funnel</div>
            <div className="mt-4 space-y-3">
              {funnelData.map((stage, idx) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{stage.stage}</span>
                    <span className="font-semibold text-foreground">
                      {stage.value}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-surface">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{
                        width: `${(stage.value / funnelData[0].value) * 100}%`,
                        opacity: 1 - idx * 0.12,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold text-foreground">AI Insights</div>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Top reason</div>
                <div className="text-foreground font-semibold">
                  {aiInsights.top_reason_for_dropoff}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Confidence</div>
                <div className="text-foreground font-semibold">
                  {(aiInsights.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Suggestions</div>
                <ul className="list-disc pl-5 text-muted">
                  {aiInsights.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
