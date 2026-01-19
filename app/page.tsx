'use client';

import { useState } from 'react';
import LandingPage from '@/components/screens/LandingPage';
import AnalysisPage from '@/components/screens/AnalysisPage';
import EditorPage from '@/components/screens/EditorPage';
import ViewerPage from '@/components/screens/ViewerPage';
import { AppStep } from '@/types';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const setView = useAppStore((state) => state.setView);

  const handleStartAnalysis = () => {
    setStep(AppStep.ANALYSIS);
    setView('upload');
  };

  const handleFinishAnalysis = () => {
    setStep(AppStep.EDITOR);
    setView('2d-preview');
  };

  const handleOpen3D = () => {
    setStep(AppStep.VIEWER);
    setView('3d-view');
  };

  const handleBackToLanding = () => {
    setStep(AppStep.LANDING);
    setView('upload');
  };

  const handleCancelAnalysis = () => {
    setStep(AppStep.LANDING);
    setView('upload');
  };

  const handleBackToEditor = () => {
    setStep(AppStep.EDITOR);
    setView('2d-preview');
  };

  return (
    <div className="min-h-screen">
      {step === AppStep.LANDING && (
        <LandingPage onUpload={handleStartAnalysis} />
      )}
      {step === AppStep.ANALYSIS && (
        <AnalysisPage onComplete={handleFinishAnalysis} onCancel={handleCancelAnalysis} />
      )}
      {step === AppStep.EDITOR && (
        <EditorPage onOpen3D={handleOpen3D} onBack={handleBackToLanding} />
      )}
      {step === AppStep.VIEWER && (
        <ViewerPage onBack={handleBackToEditor} />
      )}
    </div>
  );
}
