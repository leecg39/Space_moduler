
import React, { useState } from 'react';
import LandingPage from './screens/LandingPage';
import AnalysisPage from './screens/AnalysisPage';
import EditorPage from './screens/EditorPage';
import ViewerPage from './screens/ViewerPage';
import { AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);

  const handleStartAnalysis = () => setStep(AppStep.ANALYSIS);
  const handleFinishAnalysis = () => setStep(AppStep.EDITOR);
  const handleOpen3D = () => setStep(AppStep.VIEWER);
  const handleBackToLanding = () => setStep(AppStep.LANDING);
  const handleCancelAnalysis = () => setStep(AppStep.LANDING);

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
        <ViewerPage onBack={() => setStep(AppStep.EDITOR)} />
      )}
    </div>
  );
};

export default App;
