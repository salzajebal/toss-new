import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetAdminStats,
  useListApplications,
  useUpdateApplicationStatus,
  useDeleteApplication,
  useListEventVerifications,
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetAdminStatsQueryKey,
  getListApplicationsQueryKey,
  getListEventVerificationsQueryKey,
  getGetSiteSettingsQueryKey,
} from "@workspace/api-client-react";
import { getAuthToken, clearAuthToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { HeroImageEditor } from "@/components/HeroImageEditor";

const jobTypeLabels: Record<string, string> = {
  employee: "직장인", business: "사업자", housewife: "주부", unemployed: "무직",
};
const statusLabels: Record<string, { label: string; color: string }> = {
  pending:   { label: "대기중",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  contacted: { label: "연락완료", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  completed: { label: "완료",     color: "text-green-400 bg-green-400/10 border-green-400/30" },
};
const statusOrder = ["pending", "contacted", "completed"];

/* ── 콘텐츠 편집 필드 정의 ── */
const CONTENT_FIELDS = [
  { key: "formSubtitle",   label: "폼 소제목",           group: "폼",   multiline: true },
  { key: "formTitle",      label: "폼 제목",             group: "폼",   multiline: true },
  { key: "formDisclaimer", label: "하단 고지 문구",       group: "폼",   multiline: true },
  { key: "pinPrompt",      label: "비밀번호 안내 문구 ([이름]님의 뒷부분)", group: "폼", multiline: true },
] as const;

type ContentKey = (typeof CONTENT_FIELDS)[number]["key"] | "heroImagePath" | "heroImageAlt";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"applications" | "event" | "content">("applications");
  const [editingMemo, setEditingMemo] = useState<{ id: number; memo: string } | null>(null);
  const [contentDraft, setContentDraft] = useState<Record<ContentKey, string>>({} as any);
  const [contentSaving, setContentSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => { if (!getAuthToken()) setLocation("/admin"); }, [setLocation]);

  const { data: stats }     = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });
  const { data: appList, isLoading } = useListApplications({ page, limit: 20 }, { query: { queryKey: getListApplicationsQueryKey({ page, limit: 20 }) } });
  const { data: eventList, isLoading: eventLoading } = useListEventVerifications({ query: { queryKey: getListEventVerificationsQueryKey(), refetchInterval: 3000 } });
  const { data: siteSettings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey(), refetchOnWindowFocus: false, refetchOnReconnect: false } });
  const updateSiteSettings = useUpdateSiteSettings();
  const prevEventCount = useRef<number | null>(null);
  const [newAlert, setNewAlert] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [deletingEvId, setDeletingEvId] = useState<number | null>(null);
  const updateStatus = useUpdateApplicationStatus();
  const deleteApp    = useDeleteApplication();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  /* AudioContext 초기화 및 unlock */
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const playAlertSound = async () => {
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") await ctx.resume();

      const playTone = (freq: number, start: number, dur: number, vol = 0.55) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.05);
      };

      // 딩동 3단 상승음 — 볼륨 크게
      playTone(880,  0,    0.2, 0.6);
      playTone(1100, 0.22, 0.2, 0.6);
      playTone(1320, 0.44, 0.3, 0.7);
    } catch (e) {
      console.warn("알림음 재생 실패:", e);
    }
  };

  /* 첫 클릭 시 AudioContext unlock */
  useEffect(() => {
    const unlock = async () => {
      try {
        const ctx = getAudioCtx();
        if (ctx.state === "suspended") await ctx.resume();
        setAudioUnlocked(true);
      } catch {}
    };
    document.addEventListener("click", unlock, { once: true });
    return () => document.removeEventListener("click", unlock);
  }, []);

  /* 신규 신청 알림음 */
  useEffect(() => {
    const count = eventList?.total ?? 0;
    if (prevEventCount.current === null) { prevEventCount.current = count; return; }
    if (count > prevEventCount.current) {
      prevEventCount.current = count;
      setNewAlert(true);
      setTimeout(() => setNewAlert(false), 3000);
      playAlertSound();
    } else {
      prevEventCount.current = count;
    }
  }, [eventList]);

  /* 설정 로드되면 draft 초기화 */
  useEffect(() => {
    if (!siteSettings) return;
    const draft: Record<string, string> = {};
    CONTENT_FIELDS.forEach(({ key }) => { draft[key] = (siteSettings as any)[key] ?? ""; });
    draft.heroImagePath = siteSettings.heroImagePath ?? "";
    draft.heroImageAlt = siteSettings.heroImageAlt ?? "";
    setContentDraft(draft as any);
  }, [siteSettings]);

  async function handleStatusChange(id: number, status: string) {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ page, limit: 20 }) });
      queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      toast({ title: "상태가 변경되었습니다" });
    } catch { toast({ title: "상태 변경 실패", variant: "destructive" }); }
  }

  async function handleDeleteVerification(id: number) {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    setDeletingEvId(id);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("failed");
      queryClient.invalidateQueries({ queryKey: getListEventVerificationsQueryKey() });
      toast({ title: "🗑️ 삭제됐습니다." });
    } catch {
      toast({ title: "삭제 실패", variant: "destructive" });
    } finally {
      setDeletingEvId(null);
    }
  }

  async function handleCompleteVerification(id: number) {
    setCompletingId(id);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/verifications/${id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("failed");
      queryClient.invalidateQueries({ queryKey: getListEventVerificationsQueryKey() });
      toast({ title: "✅ 완료 처리됐습니다. 고객 화면이 자동 전환됩니다." });
    } catch {
      toast({ title: "완료 처리 실패", variant: "destructive" });
    } finally {
      setCompletingId(null);
    }
  }

  async function handleSaveMemo() {
    if (!editingMemo) return;
    try {
      await updateStatus.mutateAsync({ id: editingMemo.id, data: { memo: editingMemo.memo } });
      queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ page, limit: 20 }) });
      setEditingMemo(null);
      toast({ title: "메모가 저장되었습니다" });
    } catch { toast({ title: "메모 저장 실패", variant: "destructive" }); }
  }

  async function handleDelete(id: number) {
    if (!confirm("이 신청을 삭제하시겠습니까?")) return;
    try {
      await deleteApp.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ page, limit: 20 }) });
      queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      toast({ title: "삭제되었습니다" });
    } catch { toast({ title: "삭제 실패", variant: "destructive" }); }
  }

  async function handleSaveContent() {
    setContentSaving(true);
    try {
      await updateSiteSettings.mutateAsync({ data: contentDraft });
      queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
      toast({ title: "콘텐츠가 저장되었습니다 ✓" });
    } catch { toast({ title: "저장 실패", variant: "destructive" }); }
    finally { setContentSaving(false); }
  }

  function handleLogout() { clearAuthToken(); setLocation("/admin"); }

  const statItems = [
    { label: "총 신청수",    value: stats?.total     ?? 0, color: "text-foreground" },
    { label: "오늘 신청",    value: stats?.today     ?? 0, color: "text-blue-400" },
    { label: "OTP 대기",    value: stats?.pending   ?? 0, color: "text-yellow-400" },
    { label: "OTP 완료",    value: stats?.contacted ?? 0, color: "text-blue-300" },
    { label: "처리 완료",    value: stats?.completed ?? 0, color: "text-green-400" },
  ];

  const formFields    = CONTENT_FIELDS.filter(f => f.group === "폼");

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm font-semibold">어드민</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => { await playAlertSound(); toast({ title: "🔔 알림음 테스트" }); }}
            className={`px-3 py-1.5 text-xs border rounded-lg transition-colors flex items-center gap-1.5 ${audioUnlocked ? "border-green-500/40 text-green-400 hover:bg-green-500/10" : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 animate-pulse"}`}
            title={audioUnlocked ? "알림음 활성화됨 — 클릭해서 테스트" : "클릭해서 알림음 활성화"}
          >
            🔔 {audioUnlocked ? "알림음 테스트" : "알림음 활성화"}
          </button>
          <a href="/" className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary/50 transition-colors">사이트 보기</a>
          <button onClick={handleLogout} className="px-3 py-1.5 text-xs bg-destructive/10 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-colors">로그아웃</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {statItems.map((s) => (
            <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4 text-center">
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 신규 신청 알림 배너 */}
        {newAlert && (
          <div className="mb-4 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-3 text-sm font-bold">
            <span style={{ fontSize: 20 }}>🔔</span>
            새로운 이벤트 신청이 들어왔습니다!
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors border ${activeTab === "applications" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground hover:border-primary/50"}`}
          >
            대출 신청 목록
          </button>
          <button
            onClick={() => setActiveTab("event")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors border flex items-center gap-2 ${activeTab === "event" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground hover:border-primary/50"}`}
          >
            🎉 이벤트 인증 현황
            {(eventList?.total ?? 0) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === "event" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                {eventList?.total}
              </span>
            )}
            <span className="text-[10px] opacity-60 font-normal">실시간</span>
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors border flex items-center gap-1.5 ${activeTab === "content" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground hover:border-primary/50"}`}
          >
            ✏️ 콘텐츠 편집
          </button>
        </div>

        {/* ── 대출 신청 탭 ── */}
        {activeTab === "applications" && (
          <>
            {stats?.byJobType && Object.keys(stats.byJobType).length > 0 && (
              <div className="bg-card border border-border/60 rounded-xl p-4 mb-6">
                <div className="text-sm font-semibold text-muted-foreground mb-3">직업별 신청 현황</div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.byJobType).map(([type, cnt]) => (
                    <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                      <span className="text-sm font-semibold">{jobTypeLabels[type] ?? type}</span>
                      <span className="text-primary font-black text-sm">{cnt as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
                <h2 className="font-bold">신청 목록</h2>
                <span className="text-xs text-muted-foreground">총 {appList?.total ?? 0}건</span>
              </div>
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground text-sm">로딩 중...</div>
              ) : !appList?.data?.length ? (
                <div className="p-8 text-center text-muted-foreground text-sm">신청 내역이 없습니다</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-background/50">
                        {["번호","이름","연락처","직업","신청일시","상태","메모","관리"].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appList.data.map((app) => (
                        <tr key={app.id} className="border-b border-border/30 hover:bg-background/30 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground">{app.id}</td>
                          <td className="px-4 py-3 font-semibold">{app.name}</td>
                          <td className="px-4 py-3">{app.phone}</td>
                          <td className="px-4 py-3">{jobTypeLabels[app.jobType] ?? app.jobType}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {new Date(app.createdAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-4 py-3">
                            <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-lg border font-semibold bg-transparent cursor-pointer ${statusLabels[app.status]?.color ?? "text-muted-foreground border-border"}`}>
                              {statusOrder.map((s) => (
                                <option key={s} value={s} className="bg-card text-foreground">{statusLabels[s]?.label ?? s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 max-w-32">
                            {editingMemo?.id === app.id ? (
                              <div className="flex gap-1">
                                <input type="text" value={editingMemo.memo} onChange={(e) => setEditingMemo({ ...editingMemo, memo: e.target.value })}
                                  className="w-24 text-xs bg-background border border-border rounded px-1 py-0.5 focus:outline-none focus:border-primary" autoFocus />
                                <button onClick={handleSaveMemo} className="text-xs text-primary hover:underline">저장</button>
                                <button onClick={() => setEditingMemo(null)} className="text-xs text-muted-foreground hover:underline">취소</button>
                              </div>
                            ) : (
                              <span onClick={() => setEditingMemo({ id: app.id, memo: app.memo ?? "" })}
                                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground truncate block max-w-24">
                                {app.memo || "메모 추가"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(app.id)} className="text-xs text-destructive hover:underline">삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {appList && appList.total > appList.limit && (
                <div className="px-4 py-3 border-t border-border/60 flex items-center justify-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary/50 transition-colors disabled:opacity-50">이전</button>
                  <span className="text-xs text-muted-foreground">{page} / {Math.ceil(appList.total / appList.limit)}</span>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(appList.total / appList.limit)}
                    className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary/50 transition-colors disabled:opacity-50">다음</button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── 이벤트 인증 탭 ── */}
        {activeTab === "event" && (
          <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold">이벤트 인증 현황</h2>
                <span className="flex items-center gap-1 text-[10px] text-green-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> 실시간
                </span>
              </div>
              <span className="text-xs text-muted-foreground">총 {eventList?.total ?? 0}건</span>
            </div>
            {eventLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">로딩 중...</div>
            ) : !eventList?.data?.length ? (
              <div className="p-8 text-center text-muted-foreground text-sm">이벤트 인증 참여자가 없습니다</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-background/50">
                      {["번호","이름","생년월일","통신사","휴대폰번호","인증번호","비밀번호","단계","참여시각","처리"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventList.data.map((ev) => (
                      <tr key={ev.id} className={`border-b border-border/30 transition-colors ${(ev as any).adminStatus === "completed" ? "opacity-50" : "hover:bg-background/30"}`}>
                        <td className="px-4 py-3 text-muted-foreground">{ev.id}</td>
                        <td className="px-4 py-3 font-semibold">{ev.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{ev.birth}-{ev.genderDigit}<span className="text-muted-foreground">●●●●●●</span></td>
                        <td className="px-4 py-3">{ev.carrier}</td>
                        <td className="px-4 py-3 font-mono">{ev.phone}</td>
                        <td className="px-4 py-3">
                          {ev.otpCode ? <span className="font-mono font-bold text-primary">{ev.otpCode}</span> : <span className="text-muted-foreground text-xs">대기중</span>}
                        </td>
                        <td className="px-4 py-3">
                          {(ev as any).pinCode
                            ? <span className="font-mono font-bold text-purple-400">{(ev as any).pinCode}</span>
                            : <span className="text-muted-foreground text-xs">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          {(ev as any).step === 3
                            ? <span className="text-xs px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/30 font-semibold">PIN완료</span>
                            : ev.step === 2
                            ? <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/30 font-semibold">OTP완료</span>
                            : <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-semibold">입력중</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(ev.createdAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {(ev as any).adminStatus === "completed" ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/30 font-semibold">완료</span>
                            ) : (ev as any).step >= 2 ? (
                              <button
                                onClick={() => handleCompleteVerification(ev.id)}
                                disabled={completingId === ev.id}
                                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {completingId === ev.id ? "처리중…" : "✅ 완료"}
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                            <button
                              onClick={() => handleDeleteVerification(ev.id)}
                              disabled={deletingEvId === ev.id}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              {deletingEvId === ev.id ? "…" : "🗑️"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── 콘텐츠 편집 탭 ── */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <HeroImageEditor
              path={contentDraft.heroImagePath ?? ""}
              alt={contentDraft.heroImageAlt ?? ""}
              preview={imagePreview}
              disabled={contentSaving || !siteSettings}
              onBusyChange={setImageUploading}
              onUpload={(path, preview) => {
                setImagePreview(preview);
                setContentDraft((draft) => ({ ...draft, heroImagePath: path }));
              }}
              onRemove={() => {
                setImagePreview(null);
                setContentDraft((draft) => ({ ...draft, heroImagePath: "" }));
              }}
              onAltChange={(alt) => setContentDraft((draft) => ({ ...draft, heroImageAlt: alt }))}
            />

            {/* 폼 섹션 */}
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2">
                <span className="text-base font-black">📝 인증 폼</span>
                <span className="text-xs text-muted-foreground">인증 입력 폼 문구</span>
              </div>
              <div className="p-5 space-y-4">
                {formFields.map(({ key, label, multiline }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</label>
                    {multiline ? (
                      <textarea
                        value={contentDraft[key] ?? ""}
                        onChange={(e) => setContentDraft((d) => ({ ...d, [key]: e.target.value }))}
                        rows={3}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={contentDraft[key] ?? ""}
                        onChange={(e) => setContentDraft((d) => ({ ...d, [key]: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveContent}
                disabled={contentSaving || imageUploading || !siteSettings}
                className="px-8 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {contentSaving ? "저장 중..." : "변경사항 저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
