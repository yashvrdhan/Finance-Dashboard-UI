import { useApp } from '../context/AppContext';
import { Menu, Search, Bell, Sun, Moon, Shield, Eye } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your financial overview.' },
  transactions: { title: 'Transactions', subtitle: 'Manage and explore your transaction history.' },
  insights: { title: 'Insights', subtitle: 'Discover patterns in your spending habits.' },
};

export default function Header() {
  const { state, dispatch, isAdmin } = useApp();
  const page = PAGE_TITLES[state.activePage] || PAGE_TITLES.dashboard;
  
  return (
    <header className="header" id="main-header">
      <div className="flex items-center gap-3">
        <button
          className="icon-btn mobile-menu-btn"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' })}
          id="mobile-menu-btn"
        >
          <Menu />
        </button>
        <div className="header-left">
          <h1 className="header-title">{page.title}</h1>
          <p className="header-subtitle">{page.subtitle}</p>
        </div>
      </div>
      
      <div className="header-right">
        {/* Global Search */}
        <div className="header-search">
          <Search />
          <input
            type="text"
            placeholder="Search transactions..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            id="global-search"
          />
        </div>
        
        {/* Role Switcher */}
        <div className="role-switcher" id="role-switcher">
          <button
            className={`role-btn ${state.role === 'viewer' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
            id="role-viewer"
          >
            <Eye size={12} style={{ marginRight: 4, display: 'inline' }} />
            Viewer
          </button>
          <button
            className={`role-btn ${state.role === 'admin' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
            id="role-admin"
          >
            <Shield size={12} style={{ marginRight: 4, display: 'inline' }} />
            Admin
          </button>
        </div>
        
        {/* Notifications */}
        <button className="icon-btn" id="notifications-btn">
          <Bell />
          <span className="badge" />
        </button>
        
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          id="theme-toggle"
          title={state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {state.theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        
        {/* Avatar */}
        <div className="avatar" id="user-avatar" title={isAdmin ? 'Admin User' : 'Viewer'}>
          {isAdmin ? 'A' : 'V'}
        </div>
      </div>
    </header>
  );
}
