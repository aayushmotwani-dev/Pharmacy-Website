import React from 'react';
import { Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-coral-400 text-white hover:bg-coral-500 focus:ring-coral-400",
    secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    outline: "border-2 border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all 
          ${error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-white text-slate-900 dark:bg-slate-800 dark:text-white' 
            : 'border-slate-300 bg-white text-slate-900 dark:border-slate-600 focus:ring-coral-200 focus:border-coral-400 dark:bg-slate-800 dark:text-white'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <select
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all appearance-none 
          ${error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-white text-slate-900 dark:bg-slate-800 dark:text-white' 
            : 'border-slate-300 bg-white text-slate-900 dark:border-slate-600 focus:ring-coral-200 focus:border-coral-400 dark:bg-slate-800 dark:text-white'
          } ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all 
          ${error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-white text-slate-900 dark:bg-slate-800 dark:text-white' 
            : 'border-slate-300 bg-white text-slate-900 dark:border-slate-600 focus:ring-coral-200 focus:border-coral-400 dark:bg-slate-800 dark:text-white'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' }> = ({ children, variant = 'info' }) => {
  const styles = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-[60] flex items-center p-4 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-teal-500' : 'bg-red-500'} animate-in slide-in-from-right-full`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
      <p>{message}</p>
    </div>
  );
};