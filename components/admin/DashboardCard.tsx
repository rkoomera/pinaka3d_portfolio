'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  href: string;
  count?: number;
  countLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function DashboardCard({
  title,
  description,
  icon,
  href,
  count,
  countLabel = 'items',
  color = 'blue',
}: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const iconColorClass = colorClasses[color];
  
  return (
    <Link 
      href={href}
      className="flex flex-col h-full bg-light dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconColorClass}`}>
            {icon}
          </div>
          {count !== undefined && (
            <div className="text-right">
              <p className="text-3xl font-bold text-dark dark:text-light">{count}</p>
              <p className="text-text-light dark:text-light-secondary text-sm">{countLabel}</p>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-dark dark:text-light mb-2 transition-colors duration-200">
          {title}
        </h2>
        
        <div className="text-text-light dark:text-light-secondary transition-colors duration-200">
          {description}
        </div>
      </div>
      
      <div className="px-6 py-3 bg-light-secondary dark:bg-dark-secondary border-t border-light-border dark:border-dark-border mt-auto">
        <span className="text-sm font-medium text-brand flex items-center">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );
} 