'use client';

import { useState } from 'react';

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

interface ProfileTabsProps {
  experiences: ExperienceItem[];
  education: EducationItem[];
}

export function ProfileTabs({ experiences, education }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  
  return (
    <div className="lg:col-span-7">
      {/* Section title to match skill column */}
      <h3 className="text-xl text-black dark:text-white border-b border-gray-300 dark:border-gray-600 pb-3 mb-8 flex items-center">
        <span className="h-5 w-1 bg-brand mr-3 rounded-full"></span>
        Professional Experience
      </h3>
      
      {/* Tabs - Clean and elegant */}
      <div className="flex relative mb-8">
        <button
          onClick={() => setActiveTab('experience')}
          className="w-44 py-3 font-normal text-base whitespace-nowrap transition-colors duration-200 relative z-10 text-center"
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className="w-32 py-3 font-normal text-base transition-colors duration-200 relative z-10 text-center"
        >
          Education
        </button>
        
        {/* Sliding background indicator */}
        <div 
          className="absolute bottom-0 h-full bg-gray-100 dark:bg-gray-800 transition-all duration-300 ease-in-out"
          style={{
            width: activeTab === 'experience' ? '176px' : '128px',
            left: activeTab === 'education' ? '176px' : '0',
            borderBottom: '2px solid',
            borderColor: 'var(--brand, #7645fc)'
          }}
        ></div>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'experience' && (
          <div className="space-y-12 animate-fadeIn">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-8 md:pl-10 group">
                {/* Timeline dot and line */}
                <div className="absolute top-0 left-0 h-full w-px bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors duration-300">
                  <div className="absolute -left-[5px] top-1 h-[11px] w-[11px] rounded-full bg-brand group-hover:scale-110 transition-transform duration-300"></div>
                </div>
                
                <div className="pb-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-normal text-black dark:text-white transition-colors duration-200">
                        {exp.position}
                      </h3>
                      <div className="text-base text-brand">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-200 ml-4 whitespace-nowrap border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full self-start bg-white/5 dark:bg-gray-800">
                      {exp.duration}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'education' && (
          <div className="space-y-12 animate-fadeIn">
            {education.map((edu, index) => (
              <div key={index} className="relative pl-8 md:pl-10 group">
                {/* Timeline dot and line */}
                <div className="absolute top-0 left-0 h-full w-px bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors duration-300">
                  <div className="absolute -left-[5px] top-1 h-[11px] w-[11px] rounded-full bg-brand group-hover:scale-110 transition-transform duration-300"></div>
                </div>
                
                <div className="pb-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-normal text-black dark:text-white transition-colors duration-200">
                        {edu.degree}
                      </h3>
                      <div className="text-base text-brand">
                        {edu.institution}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-200 ml-4 whitespace-nowrap border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full self-start bg-white/5 dark:bg-gray-800">
                      {edu.duration}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 