import { useEffect, useState } from "react";
import "./_group.css";

export function CounterB() {
  const [count, setCount] = useState(2140);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const tick = () => {
      setCount((n) => n + (Math.floor(Math.random() * 8) + 1) * 10);
      setFlash(true); setTimeout(() => setFlash(false), 500);
      tid = setTimeout(tick, 4000 + Math.random() * 6000);
    };
    let tid = setTimeout(tick, 3000 + Math.random() * 4000);
    return () => clearTimeout(tid);
  }, []);

  const pct = Math.min(100, (count / 5000) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0F6FF",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
      position: "relative",
    }}>
      {/* 카드 — 흰색 부유 3D */}
      <div style={{
        position: "relative", width: 460,
        borderRadius: 28, padding: "52px 44px 44px",
        textAlign: "center",
        background: "#FFFFFF",
        boxShadow: "6px 12px 0 rgba(49,130,246,0.20), 0 24px 56px rgba(49,130,246,0.14), 0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(49,130,246,0.12)",
      }}>
        {/* 상단 파란 스트립 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#3182F6", borderRadius: "28px 28px 0 0" }} />

        {/* LIVE */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(49,130,246,0.06)", border: "1px solid rgba(49,130,246,0.15)", borderRadius: 99, padding: "5px 14px", marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "block", animation: "liveB 1.6s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#3182F6", letterSpacing: "0.12em" }}>LIVE</span>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: 20, textTransform: "uppercase" as const }}>실시간 신청 현황</div>

        {/* 숫자 */}
        <div style={{
          fontSize: 80, fontWeight: 900,
          color: "#3182F6",
          letterSpacing: "-0.04em", lineHeight: 1,
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          marginBottom: 4,
          filter: flash ? "brightness(1.2)" : "brightness(1)",
        }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#CBD5E1", marginBottom: 36 }}>명</div>

        {/* 진행 바 */}
        <div style={{ background: "rgba(49,130,246,0.08)", borderRadius: 99, height: 7, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "#3182F6",
            width: `${pct}%`,
            transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: "0 0 10px rgba(49,130,246,0.4)",
          }} />
        </div>
        <div style={{ fontSize: 11, color: "#CBD5E1", letterSpacing: "0.04em" }}>목표 5,000명을 향해 달려가는 중</div>
      </div>

      <style>{`@keyframes liveB{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
