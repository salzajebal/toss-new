import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
} from "@workspace/api-client-react";
import { getAuthToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getAuthToken()) setLocation("/admin");
  }, [setLocation]);

  const { data: settings, isLoading } = useGetSiteSettings({
    query: { queryKey: getGetSiteSettingsQueryKey() },
  });

  const [kakaoLink, setKakaoLink] = useState("");

  useEffect(() => {
    if (settings) {
      setKakaoLink(settings.kakaoLink ?? "");
    }
  }, [settings]);

  const updateSettings = useUpdateSiteSettings();

  async function handleSave() {
    try {
      await updateSettings.mutateAsync({ data: { kakaoLink: kakaoLink || null } });
      queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
      toast({ title: "✅ 카카오톡 설정이 저장되었습니다" });
    } catch {
      toast({ title: "저장 실패", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="bg-card border-b border-border/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-black text-lg text-primary">민생희망대출</span>
          <span className="text-muted-foreground text-sm">카카오톡 설정</span>
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
          <h1 className="text-2xl font-black mb-1">카카오톡 상담 링크 설정</h1>
          <p className="text-muted-foreground text-sm">메인 화면 우측 하단 카카오톡 버튼이 연결될 링크를 설정하세요</p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">카카오톡 오픈채팅/상담 링크</label>
            <input
              type="text"
              value={kakaoLink}
              onChange={(e) => setKakaoLink(e.target.value)}
              placeholder="예: https://open.kakao.com/o/xxxxxxxx"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">비워두면 메인 화면에 카카오톡 버튼이 표시되지 않습니다.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {updateSettings.isPending ? "저장 중..." : "설정 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
