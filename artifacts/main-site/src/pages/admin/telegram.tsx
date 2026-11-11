import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetTelegramSettings,
  useUpdateTelegramSettings,
  useDetectTelegramChats,
  useTestTelegramNotification,
  getGetTelegramSettingsQueryKey,
} from "@workspace/api-client-react";
import { getAuthToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminTelegramPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getAuthToken()) setLocation("/admin");
  }, [setLocation]);

  const { data: settings, isLoading } = useGetTelegramSettings({
    query: { queryKey: getGetTelegramSettingsQueryKey() },
  });

  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (settings) {
      setBotToken(settings.botToken ?? "");
      setChatId(settings.chatId ?? "");
      setEnabled(settings.enabled);
    }
  }, [settings]);

  const updateSettings = useUpdateTelegramSettings();
  const detectChats = useDetectTelegramChats();
  const testNotification = useTestTelegramNotification();

  async function handleSave() {
    try {
      await updateSettings.mutateAsync({
        data: {
          botToken: botToken || null,
          chatId: chatId || null,
          enabled,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetTelegramSettingsQueryKey() });
      toast({ title: "✅ 텔레그램 설정이 저장되었습니다" });
    } catch {
      toast({ title: "저장 실패", variant: "destructive" });
    }
  }

  async function handleDetectChats() {
    if (!botToken) {
      toast({ title: "먼저 봇 토큰을 입력하세요", variant: "destructive" });
      return;
    }
    try {
      // First save the token
      await updateSettings.mutateAsync({ data: { botToken, chatId: chatId || null, enabled } });
      const result = await detectChats.mutateAsync();
      queryClient.invalidateQueries({ queryKey: getGetTelegramSettingsQueryKey() });
      if (result.chats.length > 0) {
        toast({ title: `✅ ${result.chats.length}개의 채팅방이 감지되었습니다` });
      } else {
        const msg = (result as any).error ?? "감지된 채팅방이 없습니다. 봇에 메시지를 보낸 후 다시 시도하세요.";
        toast({ title: msg, variant: "destructive" });
      }
    } catch {
      toast({ title: "채팅방 감지 실패 — 봇 토큰을 확인하세요", variant: "destructive" });
    }
  }

  async function handleTest() {
    if (!botToken || !chatId) {
      toast({ title: "봇 토큰과 채팅방을 먼저 설정하세요", variant: "destructive" });
      return;
    }
    try {
      const result = await testNotification.mutateAsync();
      if (result.success) {
        toast({ title: "✅ " + result.message });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "테스트 실패", variant: "destructive" });
    }
  }

  const detectedChats = settings?.detectedChats ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="bg-card border-b border-border/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-black text-lg text-primary">민생희망대출</span>
          <span className="text-muted-foreground text-sm">텔레그램 설정</span>
        </div>
        <button
          onClick={() => setLocation("/admin/dashboard")}
          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          ← 대시보드
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1">텔레그램 알림 설정</h1>
          <p className="text-muted-foreground text-sm">대출 신청이 들어올 때 텔레그램으로 알림을 받으세요</p>
        </div>

        {/* How-to guide */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-blue-400 mb-2">📖 설정 방법</h3>
          <ol className="text-xs text-blue-300/80 space-y-1 list-decimal list-inside">
            <li>텔레그램에서 @BotFather 에게 /newbot 으로 봇 생성 후 토큰을 복사</li>
            <li>아래에 봇 토큰을 입력하고 저장</li>
            <li>알림을 받을 채팅방(개인 or 그룹)에서 봇에게 아무 메시지나 전송</li>
            <li>"채팅방 자동 감지" 버튼 클릭 → 채팅방 목록에서 선택</li>
            <li>활성화 토글 ON → 저장 → 테스트 발송으로 확인</li>
          </ol>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">
          {/* Bot Token */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              봇 토큰 <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="예: 1234567890:ABCDefGhIJKLmNoPQRsTUVwxyZ"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">@BotFather 에서 발급받은 봇 토큰</p>
          </div>

          {/* Chat Room */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold">채팅방 ID</label>
              <button
                onClick={handleDetectChats}
                disabled={detectChats.isPending || !botToken}
                className="text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {detectChats.isPending ? "감지 중..." : "✨ 채팅방 자동 감지"}
              </button>
            </div>
            {detectedChats.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">감지된 채팅방을 선택하세요:</div>
                {detectedChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setChatId(chat.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      chatId === chat.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-semibold">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">{chat.type} · ID: {chat.id}</div>
                  </button>
                ))}
                <div className="pt-1">
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="또는 직접 입력: -1001234567890"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="예: -1001234567890 (그룹) 또는 123456789 (개인)"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">봇에게 메시지를 보낸 후 자동 감지 버튼을 누르세요</p>
          </div>

          {/* Enable toggle */}
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/60">
            <div>
              <div className="text-sm font-semibold">알림 활성화</div>
              <div className="text-xs text-muted-foreground mt-0.5">대출 신청 시 텔레그램 알림 발송</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                enabled ? "bg-primary" : "bg-border"
              }`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                enabled ? "translate-x-6" : "translate-x-0"
              }`}></span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateSettings.isPending ? "저장 중..." : "설정 저장"}
            </button>
            <button
              onClick={handleTest}
              disabled={testNotification.isPending || !botToken || !chatId}
              className="flex-1 py-3 bg-card border border-border rounded-lg text-sm font-semibold hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              {testNotification.isPending ? "전송 중..." : "테스트 발송"}
            </button>
          </div>
        </div>

        {/* Current Status */}
        {settings && (
          <div className="mt-4 p-4 bg-card border border-border/60 rounded-xl">
            <div className="text-xs font-semibold text-muted-foreground mb-2">현재 상태</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${settings.botToken ? "bg-green-400" : "bg-red-400"}`}></span>
                <span className="text-muted-foreground">봇 토큰: {settings.botToken ? "설정됨" : "미설정"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${settings.chatId ? "bg-green-400" : "bg-red-400"}`}></span>
                <span className="text-muted-foreground">채팅방: {settings.chatId ? "설정됨" : "미설정"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${settings.enabled ? "bg-green-400" : "bg-gray-400"}`}></span>
                <span className="text-muted-foreground">알림: {settings.enabled ? "활성화" : "비활성화"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
