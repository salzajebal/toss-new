import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { setAuthToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const loginMutation = useAdminLogin();
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({ data: { password } });
      if (result.success && result.token) {
        setAuthToken(result.token);
        setLocation("/admin/dashboard");
      }
    } catch {
      toast({ title: "비밀번호가 올바르지 않습니다", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black">어드민 로그인</h1>
          <p className="text-muted-foreground text-sm mt-1">민생희망대출 관리자 페이지</p>
        </div>
        <form onSubmit={handleLogin} className="bg-card border border-border/60 rounded-2xl p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← 메인 사이트로</a>
        </div>
      </div>
    </div>
  );
}
