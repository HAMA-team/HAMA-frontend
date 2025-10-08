import { NavLink } from 'react-router-dom';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `
    text-base font-medium transition-colors
    ${isActive
      ? 'text-primary-600'
      : 'text-gray-600 hover:text-gray-900'}
  `;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🦛</span>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-600)' }}>
              HAMA
            </h1>
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className={navLinkClass}>
              대시보드
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              채팅
            </NavLink>
            <NavLink to="/portfolio" className={navLinkClass}>
              포트폴리오
            </NavLink>
          </nav>

          {/* Settings Icon */}
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100
                       rounded-lg transition-colors"
            title="설정"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Mobile Menu Button (optional - for future) */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
