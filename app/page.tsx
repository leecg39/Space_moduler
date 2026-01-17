export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Space Moduler</h1>
        <p className="text-gray-600 mb-8">
          2D 평면도를 드래그 앤 드롭 하나로 3D 렌더링
        </p>
        <div className="inline-block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 w-96 h-64 flex items-center justify-center">
            <div>
              <p className="text-gray-500 mb-2">평면도 이미지를 여기에 드래그하세요</p>
              <p className="text-sm text-gray-400">또는</p>
              <button className="mt-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition">
                파일 선택
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            지원 형식: JPG, PNG, PDF (최대 10MB)
          </p>
        </div>
      </div>
    </main>
  );
}
