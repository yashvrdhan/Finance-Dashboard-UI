import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toasts() {
  const { state, dispatch } = useApp();
  
  if (state.toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle />}
            {toast.type === 'error' && <AlertCircle />}
            {toast.type === 'info' && <Info />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button
            className="toast-close"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
