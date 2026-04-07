const API_URL = "http://localhost:9000/events";

export const trackEvent = async (event: string, data: Record<string, unknown>) => {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY || "",
      },
      body: JSON.stringify({
        event,
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
};
