import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import TransactionsTable from './components/TransactionsTable';
import InsightsPanel from './components/InsightsPanel';
import TransactionModal from './components/TransactionModal';
import Toasts from './components/Toasts';

function App() {
  const { state } = useApp();
  
  const renderContent = () => {
    switch (state.activePage) {
      case 'dashboard':
        return (
          <>
            <SummaryCards />
            <Charts />
          </>
        );
      case 'transactions':
        return <TransactionsTable />;
      case 'insights':
        return <InsightsPanel />;
      default:
        return <SummaryCards />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${!state.sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
      <TransactionModal />
      <Toasts />
    </div>
  );
}

export default App;
