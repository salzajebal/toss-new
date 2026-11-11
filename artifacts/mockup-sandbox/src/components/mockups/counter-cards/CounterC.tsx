import { useEffect, useState } from "react";
import "./_group.css";

function Digit({ value }: { value: number }) {
  const slots = Array.from({ length: 20 }, (_, i) => i % 10);
  return (
    <div style={{
      width: 60, height: 84,
      overflow: "hidden", borderRadius: 14,
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "inset 0 3px 10px rgba(0,0,0,0.25), inset 0 -2px 6px rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.18)",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 26, background: "linear-gradient(to bottom, rgba(15,35,90,0.75), transparent)", zIndex: 2, borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 26, background: "linear-gradient(to top, rgba(15,35,90,0.75), transparent)", zIndex: 2, borderRadius: "0 0 14px 14px" }} />
      <div style={{ position: "absolute", top: "50%", left: 4, right: 4, height: 84, transform: "translateY(-50%)", borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)", zIndex: 1 }} />
      <div style={{ transform: `translateY(${-value * 84}px)`, transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
        {slots.map((d, i) => (
          <div key={i} style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 900, color: "#FFFFFF", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

export function CounterC() {
  const [count, setCount] = useState(2140);

  useEffect(() => {
    const tick = () => {
      setCount((n) => n + (Math.floor(Math.random() * 8) + 1) * 10);
      tid = setTimeout(tick, 4000 + Math.random() * 6000);
    };
    let tid = setTimeout(tick, 3000 + Math.random() * 4000);
    return () => clearTimeout(tid);
  }, []);

  const padded = count.toString().padStart(4, "0").split("").map(Number);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#3182F6",
      display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* 배경 장식 — 단색 반투명 원 */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 240, height: 240, borderRadius: "50%", background: "rgba(0,30,100,0.15)" }} />

      {/* LIVE */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", display: "block", animation: "liveC 1.8s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>LIVE</span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", marginBottom: 32, textTransform: "uppercase" as const }}>실시간 신청 현황</div>

      {/* 오도미터 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Digit value={padded[0]} />
        <Digit value={padded[1]} />
        <div style={{ fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.5)", alignSelf: "flex-end", paddingBottom: 10 }}>,</div>
        <Digit value={padded[2]} />
        <Digit value={padded[3]} />
        <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.6)", alignSelf: "flex-end", paddingBottom: 18, marginLeft: 4 }}>명</div>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>숫자가 실시간으로 올라갑니다</div>

      <style>{`@keyframes liveC{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
