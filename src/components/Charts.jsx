import { useApp } from '../context/AppContext';
import { formatCurrency } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="custom-tooltip-value">
          <span className="custom-tooltip-dot" style={{ background: entry.color }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{entry.name}:</span>
          <span>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// Pie tooltip
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{data.name}</p>
      <div className="custom-tooltip-value">
        <span className="custom-tooltip-dot" style={{ background: data.payload.color }} />
        <span>{formatCurrency(data.value)}</span>
      </div>
    </div>
  );
}

// Time-based chart
function TimeChart() {
  const { monthlyData, state, dispatch } = useApp();
  const chartType = state.chartType;
  
  const chartTabs = [
    { id: 'area', label: 'Area' },
    { id: 'bar', label: 'Bar' },
    { id: 'line', label: 'Line' },
  ];
  
  return (
    <div className="card animate-in">
      <div className="card-header">
        <div>
          <h2 className="card-title">Balance Trend</h2>
          <p className="card-subtitle">Income vs Expenses over time</p>
        </div>
        <div className="chart-tabs">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              className={`chart-tab ${chartType === tab.id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_CHART_TYPE', payload: tab.id })}
              id={`chart-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="url(#incomeGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
                <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" fill="url(#expenseGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            ) : (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Spending Pie Chart
function SpendingChart() {
  const { spendingByCategory } = useApp();
  const totalSpending = spendingByCategory.reduce((s, c) => s + c.value, 0);
  
  return (
    <div className="card animate-in">
      <div className="card-header">
        <div>
          <h2 className="card-title">Spending Breakdown</h2>
          <p className="card-subtitle">Expenses by category</p>
        </div>
      </div>
      <div className="card-body">
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingByCategory.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
              >
                {spendingByCategory.slice(0, 6).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend List */}
        <div className="spending-list" style={{ marginTop: 16 }}>
          {spendingByCategory.slice(0, 5).map((cat) => {
            const percent = totalSpending > 0 ? (cat.value / totalSpending * 100).toFixed(1) : 0;
            return (
              <div key={cat.name} className="spending-item">
                <span className="spending-item-color" style={{ background: cat.color }} />
                <div className="spending-item-info">
                  <div className="spending-item-label">{cat.name}</div>
                  <div className="spending-item-bar">
                    <div
                      className="spending-item-bar-fill"
                      style={{ width: `${percent}%`, background: cat.color }}
                    />
                  </div>
                </div>
                <div>
                  <span className="spending-item-amount">{formatCurrency(cat.value)}</span>
                  <span className="spending-item-percent">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Charts() {
  return (
    <div className="charts-grid">
      <TimeChart />
      <SpendingChart />
    </div>
  );
}
