import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { SettingsModal } from '@/components/settings';
import { Dashboard, Onboarding, Portfolio } from '@/pages';
import { Chat } from '@/pages/Chat';
import { Welcome } from '@/pages/Welcome';
import { Signup } from '@/pages/Signup';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 기본 경로는 대시보드로 이동 - 온보딩 우회 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Welcome & Signup - 선택적으로 접근 가능 */}
        <Route path="/welcome" element={<Welcome />} />
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
