import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getCategoryColor, allCategories, exportAsCSV, exportAsJSON } from '../data/mockData';
import {
  Search, Filter, Plus, Download, ChevronUp, ChevronDown,
  Edit2, Trash2, FileText, FileJson, ArrowUpDown, FileSpreadsheet,
  X, ChevronLeft, ChevronRight, Inbox,
} from 'lucide-react';

export default function TransactionsTable() {
  const { state, dispatch, paginatedTransactions, filteredTransactions, totalPages, isAdmin, addToast } = useApp();
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);
  
  // Close export menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExport(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  
  const handleSort = (field) => {
    dispatch({ type: 'SET_SORT', payload: field });
  };
  
  const SortIcon = ({ field }) => {
    if (state.sortField !== field) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return state.sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };
  
  const handleExport = (format) => {
    setShowExport(false);
    let content, filename, mimeType;
    
    if (format === 'csv') {
      content = exportAsCSV(filteredTransactions);
      filename = 'transactions.csv';
      mimeType = 'text/csv';
    } else {
      content = exportAsJSON(filteredTransactions);
      filename = 'transactions.json';
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filteredTransactions.length} transactions as ${format.toUpperCase()}`, 'success');
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    addToast('Transaction deleted successfully', 'success');
  };
  
  const uniqueCategories = [...new Set(state.transactions.map((t) => t.category))].sort();
  
  return (
    <div className="card animate-in">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            Transactions
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              marginLeft: 8,
              fontFamily: 'var(--font-primary)',
            }}>
              ({filteredTransactions.length} results)
            </span>
          </h2>
        </div>
        <div className="card-actions">
          {/* Export */}
          <div className="export-menu" ref={exportRef}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExport(!showExport)}
              id="export-btn"
            >
              <Download size={14} />
              Export
            </button>
            {showExport && (
              <div className="export-dropdown">
                <button className="export-dropdown-item" onClick={() => handleExport('csv')} id="export-csv">
                  <FileSpreadsheet size={16} />
                  Export as CSV
                </button>
                <button className="export-dropdown-item" onClick={() => handleExport('json')} id="export-json">
                  <FileJson size={16} />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
          
          {/* Add Transaction (Admin only) */}
          {isAdmin && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => dispatch({ type: 'OPEN_ADD_MODAL' })}
              id="add-transaction-btn"
            >
              <Plus size={14} />
              Add Transaction
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <div className="transactions-filters">
          <div className="header-search" style={{ flex: 1 }}>
            <Search />
            <input
              type="text"
              placeholder="Search by name, category..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="filter-input"
              style={{ paddingLeft: 36, width: '100%' }}
              id="transaction-search"
            />
          </div>
          
          <select
            value={state.filterType}
            onChange={(e) => dispatch({ type: 'SET_FILTER_TYPE', payload: e.target.value })}
            className="filter-select"
            id="filter-type"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select
            value={state.filterCategory}
            onChange={(e) => dispatch({ type: 'SET_FILTER_CATEGORY', payload: e.target.value })}
            className="filter-select"
            id="filter-category"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={state.filterStatus}
            onChange={(e) => dispatch({ type: 'SET_FILTER_STATUS', payload: e.target.value })}
            className="filter-select"
            id="filter-status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          
          {(state.searchQuery || state.filterType !== 'all' || state.filterCategory !== 'all' || state.filterStatus !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                dispatch({ type: 'SET_SEARCH', payload: '' });
                dispatch({ type: 'SET_FILTER_TYPE', payload: 'all' });
                dispatch({ type: 'SET_FILTER_CATEGORY', payload: 'all' });
                dispatch({ type: 'SET_FILTER_STATUS', payload: 'all' });
              }}
              id="clear-filters-btn"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="table-wrapper">
        {paginatedTransactions.length > 0 ? (
          <table className="data-table" id="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className={state.sortField === 'date' ? 'sorted' : ''}>
                  Date <span className="sort-icon"><SortIcon field="date" /></span>
                </th>
                <th onClick={() => handleSort('description')} className={state.sortField === 'description' ? 'sorted' : ''}>
                  Description <span className="sort-icon"><SortIcon field="description" /></span>
                </th>
                <th onClick={() => handleSort('category')} className={state.sortField === 'category' ? 'sorted' : ''}>
                  Category <span className="sort-icon"><SortIcon field="category" /></span>
                </th>
                <th>Type</th>
                <th onClick={() => handleSort('amount')} className={state.sortField === 'amount' ? 'sorted' : ''} style={{ textAlign: 'right' }}>
                  Amount <span className="sort-icon"><SortIcon field="amount" /></span>
                </th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{formatDate(txn.date)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{txn.description}</div>
                    {txn.status === 'pending' && (
                      <span style={{
                        fontSize: '0.688rem',
                        color: 'var(--warning)',
                        fontWeight: 600,
                      }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        background: `${getCategoryColor(txn.category)}15`,
                        color: getCategoryColor(txn.category),
                      }}
                    >
                      <span className="dot" style={{ background: getCategoryColor(txn.category) }} />
                      {txn.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${txn.type}`}>
                      {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`amount-cell ${txn.type}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => dispatch({ type: 'OPEN_EDIT_MODAL', payload: txn })}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(txn.id)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox />
            </div>
            <h3 className="empty-state-title">No transactions found</h3>
            <p className="empty-state-description">
              {state.searchQuery || state.filterType !== 'all' || state.filterCategory !== 'all'
                ? 'Try adjusting your filters or search query to find what you\'re looking for.'
                : 'Start by adding your first transaction to track your finances.'}
            </p>
            {isAdmin && !state.searchQuery && state.filterType === 'all' && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 20 }}
                onClick={() => dispatch({ type: 'OPEN_ADD_MODAL' })}
              >
                <Plus size={16} />
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Page {state.currentPage} of {totalPages} · {filteredTransactions.length} transactions
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={state.currentPage <= 1}
              onClick={() => dispatch({ type: 'SET_PAGE_NUMBER', payload: state.currentPage - 1 })}
              id="prev-page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (state.currentPage <= 3) {
                page = i + 1;
              } else if (state.currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = state.currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  className={`pagination-btn ${state.currentPage === page ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_PAGE_NUMBER', payload: page })}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              disabled={state.currentPage >= totalPages}
              onClick={() => dispatch({ type: 'SET_PAGE_NUMBER', payload: state.currentPage + 1 })}
              id="next-page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
