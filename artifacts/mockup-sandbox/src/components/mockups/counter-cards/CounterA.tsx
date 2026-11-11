import { useEffect, useState } from "react";
import "./_group.css";

export function CounterA() {
  const [count, setCount] = useState(2140);

  useEffect(() => {
    const tick = () => {
      setCount((n) => n + (Math.floor(Math.random() * 8) + 1) * 10);
      tid = setTimeout(tick, 4000 + Math.random() * 6000);
    };
    let tid = setTimeout(tick, 3000 + Math.random() * 4000);
    return () => clearTimeout(tid);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D1B2E",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* 배경 글로우 */}
      <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(49,130,246,0.12) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <div style={{
        position: "relative", width: 480,
        borderRadius: 24, padding: "52px 44px",
        textAlign: "center",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(49,130,246,0.25)",
        boxShadow: "0 0 0 1px rgba(49,130,246,0.10), 0 32px 80px rgba(0,10,40,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        {/* 상단 파란 빛 */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(49,130,246,0.6), transparent)" }} />

        {/* LIVE 뱃지 */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 99, padding: "4px 14px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "block", animation: "liveA 1.6s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#4ADE80", letterSpacing: "0.12em" }}>LIVE</span>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: 24, textTransform: "uppercase" as const }}>실시간 신청 현황</div>

        {/* 숫자 — 파란 네온 */}
        <div style={{
          fontSize: 84, fontWeight: 900, color: "#FFFFFF",
          letterSpacing: "-0.04em", lineHeight: 1,
          textShadow: "0 0 24px rgba(49,130,246,0.9), 0 0 60px rgba(49,130,246,0.4)",
          transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          marginBottom: 6,
        }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>명</div>

        <div style={{ height: 1, background: "rgba(49,130,246,0.2)", marginBottom: 20 }} />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>실시간으로 업데이트됩니다</div>

        <div style={{ position: "absolute", bottom: 0, left: "25%", right: "25%", height: 1, background: "rgba(49,130,246,0.15)" }} />
      </div>

      <style>{`@keyframes liveA{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
