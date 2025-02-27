'use client';

import { useState, useEffect } from 'react';

interface StatsItem {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsItem[]>([
    { label: 'Messages', value: '...', change: 0, changeLabel: 'from last week' },
    { label: 'Projects', value: '...', change: 0, changeLabel: 'from last month' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch message count
        const messagesResponse = await fetch('/api/contact/messages');
        const messagesData = await messagesResponse.json();
        
        // Fetch project count
        const projectsResponse = await fetch('/api/projects/count');
        const projectsData = await projectsResponse.json();
        
        setStats([
          { 
            label: 'Messages', 
            value: messagesData.count || 0, 
            change: 0, 
            changeLabel: 'from last week' 
          },
          { 
            label: 'Projects', 
            value: projectsData.count || 0, 
            change: 0, 
            changeLabel: 'from last month' 
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-dark-secondary border border-light-secondary dark:border-dark-secondary rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-dark-secondary dark:text-light-secondary font-medium mb-2">
            {stat.label}
          </h3>
          <p className="text-3xl font-bold text-dark dark:text-light mb-2">
            {loading ? '...' : stat.value}
          </p>
          {stat.change !== undefined && (
            <div className="flex items-center text-sm">
              <span className={`font-medium ${stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
              <span className="text-dark-secondary dark:text-light-secondary ml-1">
                {stat.changeLabel}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 