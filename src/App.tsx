import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { SettingsModal } from '@/components/settings';
import { Dashboard, Onboarding, Portfolio } from '@/pages';
import { Chat } from '@/pages/Chat';
import { Welcome } from '@/pages/Welcome';
import { Signup } from '@/pages/Signup';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 온보딩 완료 여부 확인
    const completed = localStorage.getItem('onboarding_completed') === 'true';
    setIsOnboardingComplete(completed);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Welcome & Signup - 온보딩 전 */}
        <Route path="/" element={isOnboardingComplete ? <Navigate to="/dashboard" /> : <Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Main App - Layout 적용 */}
        <Route element={<Layout onSettingsClick={() => setShowSettings(true)} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Route>
      </Routes>

      {/* Settings Modal - 전역 */}
      <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
    </Router>
  );
}

export default App;
