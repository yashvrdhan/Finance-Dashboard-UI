import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  Wallet,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const secondaryItems = [
  { id: 'settings', label: 'Settings', icon: Settings, disabled: true },
  { id: 'help', label: 'Help Center', icon: HelpCircle, disabled: true },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const isCollapsed = !state.sidebarOpen;
  
  return (
    <>
      <div
        className={`sidebar-overlay ${state.sidebarMobileOpen ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' })}
      />
      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${state.sidebarMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Wallet size={20} />
          </div>
          <span className="sidebar-logo-text">FinFlow</span>
        </div>
        
        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${state.activePage === item.id ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                id={`nav-${item.id}`}
              >
                <Icon size={20} />
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            );
          })}
          
          <div className="sidebar-section-title">Support</div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="sidebar-nav-item"
                onClick={() => {}}
                style={{ opacity: 0.5 }}
                title="Coming soon"
                id={`nav-${item.id}`}
              >
                <Icon size={20} />
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-collapse-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            id="sidebar-collapse-btn"
          >
            <ChevronLeft size={20} />
            <span className="sidebar-nav-label">Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
