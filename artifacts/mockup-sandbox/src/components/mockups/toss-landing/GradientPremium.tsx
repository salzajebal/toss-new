import React from 'react';
import { ShieldCheck, Zap, Phone, ArrowRight, CheckCircle2, ChevronRight, Check, AlertCircle, Quote } from 'lucide-react';

export default function GradientPremium() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900" style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#40A1FF] to-[#FF6B00] flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-white font-bold text-xl tracking-tight">민생희망대출</span>
          </div>
          <button className="bg-gradient-to-r from-[#40A1FF] to-[#FF6B00] hover:from-[#3a92e6] hover:to-[#e66000] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-[0_4px_14px_rgba(64,161,255,0.3)]">
            대출 상담 신청
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-[#0A1628] overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#40A1FF] opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#FF6B00] opacity-20 blur-[100px]"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <Zap size={16} className="text-[#FF6B00]" />
              <span>신용에 전혀 문제없는 안심 한도조회</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              필요한 순간,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40A1FF] to-[#FF6B00]">최대 1억까지</span> 당일 송금
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
              복잡한 서류 없이 100% 비대면으로.<br className="hidden md:block" />
              당신의 신용등급에 맞는 최적의 금리를 찾아드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#40A1FF] to-[#FF6B00] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2">
                내 한도 알아보기
                <ArrowRight size={20} />
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Phone size={20} />
                전화 상담하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#40A1FF] to-[#2b7bc4] py-12 relative z-20 shadow-xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="text-center md:pt-0 pt-4 first:pt-0">
              <div className="text-white/80 text-sm font-medium mb-1">진행 방식</div>
              <div className="text-white text-2xl font-bold">100% 비대면</div>
            </div>
            <div className="text-center md:pt-0 pt-4">
              <div className="text-white/80 text-sm font-medium mb-1">송금 시간</div>
              <div className="text-white text-2xl font-bold">승인 즉시 당일 입금</div>
            </div>
            <div className="text-center md:pt-0 pt-4">
              <div className="text-white/80 text-sm font-medium mb-1">안전성</div>
              <div className="text-white text-2xl font-bold">정식 등록 안심 업체</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Promises Section */}
      <section className="py-24 bg-[#F8FBFF]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Promises */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                민생희망대출의<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40A1FF] to-[#FF6B00]">4가지 안심 약속</span>
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                불법 수수료 없이 안전하고 투명하게 진행합니다.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "선입금 없음", desc: "어떠한 명목의 수수료도 먼저 요구하지 않습니다." },
                  { title: "100% 비대면", desc: "지점 방문 없이 온라인으로 모든 절차가 완료됩니다." },
                  { title: "개인정보 보호", desc: "고객님의 소중한 정보는 암호화되어 안전하게 관리됩니다." },
                  { title: "당일 입금", desc: "심사 완료 후 30분 이내 즉시 송금해 드립니다." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#40A1FF] to-[#FF6B00]"></div>
                    <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center mb-4">
                      <ShieldCheck size={24} className="text-[#40A1FF]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Static Form Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#40A1FF] to-[#FF6B00] rounded-3xl transform rotate-3 opacity-10 blur-lg"></div>
              <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(10,22,40,0.05)] overflow-hidden relative border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-[#40A1FF] to-[#FF6B00]"></div>
                <div className="p-8 md:p-10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">빠른 한도조회</h3>
                    <span className="text-[#40A1FF] font-bold">Step 1/3</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">직업 구분</label>
                      <div className="relative border border-gray-300 rounded-xl bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:border-[#40A1FF] transition-colors">
                        <span className="text-gray-500">직업을 선택해주세요</span>
                        <ChevronRight size={20} className="text-gray-400 rotate-90" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">희망 금액</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="0" 
                          className="w-full border border-gray-300 rounded-xl bg-gray-50 p-4 text-right text-lg font-bold outline-none focus:border-[#40A1FF] focus:ring-1 focus:ring-[#40A1FF] transition-all"
                          readOnly
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-[#40A1FF] to-[#FF6B00] text-white py-4 rounded-xl font-bold text-lg mt-4 shadow-lg shadow-[#40A1FF]/20 flex items-center justify-center gap-2">
                      다음 단계로 <ArrowRight size={20} />
                    </button>
                    
                    <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <AlertCircle size={14} />
                      한도조회는 신용점수에 영향을 주지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Concerns Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">이런 고민이 있으신가요?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "은행권 대출이 거절되어 답답하신 분",
              "당장 오늘 목돈이 급하게 필요하신 분",
              "복잡한 서류 준비할 시간이 없으신 분",
              "여러 곳에 대출이 흩어져 있어 관리가 어려우신 분",
              "신용점수가 낮아 한도가 안 나올까 걱정이신 분"
            ].map((text, idx) => (
              <div key={idx} className={`p-5 rounded-2xl flex items-start gap-4 border border-gray-100 ${idx === 4 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''} bg-gray-50`}>
                <div className="w-6 h-6 rounded-full bg-[#40A1FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[#40A1FF] font-bold" />
                </div>
                <p className="text-gray-700 font-medium">{text}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-[#0A1628] rounded-3xl relative overflow-hidden text-center text-white">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#FF6B00] rounded-full blur-[60px] opacity-30"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#40A1FF] rounded-full blur-[60px] opacity-30"></div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">민생희망대출이 해결해 드립니다</h3>
            <p className="text-gray-300 mb-8 relative z-10">오랜 경험과 노하우로 최적의 솔루션을 제안합니다.</p>
            <button className="relative z-10 bg-white text-[#0A1628] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              상담 신청하기
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-[#F8FBFF]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">고객님들의 생생한 후기</h2>
            <p className="text-gray-600 text-lg">많은 분들이 이미 경험하고 만족하셨습니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "직장인론", amount: "3,000만원", text: "급하게 전세금 잔금이 필요했는데, 당일 바로 승인나서 정말 다행이었습니다. 상담원분도 너무 친절하셨어요.", user: "김*진 님" },
              { type: "사업자론", amount: "5,000만원", text: "사업 자금 융통이 막혀서 막막했는데, 여기저기 안되던걸 해결해주셨습니다. 덕분에 위기를 넘겼네요.", user: "이*석 님" },
              { type: "주부론", amount: "1,500만원", text: "소득 증빙이 어려워 대출이 안될 줄 알았는데, 복잡한 서류 없이 진행해주셔서 너무 감사했습니다.", user: "박*희 님" },
              { type: "통합대출", amount: "4,200만원", text: "여기저기 흩어진 대출을 하나로 묶으면서 이자 부담을 많이 줄였습니다. 진작 알았으면 좋았을걸 그랬어요.", user: "최*우 님" }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform">
                <Quote size={32} className="text-[#F0F4FF] mb-4 absolute top-6 right-6" />
                <div className="flex gap-2 mb-4 relative z-10">
                  <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-[#40A1FF]/10 to-[#FF6B00]/10 text-[#0A1628] rounded">
                    {review.type}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {review.amount} 승인
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm relative z-10">"{review.text}"</p>
                <div className="font-medium text-gray-900 border-t border-gray-50 pt-4 relative z-10">
                  {review.user}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-center">맞춤형 대출 상품</h2>
          
          <div className="space-y-4">
            {[
              { title: "직장인 신용대출", desc: "4대보험 가입 직장인을 위한 넉넉한 한도", limit: "최대 1억원", icon: "💼" },
              { title: "사업자 대출", desc: "자영업자, 소상공인을 위한 긴급 자금", limit: "최대 1억원", icon: "🏢" },
              { title: "무직자/청년 대출", desc: "소득증빙이 어려운 분들을 위한 맞춤 상품", limit: "최대 3,000만원", icon: "🌱" },
              { title: "여성/주부 대출", desc: "주부님들을 위한 쉽고 빠른 대출", limit: "최대 3,000만원", icon: "✨" }
            ].map((prod, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border border-gray-200 hover:border-[#40A1FF] bg-white transition-colors cursor-pointer group">
                <div className="flex items-center gap-5 mb-4 md:mb-0">
                  <div className="w-14 h-14 rounded-full bg-[#F8FBFF] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {/* Using standard unicode or generic shape instead of emoji to strictly follow rules, wait rule says "이모지 사용 금지". I will replace icons. */}
                    {idx === 0 && <span className="w-3 h-3 rounded-full bg-[#40A1FF]"></span>}
                    {idx === 1 && <span className="w-3 h-3 rounded-sm bg-[#FF6B00]"></span>}
                    {idx === 2 && <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-[#40A1FF]"></span>}
                    {idx === 3 && <span className="w-3 h-3 bg-gradient-to-r from-[#40A1FF] to-[#FF6B00] rotate-45"></span>}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#40A1FF] transition-colors">{prod.title}</h3>
                    <p className="text-gray-500 text-sm">{prod.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">최대한도</span>
                    <span className="text-lg font-bold text-[#0A1628]">{prod.limit}</span>
                  </div>
                  <ChevronRight size={24} className="text-gray-300 group-hover:text-[#40A1FF] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#40A1FF] to-[#FF6B00] flex items-center justify-center text-white font-bold text-xl grayscale opacity-80">
                  M
                </div>
                <span className="text-white font-bold text-xl tracking-tight">민생희망대출</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                안전하고 믿을 수 있는 금융 파트너.<br />
                정식 등록된 대부업체로 법정 금리를 준수합니다.
              </p>
            </div>
            
            <div className="text-left md:text-right">
              <div className="text-gray-400 text-sm mb-2">고객센터</div>
              <div className="text-2xl font-bold text-white mb-2">010-5807-7888</div>
              <div className="text-gray-500 text-sm">평일 09:00 - 18:00 (주말/공휴일 휴무)</div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 space-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
              <span>상호: 우주캐피탈대부</span>
              <span>대표: 강윤희</span>
              <span>사업자등록번호: 738-95-01643</span>
              <span>대부업 등록번호: 2023-충북청주-0011</span>
            </div>
            <div className="text-xs text-gray-500">
              주소: 충청북도 청주시 청원구 내덕동 788-115
            </div>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400 leading-relaxed font-bold">
                대출금리 : 연 20% 이내 (연체금리는 약정금리 +3%p 이내, 연 20% 이내) | 취급수수료 등 기타 부대비용 없음 | 조기상환조건 없음<br />
                중개수수료를 요구하거나 받는 것은 불법입니다. 과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다.<br />
                대출 시 귀하의 신용등급 또는 개인신용평점이 하락할 수 있습니다.
              </p>
            </div>
            <div className="mt-8 text-xs text-gray-600">
              © 2024 우주캐피탈대부. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
