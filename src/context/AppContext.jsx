import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  transactions as initialTransactions,
  calculateSummary,
  getMonthlyData,
  getSpendingByCategory,
  getInsights,
} from '../data/mockData';

const AppContext = createContext(null);

// Local storage keys
const STORAGE_KEYS = {
  THEME: 'finflow-theme',
  ROLE: 'finflow-role',
  TRANSACTIONS: 'finflow-transactions',
  SIDEBAR: 'finflow-sidebar',
};

// Load from localStorage
function loadState() {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    const role = localStorage.getItem(STORAGE_KEYS.ROLE) || 'admin';
    const sidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR) !== 'collapsed';
    const savedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const transactions = savedTxns ? JSON.parse(savedTxns) : initialTransactions;
    return { theme, role, sidebar, transactions };
  } catch {
    return {
      theme: 'dark',
      role: 'admin',
      sidebar: true,
      transactions: initialTransactions,
    };
  }
}

const loaded = loadState();

const initialState = {
  theme: loaded.theme,
  role: loaded.role,
  sidebarOpen: loaded.sidebar,
  sidebarMobileOpen: false,
  activePage: 'dashboard',
  transactions: loaded.transactions,
  
  // Filters
  searchQuery: '',
  filterCategory: 'all',
  filterType: 'all',
  filterStatus: 'all',
  sortField: 'date',
  sortDirection: 'desc',
  currentPage: 1,
  itemsPerPage: 10,
  
  // Modals
  showAddModal: false,
  showEditModal: false,
  editingTransaction: null,
  
  // Toasts
  toasts: [],
  
  // Chart type
  chartType: 'area',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: !state.sidebarMobileOpen };
    case 'CLOSE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: false };
    case 'SET_PAGE':
      return { ...state, activePage: action.payload, sidebarMobileOpen: false };
    
    // Filters
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload, currentPage: 1 };
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload, currentPage: 1 };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload, currentPage: 1 };
    case 'SET_SORT': {
      const direction = state.sortField === action.payload && state.sortDirection === 'asc' ? 'desc' : 'asc';
      return { ...state, sortField: action.payload, sortDirection: direction };
    }
    case 'SET_PAGE_NUMBER':
      return { ...state, currentPage: action.payload };
    
    // Transactions CRUD
    case 'ADD_TRANSACTION': {
      const newTxn = {
        ...action.payload,
        id: Math.max(0, ...state.transactions.map((t) => t.id)) + 1,
        status: 'completed',
      };
      return { ...state, transactions: [newTxn, ...state.transactions], showAddModal: false };
    }
    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, transactions: updated, showEditModal: false, editingTransaction: null };
    }
    case 'DELETE_TRANSACTION': {
      const filtered = state.transactions.filter((t) => t.id !== action.payload);
      return { ...state, transactions: filtered };
    }
    
    // Modals
    case 'OPEN_ADD_MODAL':
      return { ...state, showAddModal: true };
    case 'CLOSE_ADD_MODAL':
      return { ...state, showAddModal: false };
    case 'OPEN_EDIT_MODAL':
      return { ...state, showEditModal: true, editingTransaction: action.payload };
    case 'CLOSE_EDIT_MODAL':
      return { ...state, showEditModal: false, editingTransaction: null };
    
    // Chart type
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.payload };
    
    // Toasts
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: Date.now() }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  }, [state.theme]);
  
  // Persist role
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, state.role);
  }, [state.role]);
  
  // Persist transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }, [state.transactions]);
  
  // Persist sidebar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, state.sidebarOpen ? 'open' : 'collapsed');
  }, [state.sidebarOpen]);
  
  // Auto-remove toasts
  useEffect(() => {
    if (state.toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: state.toasts[0].id });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.toasts]);
  
  // Derived data
  const filteredTransactions = getFilteredTransactions(state);
  const summary = calculateSummary(state.transactions);
  const monthlyData = getMonthlyData(state.transactions);
  const spendingByCategory = getSpendingByCategory(state.transactions);
  const insights = getInsights(state.transactions);
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / state.itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );
  
  const addToast = useCallback((message, type = 'success') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
  }, []);
  
  const value = {
    state,
    dispatch,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    summary,
    monthlyData,
    spendingByCategory,
    insights,
    addToast,
    isAdmin: state.role === 'admin',
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function getFilteredTransactions(state) {
  let txns = [...state.transactions];
  
  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    txns = txns.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }
  
  // Category filter
  if (state.filterCategory !== 'all') {
    txns = txns.filter((t) => t.category === state.filterCategory);
  }
  
  // Type filter
  if (state.filterType !== 'all') {
    txns = txns.filter((t) => t.type === state.filterType);
  }
  
  // Status filter
  if (state.filterStatus !== 'all') {
    txns = txns.filter((t) => t.status === state.filterStatus);
  }
  
  // Sort
  txns.sort((a, b) => {
    let aVal, bVal;
    switch (state.sortField) {
      case 'date':
        aVal = new Date(a.date);
        bVal = new Date(b.date);
        break;
      case 'amount':
        aVal = a.amount;
        bVal = b.amount;
        break;
      case 'description':
        aVal = a.description.toLowerCase();
        bVal = b.description.toLowerCase();
        break;
      case 'category':
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
        break;
      default:
        aVal = new Date(a.date);
        bVal = new Date(b.date);
    }
    
    if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  return txns;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
