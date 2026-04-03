// Mock financial data — realistic transaction dataset for the dashboard

const CATEGORIES = {
  income: [
    { name: 'Salary', color: '#10b981' },
    { name: 'Freelance', color: '#6366f1' },
    { name: 'Investment', color: '#8b5cf6' },
    { name: 'Refund', color: '#3b82f6' },
  ],
  expense: [
    { name: 'Food & Dining', color: '#ef4444' },
    { name: 'Shopping', color: '#ec4899' },
    { name: 'Transportation', color: '#f59e0b' },
    { name: 'Entertainment', color: '#f97316' },
    { name: 'Bills & Utilities', color: '#14b8a6' },
    { name: 'Healthcare', color: '#6366f1' },
    { name: 'Education', color: '#8b5cf6' },
    { name: 'Rent', color: '#3b82f6' },
    { name: 'Subscriptions', color: '#a78bfa' },
    { name: 'Travel', color: '#06b6d4' },
  ],
};

const DESCRIPTIONS = {
  'Salary': ['Monthly Salary', 'Quarterly Bonus', 'Year-end Bonus', 'Overtime Pay'],
  'Freelance': ['Web Development Project', 'UI/UX Design Work', 'Consulting Fee', 'Content Writing'],
  'Investment': ['Stock Dividend', 'Crypto Gains', 'Mutual Fund Return', 'Bond Interest'],
  'Refund': ['Amazon Refund', 'Insurance Refund', 'Tax Return', 'Product Return'],
  'Food & Dining': ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Uber Eats Order', 'Lunch Meeting'],
  'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Decor', 'Gift Purchase'],
  'Transportation': ['Gas Station', 'Uber Ride', 'Monthly Metro Pass', 'Car Maintenance', 'Parking Fee'],
  'Entertainment': ['Movie Tickets', 'Concert Tickets', 'Gaming Purchase', 'Book Store'],
  'Bills & Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill'],
  'Healthcare': ['Doctor Visit', 'Pharmacy', 'Dental Checkup', 'Lab Tests', 'Insurance Premium'],
  'Education': ['Online Course', 'Book Purchase', 'Workshop Fee', 'Certification Exam'],
  'Rent': ['Monthly Rent', 'Maintenance Fee'],
  'Subscriptions': ['Netflix', 'Spotify', 'Adobe CC', 'GitHub Pro', 'Cloud Storage'],
  'Travel': ['Flight Tickets', 'Hotel Stay', 'Travel Insurance', 'Vacation Expenses'],
};

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransactions() {
  const transactions = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  let id = 1;
  
  // Generate income transactions
  for (let month = 0; month < 6; month++) {
    const monthDate = new Date(now);
    monthDate.setMonth(monthDate.getMonth() - month);
    
    // Salary — always on 1st
    const salaryDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    if (salaryDate <= now) {
      transactions.push({
        id: id++,
        date: salaryDate.toISOString(),
        description: 'Monthly Salary',
        amount: randomBetween(5200, 5800),
        type: 'income',
        category: 'Salary',
        status: 'completed',
      });
    }
    
    // Random freelance income
    if (Math.random() > 0.4) {
      const freelanceDescs = DESCRIPTIONS['Freelance'];
      transactions.push({
        id: id++,
        date: randomDate(
          new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
          new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
        ).toISOString(),
        description: freelanceDescs[Math.floor(Math.random() * freelanceDescs.length)],
        amount: randomBetween(500, 2500),
        type: 'income',
        category: 'Freelance',
        status: 'completed',
      });
    }
    
    // Occasional investment income
    if (Math.random() > 0.6) {
      const investDescs = DESCRIPTIONS['Investment'];
      transactions.push({
        id: id++,
        date: randomDate(
          new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
          new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
        ).toISOString(),
        description: investDescs[Math.floor(Math.random() * investDescs.length)],
        amount: randomBetween(100, 800),
        type: 'income',
        category: 'Investment',
        status: 'completed',
      });
    }
  }
  
  // Generate expense transactions
  for (let month = 0; month < 6; month++) {
    const monthDate = new Date(now);
    monthDate.setMonth(monthDate.getMonth() - month);
    
    CATEGORIES.expense.forEach((cat) => {
      const descs = DESCRIPTIONS[cat.name];
      const transactionCount = cat.name === 'Rent' ? 1 :
        cat.name === 'Bills & Utilities' ? Math.floor(Math.random() * 3) + 2 :
        cat.name === 'Food & Dining' ? Math.floor(Math.random() * 8) + 4 :
        cat.name === 'Shopping' ? Math.floor(Math.random() * 4) + 1 :
        cat.name === 'Subscriptions' ? Math.floor(Math.random() * 3) + 1 :
        Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < transactionCount; i++) {
        const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        const date = randomDate(startOfMonth, endOfMonth > now ? now : endOfMonth);
        
        const amountRanges = {
          'Rent': [1200, 1800],
          'Bills & Utilities': [40, 200],
          'Food & Dining': [8, 120],
          'Shopping': [20, 350],
          'Transportation': [5, 80],
          'Entertainment': [10, 100],
          'Healthcare': [25, 500],
          'Education': [15, 300],
          'Subscriptions': [5, 25],
          'Travel': [50, 800],
        };
        
        const [min, max] = amountRanges[cat.name] || [10, 100];
        
        transactions.push({
          id: id++,
          date: date.toISOString(),
          description: descs[Math.floor(Math.random() * descs.length)],
          amount: randomBetween(min, max),
          type: 'expense',
          category: cat.name,
          status: Math.random() > 0.05 ? 'completed' : 'pending',
        });
      }
    });
  }
  
  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
}

// Generate the data once
export const transactions = generateTransactions();

// Get all unique categories
export const allCategories = [
  ...CATEGORIES.income,
  ...CATEGORIES.expense,
];

// Get category color
export function getCategoryColor(categoryName) {
  const cat = allCategories.find((c) => c.name === categoryName);
  return cat ? cat.color : '#94a3b8';
}

// Calculate summary data
export function calculateSummary(txns) {
  const totalIncome = txns
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = txns
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  return { totalIncome, totalExpenses, balance, savingsRate };
}

// Get monthly data for charts
export function getMonthlyData(txns) {
  const monthMap = {};
  
  txns.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    if (!monthMap[key]) {
      monthMap[key] = { key, name: monthName, income: 0, expense: 0, balance: 0 };
    }
    
    if (t.type === 'income') {
      monthMap[key].income += t.amount;
    } else {
      monthMap[key].expense += t.amount;
    }
  });
  
  // Calculate balance
  const data = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key));
  
  let runningBalance = 0;
  data.forEach((d) => {
    runningBalance += (d.income - d.expense);
    d.balance = Math.round(runningBalance * 100) / 100;
    d.income = Math.round(d.income * 100) / 100;
    d.expense = Math.round(d.expense * 100) / 100;
  });
  
  return data;
}

// Get spending by category
export function getSpendingByCategory(txns) {
  const categoryMap = {};
  
  txns
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { name: t.category, value: 0, color: getCategoryColor(t.category) };
      }
      categoryMap[t.category].value += t.amount;
    });
  
  return Object.values(categoryMap)
    .map((c) => ({ ...c, value: Math.round(c.value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

// Get insights
export function getInsights(txns) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthTxns = txns.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const lastMonthTxns = txns.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  
  const currentExpenses = currentMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currentIncome = currentMonthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastIncome = lastMonthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  
  const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses * 100) : 0;
  const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome * 100) : 0;
  
  // Highest spending category
  const spending = getSpendingByCategory(currentMonthTxns);
  const highestCategory = spending[0] || { name: 'N/A', value: 0 };
  
  // Average daily spend
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = Math.min(now.getDate(), daysInMonth);
  const avgDailySpend = dayOfMonth > 0 ? currentExpenses / dayOfMonth : 0;
  
  // Most frequent transaction
  const descCount = {};
  currentMonthTxns.forEach((t) => {
    descCount[t.description] = (descCount[t.description] || 0) + 1;
  });
  const mostFrequent = Object.entries(descCount).sort((a, b) => b[1] - a[1])[0];
  
  return {
    currentExpenses: Math.round(currentExpenses * 100) / 100,
    lastExpenses: Math.round(lastExpenses * 100) / 100,
    currentIncome: Math.round(currentIncome * 100) / 100,
    lastIncome: Math.round(lastIncome * 100) / 100,
    expenseChange: Math.round(expenseChange * 10) / 10,
    incomeChange: Math.round(incomeChange * 10) / 10,
    highestCategory,
    avgDailySpend: Math.round(avgDailySpend * 100) / 100,
    mostFrequent: mostFrequent ? { name: mostFrequent[0], count: mostFrequent[1] } : null,
    totalTransactions: currentMonthTxns.length,
  };
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Export data as CSV
export function exportAsCSV(data) {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Status'];
  const rows = data.map((t) => [
    formatDate(t.date),
    t.description,
    t.amount.toFixed(2),
    t.type,
    t.category,
    t.status,
  ]);
  
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return csv;
}

// Export data as JSON
export function exportAsJSON(data) {
  return JSON.stringify(data, null, 2);
}

export default { CATEGORIES, DESCRIPTIONS };
