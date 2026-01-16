
import React from 'react';

// --- BUTTON (Material Style) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 select-none shadow-sm hover:shadow-md";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    outline: "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-none",
    destructive: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6",
    lg: "h-13 px-10 text-base",
    icon: "h-10 w-10 p-0 shadow-none",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- CARD (Material Paper) ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 border-b border-slate-50 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h3 className={`font-bold text-xl text-slate-900 tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-sm font-medium text-slate-500 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// --- FORM ---
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = "", ...props }) => (
  <label {...props} className={`text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider ${className}`}>
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${className}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = "", ...props }) => (
  <div className="relative group">
    <select
      {...props}
      className={`flex h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${className}`}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
    </div>
  </div>
);

// --- BADGE ---
export const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    secondary: "bg-blue-50 text-blue-700 border border-blue-100",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    destructive: "bg-red-50 text-red-700 border border-red-100",
    outline: "border border-slate-300 text-slate-600",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
  };
  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// --- TABLE ---
export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-slate-50/50 border-b border-slate-200">{children}</thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-100">{children}</tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = "", ...props }) => (
  <tr className={`transition-colors hover:bg-slate-50/50 ${className}`} {...props}>{children}</tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => (
  <th className={`h-12 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider ${className}`} {...props}>{children}</th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableDataCellElement>> = ({ children, className = "", ...props }) => (
  <td className={`p-6 text-sm text-slate-700 align-middle ${className}`} {...props}>{children}</td>
);

// --- DIALOG ---
export const Dialog: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
