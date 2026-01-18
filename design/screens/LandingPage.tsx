
import React from 'react';

interface LandingPageProps {
  onUpload: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onUpload }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-primary-brown">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Space Moduler</h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-medium hover:text-primary-brown transition-colors">기능</a>
            <a href="#" className="text-sm font-medium hover:text-primary-brown transition-colors">가격</a>
            <a href="#" className="text-sm font-medium hover:text-primary-brown transition-colors">정보</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold px-4 py-2 hover:opacity-80">로그인</button>
            <button onClick={onUpload} className="bg-primary-brown hover:bg-stone-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-stone-200">
              시작하기
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-beige-bg">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none"></div>
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-brown/10 text-primary-brown text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-brown opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-brown"></span>
            </span>
            신규: AI v2.0 출시
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.2] max-w-4xl mb-6">
            어떤 평면도라도 즉시 <span className="text-primary-brown">3D 모델</span>로 변환하세요.
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mb-12">
            인테리어 애호가와 전문가를 위한 가장 빠른 공간 시각화 방법입니다.
            복잡한 소프트웨어 없이 업로드만으로 충분합니다.
          </p>

          <div className="w-full max-w-3xl">
            <div 
              onClick={onUpload}
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white p-12 transition-all hover:border-primary-brown hover:bg-stone-50 cursor-pointer shadow-xl shadow-stone-200/50"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-brown/10 text-primary-brown group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-4xl">cloud_upload</span>
              </div>
              <h3 className="text-xl font-bold mb-2">평면도 이미지를 여기에 끌어다 놓으세요</h3>
              <p className="text-sm text-stone-500 mb-8">또는 클릭하여 파일 찾아보기</p>
              <button className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-primary-brown px-8 py-4 text-base font-bold text-white shadow-xl shadow-stone-200 transition-all hover:translate-y-[-2px]">
                <span className="material-symbols-outlined">add_photo_alternate</span>
                파일 선택
              </button>
              <div className="mt-8 flex items-center gap-6 text-xs font-medium text-stone-400">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-lg">check_circle</span> JPG, PNG</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-lg">check_circle</span> PDF (벡터)</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-lg">check_circle</span> 최대 10MB</span>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-125">
              <span className="text-sm font-semibold italic">ARCHI-TECH</span>
              <span className="text-sm font-semibold italic">PLANNER-CO</span>
              <span className="text-sm font-semibold italic">STRUCTURAL-AI</span>
              <span className="text-sm font-semibold italic">MODERN-SPACES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-50 border-t border-stone-200 py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-4">왜 Space Moduler인가요?</h2>
            <p className="text-stone-600 max-w-xl">AI 기반 2D-3D 변환기로 인테리어 디자인의 미래를 경험해보세요.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon="psychology" 
              title="AI 기반 기술" 
              desc="고도화된 신경망이 공간 레이아웃을 즉시 이해하고 벽, 문, 창문을 자동으로 식별합니다."
            />
            <FeatureCard 
              icon="bolt" 
              title="즉각적인 변환" 
              desc="60초 이내에 정적 이미지에서 대화형 3D 모델로 변환합니다. 어떤 각도에서든 즉시 공간을 확인하세요."
            />
            <FeatureCard 
              icon="export_notes" 
              title="전문가용 내보내기" 
              desc="Blender, SketchUp 등 선호하는 디자인 도구와 호환되는 고품질 형식(OBJ, GLTF, USDZ)으로 내보낼 수 있습니다."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-brown">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <StatItem value="50,000+" label="변환된 평면도" />
            <StatItem value="99.8%" label="AI 정확도" />
            <StatItem value="< 1분" label="처리 시간" />
            <StatItem value="24/7" label="클라우드 렌더링" />
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="text-primary-brown/60">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48">
                <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Space Moduler</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-primary-brown">개인정보 처리방침</a>
            <a href="#" className="hover:text-primary-brown">이용약관</a>
            <a href="#" className="hover:text-primary-brown">고객 지원</a>
          </div>
          <div className="text-xs text-stone-400">© 2024 Space Moduler AI. 모든 권리 보유.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm hover:shadow-md transition-all">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-brown/10 text-primary-brown">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-600">{desc}</p>
    </div>
  </div>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div>
    <div className="text-3xl font-black mb-1">{value}</div>
    <div className="text-xs font-medium uppercase tracking-widest opacity-80">{label}</div>
  </div>
);

export default LandingPage;
