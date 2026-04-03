import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { allCategories } from '../data/mockData';
import { X } from 'lucide-react';

export default function TransactionModal() {
  const { state, dispatch, addToast } = useApp();
  const isEdit = state.showEditModal;
  const show = state.showAddModal || state.showEditModal;
  
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
  });
  
  useEffect(() => {
    if (isEdit && state.editingTransaction) {
      const t = state.editingTransaction;
      setForm({
        description: t.description,
        amount: t.amount.toString(),
        type: t.type,
        category: t.category,
        date: new Date(t.date).toISOString().split('T')[0],
      });
    } else if (state.showAddModal) {
      setForm({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isEdit, state.editingTransaction, state.showAddModal]);
  
  if (!show) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.description.trim() || !form.amount || parseFloat(form.amount) <= 0) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    const txnData = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: new Date(form.date).toISOString(),
    };
    
    if (isEdit) {
      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: { ...txnData, id: state.editingTransaction.id },
      });
      addToast('Transaction updated successfully', 'success');
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: txnData });
      addToast('Transaction added successfully', 'success');
    }
  };
  
  const handleClose = () => {
    dispatch({ type: isEdit ? 'CLOSE_EDIT_MODAL' : 'CLOSE_ADD_MODAL' });
  };
  
  const incomeCategories = allCategories.filter((c) =>
    ['Salary', 'Freelance', 'Investment', 'Refund'].includes(c.name)
  );
  const expenseCategories = allCategories.filter(
    (c) => !['Salary', 'Freelance', 'Investment', 'Refund'].includes(c.name)
  );
  const categoryList = form.type === 'income' ? incomeCategories : expenseCategories;
  
  // Update category when type changes
  const handleTypeChange = (type) => {
    const cats = type === 'income' ? incomeCategories : expenseCategories;
    setForm({ ...form, type, category: cats[0]?.name || '' });
  };
  
  return (
    <div className="modal-overlay" onClick={handleClose} id="transaction-modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()} id="transaction-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type Selection */}
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <div className="role-switcher" style={{ width: '100%', justifyContent: 'center' }}>
                <button
                  type="button"
                  className={`role-btn ${form.type === 'income' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('income')}
                  style={form.type === 'income' ? { background: 'var(--success)', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)' } : {}}
                >
                  ↑ Income
                </button>
                <button
                  type="button"
                  className={`role-btn ${form.type === 'expense' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('expense')}
                  style={form.type === 'expense' ? { background: 'var(--danger)', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)' } : {}}
                >
                  ↓ Expense
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-description">Description</label>
              <input
                type="text"
                className="form-input"
                id="txn-description"
                placeholder="Enter description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            
            {/* Amount + Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="txn-amount">Amount ($)</label>
                <input
                  type="number"
                  className="form-input"
                  id="txn-amount"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="txn-date">Date</label>
                <input
                  type="date"
                  className="form-input"
                  id="txn-date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
            </div>
            
            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-category">Category</label>
              <select
                className="form-input"
                id="txn-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ appearance: 'auto' }}
              >
                {categoryList.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="save-transaction-btn">
              {isEdit ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
