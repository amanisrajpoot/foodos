// FoodOS Unified Design System Tokens & Style Generators

export const theme = {
  colors: {
    bgDark: '#0b0f19',
    bgCard: '#151c2c',
    bgCardHover: '#1c253b',
    border: '#26334d',
    borderLight: '#334155',
    
    // Primary Accents
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      900: '#78350f',
    },
    indigo: {
      50: '#eep2ff',
      500: '#6366f1',
      600: '#4f46e5',
      900: '#312e81',
    },
    emerald: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      900: '#064e3b',
    },
    rose: {
      50: '#fff1f2',
      500: '#f43f5e',
      600: '#e11d48',
      900: '#881337',
    },
    slate: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    amberGlow: '0 0 20px -3px rgba(245, 158, 11, 0.35)',
    indigoGlow: '0 0 20px -3px rgba(99, 102, 241, 0.35)',
    emeraldGlow: '0 0 20px -3px rgba(16, 185, 129, 0.35)',
  },
};

export const getStatusBadgeStyle = (status: string) => {
  const normalized = (status || '').toUpperCase();
  switch (normalized) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'SERVED':
    case 'PAID':
    case 'VERIFIED':
    case 'READY':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-400',
      };
    case 'PREPARING':
    case 'IN_KITCHEN':
    case 'PROCESSING':
    case 'ONGOING':
    case 'INVITED':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        dot: 'bg-amber-400',
      };
    case 'QUEUED':
    case 'PLACED':
    case 'DRAFT':
    case 'PENDING':
    case 'SETUP':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/20',
        dot: 'bg-indigo-400',
      };
    case 'CANCELLED':
    case 'FAILED':
    case 'REJECTED':
    case 'CRITICAL':
    case 'EXPIRED':
    case 'SUSPENDED':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/20',
        dot: 'bg-rose-400',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
        dot: 'bg-slate-400',
      };
  }
};
