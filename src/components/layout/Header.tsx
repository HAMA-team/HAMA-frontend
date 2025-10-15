import { NavLink } from 'react-router-dom';
import { Settings, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onChatToggle?: () => void;
}

export function Header({ onSettingsClick, onChatToggle }: HeaderProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `
    text-sm font-medium transition-colors px-3 py-1.5 rounded-md
    ${isActive
      ? 'text-foreground bg-secondary'
      : 'text-muted-foreground hover:text-foreground'}
  `;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <h1 className="text-lg font-semibold tracking-tighter text-foreground">
              HAMA
            </h1>
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              대시보드
            </NavLink>
            <NavLink to="/portfolio" className={navLinkClass}>
              포트폴리오
            </NavLink>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onChatToggle && (
            <button
              onClick={onChatToggle}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-secondary h-9 px-3"
              title="채팅 열기"
            >
              <MessageSquare className="h-4 w-4 mr-2" strokeWidth={1.5} />
              <span>채팅</span>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-secondary h-9 w-9"
            title="설정"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
