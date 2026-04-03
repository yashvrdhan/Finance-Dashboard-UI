import { useApp } from '../context/AppContext';
import { formatCurrency, getSpendingByCategory } from '../data/mockData';
import {
  TrendingUp, TrendingDown, Activity, Target,
  Zap, BarChart3, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="custom-tooltip-value">
          <span className="custom-tooltip-dot" style={{ background: entry.color }} />
          <span>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPanel() {
  const { insights, monthlyData, spendingByCategory, summary } = useApp();
  
  const budgetUsed = summary.totalIncome > 0
    ? (summary.totalExpenses / summary.totalIncome * 100).toFixed(1)
    : 0;
  
  const budgetStatus = budgetUsed > 90 ? 'danger' : budgetUsed > 70 ? 'warning' : 'safe';
  
  return (
    <div>
      {/* Insight Cards */}
      <div className="insights-grid">
        {/* Highest Spending Category */}
        <div className="insight-card animate-in">
          <div className="insight-card-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <Zap />
          </div>
          <div className="insight-card-title">Highest Spending Category</div>
          <div className="insight-card-value">{insights.highestCategory.name}</div>
          <div className="insight-card-description">
            You spent <span className="insight-highlight">{formatCurrency(insights.highestCategory.value)}</span> this month on {insights.highestCategory.name.toLowerCase()}.
          </div>
        </div>
        
        {/* Monthly Expense Change */}
        <div className="insight-card animate-in">
          <div className="insight-card-icon" style={{
            background: insights.expenseChange <= 0 ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: insights.expenseChange <= 0 ? 'var(--success)' : 'var(--warning)',
          }}>
            {insights.expenseChange <= 0 ? <TrendingDown /> : <TrendingUp />}
          </div>
          <div className="insight-card-title">Expense Trend</div>
          <div className="insight-card-value" style={{
            color: insights.expenseChange <= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {insights.expenseChange > 0 ? '+' : ''}{insights.expenseChange}%
          </div>
          <div className="insight-card-description">
            {insights.expenseChange <= 0
              ? 'Great job! Your spending decreased compared to last month.'
              : 'Your expenses increased compared to last month. Consider reviewing your spending.'}
          </div>
        </div>
        
        {/* Average Daily Spend */}
        <div className="insight-card animate-in">
          <div className="insight-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <Activity />
          </div>
          <div className="insight-card-title">Average Daily Spend</div>
          <div className="insight-card-value">{formatCurrency(insights.avgDailySpend)}</div>
          <div className="insight-card-description">
            That's roughly <span className="insight-highlight">{formatCurrency(insights.avgDailySpend * 7)}/week</span> based on your current month's spending.
          </div>
        </div>
      </div>
      
      {/* Monthly Comparison + Budget Progress */}
      <div className="charts-grid" style={{ marginBottom: 28 }}>
        {/* Monthly Comparison Chart */}
        <div className="card animate-in">
          <div className="card-header">
            <div>
              <h2 className="card-title">Monthly Comparison</h2>
              <p className="card-subtitle">Income vs Expenses by month</p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Current vs Last Month */}
            <div className="comparison-grid" style={{ marginTop: 20 }}>
              <div className="comparison-item">
                <div className="comparison-item-label">This Month Income</div>
                <div className="comparison-item-value" style={{ color: 'var(--success)' }}>
                  {formatCurrency(insights.currentIncome)}
                </div>
                <div style={{ fontSize: '0.75rem', color: insights.incomeChange >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 4 }}>
                  {insights.incomeChange >= 0 ? <ArrowUpRight size={12} style={{ display: 'inline' }} /> : <ArrowDownRight size={12} style={{ display: 'inline' }} />}
                  {insights.incomeChange > 0 ? '+' : ''}{insights.incomeChange}% vs last month
                </div>
              </div>
              <div className="comparison-item">
                <div className="comparison-item-label">This Month Expenses</div>
                <div className="comparison-item-value" style={{ color: 'var(--danger)' }}>
                  {formatCurrency(insights.currentExpenses)}
                </div>
                <div style={{ fontSize: '0.75rem', color: insights.expenseChange <= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 4 }}>
                  {insights.expenseChange <= 0 ? <ArrowDownRight size={12} style={{ display: 'inline' }} /> : <ArrowUpRight size={12} style={{ display: 'inline' }} />}
                  {insights.expenseChange > 0 ? '+' : ''}{insights.expenseChange}% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Budget & Observations */}
        <div className="card animate-in">
          <div className="card-header">
            <div>
              <h2 className="card-title">Budget Health</h2>
              <p className="card-subtitle">How you're tracking against income</p>
            </div>
          </div>
          <div className="card-body">
            {/* Budget Progress */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Budget Utilization
                </span>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: budgetStatus === 'danger' ? 'var(--danger)' : budgetStatus === 'warning' ? 'var(--warning)' : 'var(--success)',
                }}>
                  {budgetUsed}%
                </span>
              </div>
              <div className="budget-progress-bar" style={{ height: 12, borderRadius: 6 }}>
                <div
                  className={`budget-progress-fill ${budgetStatus}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {formatCurrency(summary.totalExpenses)} spent
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  of {formatCurrency(summary.totalIncome)} income
                </span>
              </div>
            </div>
            
            {/* Observations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Key Observations
              </h3>
              
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Savings Rate: {summary.savingsRate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {summary.savingsRate >= 20 ? 'Excellent! You\'re saving above the recommended 20%.' : 'Try to increase savings to at least 20% of income.'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Top spending: {insights.highestCategory.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    This category accounts for the largest portion of your expenses.
                  </div>
                </div>
              </div>
              
              {insights.mostFrequent && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BarChart3 size={14} style={{ color: 'var(--info)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      Most frequent: {insights.mostFrequent.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Appeared {insights.mostFrequent.count} times this month.
                    </div>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={14} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {insights.totalTransactions} transactions this month
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Averaging {(insights.totalTransactions / new Date().getDate()).toFixed(1)} transactions per day.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Categories Breakdown */}
      <div className="card animate-in">
        <div className="card-header">
          <div>
            <h2 className="card-title">Category Breakdown</h2>
            <p className="card-subtitle">Detailed spending by category (all time)</p>
          </div>
        </div>
        <div className="card-body">
          <div className="spending-list">
            {spendingByCategory.map((cat) => {
              const totalSpending = spendingByCategory.reduce((s, c) => s + c.value, 0);
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
    </div>
  );
}
