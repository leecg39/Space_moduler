import { ImageUpload } from '@/components/ui/ImageUpload';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Space Moduler</h1>
          <p className="text-gray-600">
            2D 평면도를 드래그 앤 드롭 하나로 3D 렌더링
          </p>
        </div>
        <ImageUpload />
      </div>
    </main>
  );
}
