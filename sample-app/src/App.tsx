import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "./lib/tracker";
import { useHoverTracker } from "./hooks/useHoverTracker";

const product = {
  id: "p456",
  title: "Aurora Performance Jacket",
  price: "$189",
  image:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
};

const sessionId = crypto.randomUUID();

export default function App() {
  const productHover = useHoverTracker();
  const buyHover = useHoverTracker();
  const [clickCount, setClickCount] = useState(0);
  const [firstInteraction, setFirstInteraction] = useState(Date.now());

  const sessionStart = useMemo(() => Date.now(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      trackEvent("product_interaction_summary", {
        user_id: "u-demo",
        product_id: product.id,
        session_id: sessionId,
        hover_count: productHover.hoverCount,
        total_hover_time_ms: productHover.totalTime,
        max_hover_time_ms: productHover.maxHoverTime,
        hover_sessions: productHover.hoverCount > 0 ? 1 : 0,
      });
    }, 15000);

    return () => {
      clearInterval(interval);
      const sessionDuration = Date.now() - sessionStart;
      trackEvent("product_interaction_summary", {
        user_id: "u-demo",
        product_id: product.id,
        session_id: sessionId,
        hover_count: productHover.hoverCount,
        total_hover_time_ms: productHover.totalTime,
        max_hover_time_ms: productHover.maxHoverTime,
        hover_sessions: productHover.hoverCount > 0 ? 1 : 0,
      });
      trackEvent("buy_button_interaction", {
        user_id: "u-demo",
        product_id: product.id,
        session_id: sessionId,
        hover_count: buyHover.hoverCount,
        click_count: clickCount,
        delay_before_click_ms: clickCount ? Date.now() - firstInteraction : 0,
      });
      trackEvent("session_summary", {
        user_id: "u-demo",
        session_id: sessionId,
        session_duration_ms: sessionDuration,
        pages_visited: 1,
        interaction_count: productHover.hoverCount + buyHover.hoverCount + clickCount,
      });
    };
  }, [
    buyHover.hoverCount,
    clickCount,
    firstInteraction,
    productHover.hoverCount,
    productHover.maxHoverTime,
    productHover.totalTime,
    sessionStart,
  ]);

  return (
    <div style={{ padding: "48px" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "white",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 20px 40px rgba(15,23,42,0.12)",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 32,
        }}
      >
        <div
          onMouseEnter={productHover.onMouseEnter}
          onMouseLeave={productHover.onMouseLeave}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ width: "100%", borderRadius: 18, objectFit: "cover" }}
          />
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#64748b", letterSpacing: "0.2em" }}>
            LIMITED DROP
          </div>
          <h1 style={{ fontSize: 32, margin: "12px 0" }}>{product.title}</h1>
          <p style={{ color: "#64748b" }}>
            Lightweight, weather-proof, and designed for all-day movement.
          </p>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>
            {product.price}
          </div>
          <button
            onMouseEnter={buyHover.onMouseEnter}
            onMouseLeave={buyHover.onMouseLeave}
            onClick={() => {
              if (clickCount === 0) {
                setFirstInteraction(Date.now());
              }
              setClickCount((c) => c + 1);
            }}
            style={{
              marginTop: 24,
              background: "#1d4ed8",
              color: "white",
              border: "none",
              borderRadius: 999,
              padding: "12px 24px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Buy now
          </button>
          <div style={{ marginTop: 20, fontSize: 12, color: "#94a3b8" }}>
            Hover the product image and CTA to generate events.
          </div>
        </div>
      </div>
    </div>
  );
}
