import { useApp } from '../context/AppContext';
import { formatCurrency } from '../data/mockData';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CountUp from 'react-countup';

export default function SummaryCards() {
  const { summary } = useApp();
  
  const cards = [
    {
      label: 'Total Balance',
      value: summary.balance,
      trend: '+12.5%',
      trendDir: 'up',
      trendLabel: 'vs last month',
      icon: Wallet,
      className: 'balance featured',
    },
    {
      label: 'Total Income',
      value: summary.totalIncome,
      trend: '+8.2%',
      trendDir: 'up',
      trendLabel: 'vs last month',
      icon: TrendingUp,
      className: 'income',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpenses,
      trend: '-3.1%',
      trendDir: 'down',
      trendLabel: 'vs last month',
      icon: TrendingDown,
      className: 'expense',
    },
    {
      label: 'Savings Rate',
      value: summary.savingsRate,
      isSavings: true,
      trend: '+2.4%',
      trendDir: 'up',
      trendLabel: 'improvement',
      icon: PiggyBank,
      className: 'savings',
    },
  ];
  
  return (
    <div className="summary-grid">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`summary-card ${card.className} animate-in`}>
            <div className="summary-card-header">
              <span className="summary-card-label">{card.label}</span>
              <div className="summary-card-icon">
                <Icon />
              </div>
            </div>
            <div className="summary-card-value">
              {card.isSavings ? (
                <>{card.value.toFixed(1)}%</>
              ) : (
                <>${card.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
              )}
            </div>
            <div className={`summary-card-trend ${card.trendDir}`}>
              {card.trendDir === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}
              {card.trend}
              <span>{card.trendLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
