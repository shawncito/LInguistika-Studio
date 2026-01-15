
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all ${props.className || ''}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all ${props.className || ''}`}
  >
    {props.children}
  </select>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
  <label {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${props.className || ''}`}>
    {children}
  </label>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' }> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
