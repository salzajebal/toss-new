import React from "react";
import { 
  Menu, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  UserX, 
  Briefcase, 
  Wallet, 
  Building2, 
  CreditCard,
  MessageSquare,
  ThumbsUp,
  AlertCircle
} from "lucide-react";

export default function DarkModeLanding() {
  return (
    <div className="min-h-[100dvh] bg-black text-white font-['Pretendard','Noto_Sans_KR',sans-serif] selection:bg-[#40A1FF] selection:text-white">
      {/* 1. 상단 네비게이션 바 */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#40A1FF] flex items-center justify-center">
              <span className="font-bold text-white text-sm">민생</span>
            </div>
            <span className="font-bold text-xl tracking-tight">민생희망대출</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">특징</a>
            <a href="#products" className="hover:text-white transition-colors">상품안내</a>
            <a href="#reviews" className="hover:text-white transition-colors">고객후기</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex px-5 py-2.5 bg-[#40A1FF] hover:bg-[#318be6] text-white text-sm font-bold rounded-xl transition-colors items-center gap-2">
              대출 상담 신청
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="md:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. 히어로 섹션 */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#40A1FF] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="flex flex-col items-start max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#40A1FF] text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#40A1FF] animate-pulse"></span>
            당일 승인율 98% 달성
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            신용에 전혀 문제없는<br />
            <span className="text-[#40A1FF]">한도조회</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-medium break-keep leading-relaxed">
            최대 1억까지, 100% 비대면으로<br className="hidden md:block" />
            안전하고 빠르게 한도를 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-[#40A1FF] hover:bg-[#318be6] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(64,161,255,0.3)] flex items-center justify-center gap-2 w-full sm:w-auto">
              내 한도 알아보기
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-lg font-bold rounded-xl border border-[#2A2A2A] transition-colors w-full sm:w-auto">
              전화 상담하기
            </button>
          </div>
        </div>
      </section>

      {/* 3. 통계 바 */}
      <section className="border-y border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
          <div className="flex flex-col items-center py-4 md:py-0 md:w-1/3">
            <Smartphone className="w-8 h-8 text-[#40A1FF] mb-3" />
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-gray-400 text-sm">비대면 진행</div>
          </div>
          <div className="flex flex-col items-center py-4 md:py-0 md:w-1/3">
            <Clock className="w-8 h-8 text-[#40A1FF] mb-3" />
            <div className="text-3xl font-bold mb-1">30분</div>
            <div className="text-gray-400 text-sm">당일 입금</div>
          </div>
          <div className="flex flex-col items-center py-4 md:py-0 md:w-1/3">
            <ShieldCheck className="w-8 h-8 text-[#40A1FF] mb-3" />
            <div className="text-3xl font-bold mb-1">안심</div>
            <div className="text-gray-400 text-sm">정식 등록 업체</div>
          </div>
        </div>
      </section>

      {/* 4. 약속 섹션 */}
      <section id="features" className="py-24 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">고객을 위한 4가지 약속</h2>
            <p className="text-gray-400 text-lg">불법 수수료 없이 안전하게 모십니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Wallet, title: "선입금 요구 절대 없음", desc: "어떠한 명목으로도 수수료나 선입금을 요구하지 않습니다." },
              { icon: Smartphone, title: "100% 비대면 무방문", desc: "복잡한 서류 없이 스마트폰 하나로 간편하게 신청하세요." },
              { icon: ShieldCheck, title: "철저한 개인정보 보호", desc: "상담 기록이 남지 않으며 정보는 안전하게 파기됩니다." },
              { icon: Clock, title: "심사 후 당일 입금", desc: "승인 완료 시 지연 없이 즉시 고객님의 계좌로 입금됩니다." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#40A1FF]/50 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-[#111111] border border-[#2A2A2A] flex items-center justify-center mb-6 group-hover:bg-[#40A1FF]/10 transition-colors">
                  <item.icon className="w-7 h-7 text-[#40A1FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 한도조회 폼 */}
      <section className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#40A1FF] rounded-full blur-[100px] opacity-20"></div>
            
            <div className="mb-10">
              <span className="text-[#40A1FF] font-bold text-sm mb-2 block">Step 1</span>
              <h2 className="text-3xl font-bold">고객님의 직업은<br />무엇인가요?</h2>
            </div>

            <div className="space-y-4 mb-10">
              {[
                { icon: Briefcase, label: "직장인 (4대보험 가입)" },
                { icon: Building2, label: "개인/법인 사업자" },
                { icon: UserX, label: "무직자 / 프리랜서" },
                { icon: CreditCard, label: "주부" }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:border-[#40A1FF] transition-all has-[:checked]:border-[#40A1FF] has-[:checked]:bg-[#40A1FF]/10">
                  <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-gray-400" />
                    <span className="font-semibold text-lg">{item.label}</span>
                  </div>
                  <input type="radio" name="job" className="w-5 h-5 accent-[#40A1FF]" defaultChecked={idx === 0} />
                </label>
              ))}
            </div>

            <button className="w-full py-5 bg-[#40A1FF] hover:bg-[#318be6] text-white text-lg font-bold rounded-2xl transition-colors">
              다음 단계로
            </button>
          </div>
        </div>
      </section>

      {/* 6. 고민 섹션 */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">이런 고민이 있으신가요?</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              "기대출이 많아 추가 대출이 어려우신 분",
              "저신용자로 분류되어 한도 승인이 안 나시는 분",
              "복잡한 서류 준비 없이 빠르게 자금이 필요하신 분",
              "타사에서 거절당해 막막하신 분",
              "당일 급전이 필요해 애태우고 계신 분"
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A]">
                <AlertCircle className="w-6 h-6 text-[#FF6B00] shrink-0 mt-0.5" />
                <p className="text-lg font-medium text-gray-200">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-xl text-[#40A1FF] font-bold">민생희망대출이 해결해 드리겠습니다.</p>
          </div>
        </div>
      </section>

      {/* 7. 후기 섹션 */}
      <section id="reviews" className="py-24 bg-[#0A1A2F]"> {/* 다크 블루 느낌으로 #1877C1 대신 깊은 색상 적용 */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">생생한 승인 후기</h2>
              <p className="text-[#40A1FF] text-lg font-medium">수많은 고객님들이 만족하셨습니다.</p>
            </div>
            <ThumbsUp className="w-12 h-12 text-[#40A1FF] opacity-50 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "김*진", job: "직장인", amount: "1,500만원", desc: "기대출이 3건이나 있어서 안 될 줄 알았는데, 당일 바로 1,500만원 승인받았습니다. 정말 감사합니다!" },
              { name: "이*영", job: "프리랜서", amount: "800만원", desc: "소득 증빙이 어려워 타사에서 계속 부결됐었어요. 친절한 상담 끝에 필요한 자금 마련했습니다." },
              { name: "박*수", job: "개인사업자", amount: "3,000만원", desc: "급하게 자재 대금이 필요했는데 스마트폰으로 신청하고 2시간 만에 입금 받았습니다." },
              { name: "최*미", job: "주부", amount: "500만원", desc: "남편 모르게 비상금이 필요했는데, 비밀 보장 확실하게 처리해주셔서 안심했습니다." }
            ].map((review, idx) => (
              <div key={idx} className="bg-[#111111]/80 backdrop-blur-sm border border-[#2A2A2A] rounded-2xl p-8 relative">
                <MessageSquare className="absolute top-8 right-8 w-6 h-6 text-[#40A1FF]/30" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center font-bold text-gray-300">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{review.name} 고객님</div>
                    <div className="text-sm text-[#40A1FF]">{review.job} • {review.amount} 승인</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">"{review.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 상품 섹션 */}
      <section id="products" className="py-24 bg-black border-t border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">맞춤형 대출 상품</h2>
            <p className="text-gray-400 text-lg">상황에 맞는 최적의 금리와 한도를 제안합니다.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[#2A2A2A]">
                  <th className="py-5 px-6 font-bold text-gray-400 bg-[#111111] rounded-tl-xl">상품명</th>
                  <th className="py-5 px-6 font-bold text-gray-400 bg-[#111111]">대상</th>
                  <th className="py-5 px-6 font-bold text-gray-400 bg-[#111111]">최대한도</th>
                  <th className="py-5 px-6 font-bold text-gray-400 bg-[#111111] rounded-tr-xl">금리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {[
                  { name: "직장인 신용대출", target: "4대보험 가입 3개월 이상", limit: "최대 1억원", rate: "연 5.9% ~" },
                  { name: "사업자/법인 대출", target: "사업자 등록증 소지자", limit: "최대 1억원", rate: "연 6.5% ~" },
                  { name: "무직자/프리랜서", target: "소득 증빙이 어려운 분", limit: "최대 2,000만원", rate: "연 9.9% ~" },
                  { name: "여성/주부 대출", target: "만 20세 이상 여성", limit: "최대 1,500만원", rate: "연 8.9% ~" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-6 px-6 font-bold text-lg text-white">{row.name}</td>
                    <td className="py-6 px-6 text-gray-300">{row.target}</td>
                    <td className="py-6 px-6 font-bold text-[#40A1FF]">{row.limit}</td>
                    <td className="py-6 px-6 text-gray-300">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. 푸터 */}
      <footer className="bg-[#111111] py-16 border-t border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
                  <span className="font-bold text-gray-400 text-sm">민생</span>
                </div>
                <span className="font-bold text-xl text-gray-400">민생희망대출</span>
              </div>
              <div className="text-3xl font-extrabold mb-2">010-5807-7888</div>
              <p className="text-gray-500 text-sm">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-400">
              <div><span className="text-gray-500">상호명.</span> 우주캐피탈대부</div>
              <div><span className="text-gray-500">대표자.</span> 강윤희</div>
              <div><span className="text-gray-500">사업자등록번호.</span> 738-95-01643</div>
              <div><span className="text-gray-500">대부업등록번호.</span> 2023-충북청주-0011</div>
              <div className="sm:col-span-2"><span className="text-gray-500">주소.</span> 충청북도 청주시 청원구 내덕동 788-115</div>
            </div>
          </div>

          <div className="p-6 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] text-sm text-gray-400 leading-relaxed mb-8">
            <p className="font-bold text-[#FF6B00] mb-2">대출금리: 연 20% 이내 (연체금리는 대출금리 +3%p 이내, 연 20% 이내)</p>
            <p>취급수수료 등 기타 부대비용 없습니다. (단, 부동산 담보대출 시 근저당 설정비용 발생 가능)</p>
            <p>중개수수료를 요구하거나 받는 것은 불법입니다. 과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다.</p>
            <p className="font-bold text-white mt-2">대출 시 귀하의 신용등급 또는 개인신용평점이 하락할 수 있습니다.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#2A2A2A] text-xs text-gray-500">
            <div className="flex gap-4 mb-4 md:mb-0">
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors font-bold">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">이메일무단수집거부</a>
            </div>
            <p>&copy; 2024 우주캐피탈대부. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
