export const kpiCards = [
  { title: "Total Events", value: "128.4k", trend: "+12%" },
  { title: "Active Users", value: "18.2k", trend: "+6.1%" },
  { title: "Conversion Rate", value: "3.8%", trend: "+0.3%" },
  { title: "Avg Hesitation", value: "0.62", trend: "-0.04" },
];

export const eventsOverTime = [
  { date: "Mon", count: 1200 },
  { date: "Tue", count: 1400 },
  { date: "Wed", count: 900 },
  { date: "Thu", count: 1700 },
  { date: "Fri", count: 2100 },
  { date: "Sat", count: 1500 },
  { date: "Sun", count: 1900 },
];

export const topEvents = [
  { name: "product_interaction_summary", count: 5200 },
  { name: "buy_button_interaction", count: 3200 },
  { name: "session_summary", count: 2400 },
];

export const funnelData = [
  { stage: "View", value: 8200 },
  { stage: "Hover", value: 5600 },
  { stage: "Click Buy", value: 1800 },
  { stage: "Checkout", value: 940 },
];

export const topProducts = [
  ["Pulse Sneakers", "p-1a2", "32k events", "4.2% CVR"],
  ["Aurora Jacket", "p-1b3", "27k events", "3.8% CVR"],
  ["Nimbus Backpack", "p-1c4", "21k events", "3.1% CVR"],
];

export const topUsers = [
  ["u-9123", "Explorer", "0.68 intent", "0.51 hesitation"],
  ["u-7711", "Hesitant", "0.44 intent", "0.73 hesitation"],
  ["u-4302", "Impulsive", "0.82 intent", "0.28 hesitation"],
];

export const aiInsights = {
  top_reason_for_dropoff: "high price sensitivity",
  confidence: 0.84,
  suggestions: [
    "offer limited-time discount",
    "highlight product benefits clearly",
    "add social proof (reviews)",
  ],
};

export const members = [
  { name: "Aarav Shah", email: "aarav@kansight.ai", role: "owner" as const },
  { name: "Nia Patel", email: "nia@kansight.ai", role: "admin" as const },
  { name: "Rishi Kumar", email: "rishi@kansight.ai", role: "member" as const },
];

export const apiKeys = [
  { name: "Web SDK", key: "ks_live_8x23b9f7a0", environment: "prod" as const },
  { name: "Staging App", key: "ks_test_1f9c31aa98", environment: "dev" as const },
];
