import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  ChevronRight, 
  Banknote, 
  UserCheck, 
  Lock, 
  Star 
} from 'lucide-react';

export default function LightClean() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans break-keep" style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">민생희망대출</div>
          <button className="bg-[#40A1FF] text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm">
            대출 상담 신청
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#40A1FF] font-semibold text-sm mb-6">
            <ShieldCheck size={16} />
            <span>신용도 하락 없는 안심조회</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900">
            신용에 전혀 문제없는<br />
            <span className="text-[#40A1FF]">한도조회</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            방문 없이 모바일로 간편하게.<br />
            최대 1억까지, 나에게 맞는 최적의 금리를 확인하세요.
          </p>
          <button className="bg-[#40A1FF] text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-[0_8px_16px_rgba(64,161,255,0.25)] hover:shadow-[0_12px_24px_rgba(64,161,255,0.35)] hover:-translate-y-1 transform duration-200">
            내 한도 확인하기
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-slate-50 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-around gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex-1 pt-4 md:pt-0">
            <div className="text-4xl font-bold text-[#40A1FF] mb-2">100%</div>
            <div className="text-slate-600 font-medium">비대면 진행</div>
          </div>
          <div className="flex-1 pt-4 md:pt-0">
            <div className="text-4xl font-bold text-[#40A1FF] mb-2">당일</div>
            <div className="text-slate-600 font-medium">빠른 입금</div>
          </div>
          <div className="flex-1 pt-4 md:pt-0">
            <div className="text-4xl font-bold text-[#40A1FF] mb-2">정식</div>
            <div className="text-slate-600 font-medium">등록 안심업체</div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            고객님과의 <span className="text-[#40A1FF]">4가지 약속</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Banknote, title: "절대 선입금 없음", desc: "어떠한 명목으로도 선입금을 요구하지 않습니다." },
              { icon: Smartphone, title: "100% 비대면", desc: "복잡한 서류 없이 모바일로 간편하게 진행됩니다." },
              { icon: Lock, title: "철저한 개인정보 보호", desc: "상담 내역은 암호화되어 안전하게 관리됩니다." },
              { icon: Clock, title: "당일 입금 원칙", desc: "승인 완료 후 즉시 송금을 원칙으로 합니다." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#40A1FF] mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form (Visual Step 1) */}
      <section className="py-24 px-6 bg-[#F5F6F8]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">지금 바로 확인해보세요</h2>
            <p className="text-slate-500">단 1분이면 충분합니다.</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="bg-[#40A1FF] p-6 text-white">
              <h3 className="text-xl font-bold mb-1">상담 신청서 작성</h3>
              <p className="text-blue-100 text-sm opacity-90">빠르고 안전하게 도와드리겠습니다.</p>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">직업 구분</label>
                <div className="relative">
                  <select defaultValue="" className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#40A1FF] focus:border-transparent transition-all font-medium text-base">
                    <option value="" disabled>현재 직업을 선택해주세요</option>
                    <option value="worker">직장인 (4대보험 가입)</option>
                    <option value="freelancer">프리랜서 / 아르바이트</option>
                    <option value="business">개인사업자 / 법인사업자</option>
                    <option value="none">무직자 / 주부</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={20} />
                </div>
              </div>
              <button className="w-full bg-[#40A1FF] text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2">
                다음으로 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            이런 고민이 있으신가요?
          </h2>
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12">
            <ul className="space-y-6">
              {[
                "기대출이 많아 추가 대출이 어려우신 분",
                "신용점수가 낮아 1금융권 이용이 힘드신 분",
                "소득 증빙이 어려운 프리랜서, 주부, 무직자 분",
                "당일 급하게 자금이 필요하신 분",
                "복잡한 서류 없이 간편하게 받고 싶으신 분"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#40A1FF] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-lg font-medium text-slate-800">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <p className="text-xl font-bold text-[#40A1FF]">
                민생희망대출이 확실한 해결책을 찾아드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6 bg-[#F0F4FF]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            고객님들의 <span className="text-[#40A1FF]">생생한 후기</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "김*진", type: "직장인", text: "기대출이 많아서 반신반의하며 신청했는데, 당일에 바로 3천만원 승인 났습니다. 정말 감사합니다!" },
              { name: "이*호", type: "개인사업자", text: "급하게 자재 대금이 필요했는데 서류도 간단하고 입금까지 2시간도 안 걸렸네요. 최고입니다." },
              { name: "박*영", type: "프리랜서", text: "소득 증빙이 애매해서 1금융권에서 거절당했는데, 여기서는 친절하게 상담해주시고 승인까지 도와주셨어요." },
              { name: "최*민", type: "주부", text: "남편 모르게 비상금이 필요했는데, 신용조회 기록도 안 남고 비밀보장도 확실해서 안심했습니다." }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{review.name} 고객님</div>
                      <div className="text-sm text-slate-500">{review.type}</div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            맞춤형 금융 상품
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-5 px-6 font-bold text-slate-900 border-b border-slate-200 w-1/4">상품명</th>
                    <th className="py-5 px-6 font-bold text-slate-900 border-b border-slate-200 w-1/4">대상</th>
                    <th className="py-5 px-6 font-bold text-slate-900 border-b border-slate-200 w-1/4">한도</th>
                    <th className="py-5 px-6 font-bold text-slate-900 border-b border-slate-200 w-1/4">금리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-semibold text-[#40A1FF]">직장인론</td>
                    <td className="py-5 px-6 text-slate-600">4대보험 가입 직장인</td>
                    <td className="py-5 px-6 font-medium text-slate-900">최대 1억원</td>
                    <td className="py-5 px-6 text-slate-600">연 20% 이내</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-semibold text-[#40A1FF]">사업자론</td>
                    <td className="py-5 px-6 text-slate-600">개인/법인 사업자</td>
                    <td className="py-5 px-6 font-medium text-slate-900">최대 1억원</td>
                    <td className="py-5 px-6 text-slate-600">연 20% 이내</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-semibold text-[#40A1FF]">여성/주부론</td>
                    <td className="py-5 px-6 text-slate-600">만 20세 이상 여성</td>
                    <td className="py-5 px-6 font-medium text-slate-900">최대 3,000만원</td>
                    <td className="py-5 px-6 text-slate-600">연 20% 이내</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-semibold text-[#40A1FF]">무직자론</td>
                    <td className="py-5 px-6 text-slate-600">소득 증빙 어려운 분</td>
                    <td className="py-5 px-6 font-medium text-slate-900">최대 3,000만원</td>
                    <td className="py-5 px-6 text-slate-600">연 20% 이내</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-white text-2xl font-bold tracking-tight">민생희망대출</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-sm leading-relaxed">
            <div>
              <p>상호: 민생희망대출 (우주캐피탈대부)</p>
              <p>대표자: 강윤희</p>
              <p>사업자등록번호: 738-95-01643</p>
              <p>대부업 등록번호: 2023-충북청주-0011</p>
            </div>
            <div>
              <p>고객센터: 010-5807-7888</p>
              <p>주소: 충청북도 청주시 청원구 내덕동 788-115</p>
              <p className="mt-4">
                대출금리: 연 20% 이내 (연체금리: 약정금리 +3%, 연 20% 이내)<br />
                취급수수료 등 기타 부대비용 및 조기상환조건 없음
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-2">
            <p className="text-red-400 font-bold mb-4">과도한 빚, 고통의 시작입니다. 대출 시 귀하의 신용등급 또는 개인신용평점이 하락할 수 있습니다.</p>
            <p>중개수수료를 요구하거나 받는 것은 불법입니다.</p>
            <p>Copyright © 민생희망대출. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
