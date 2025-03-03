import { InputHTMLAttributes } from 'react';

// Create consistent form components
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
      {...props} 
    />
  );
} 