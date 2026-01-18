'use client';

import { useAppStore } from '@/lib/store';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isLoading = useAppStore((state) => state.ui.isLoading);
  const loadingMessage = useAppStore((state) => state.ui.loadingMessage);
  const loadingProgress = useAppStore((state) => state.ui.loadingProgress);

  return (
    <>
      {children}
      {isLoading && <LoadingScreen message={loadingMessage} progress={loadingProgress} />}
    </>
  );
}
