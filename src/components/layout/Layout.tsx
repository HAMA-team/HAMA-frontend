import { Outlet } from 'react-router-dom';
import { Header } from './Header';

interface LayoutProps {
  onSettingsClick: () => void;
}

export function Layout({ onSettingsClick }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <Header onSettingsClick={onSettingsClick} />
      <Outlet />
    </div>
  );
}
