'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Clear form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark dark:text-light mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand bg-white dark:bg-dark text-dark dark:text-light"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark dark:text-light mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand bg-white dark:bg-dark text-dark dark:text-light"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-dark dark:text-light mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
          required
          placeholder="Message subject"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand bg-white dark:bg-dark text-dark dark:text-light"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark dark:text-light mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          required
          placeholder="Your message"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand bg-white dark:bg-dark text-dark dark:text-light"
        />
      </div>
      
      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        
        {submitStatus === 'success' && (
          <p className="mt-4 text-green-600 dark:text-green-400">
            Your message has been sent successfully!
          </p>
        )}
        
        {submitStatus === 'error' && (
          <p className="mt-4 text-red-600 dark:text-red-400">
            There was an error sending your message. Please try again.
          </p>
        )}
      </div>
    </form>
  );
} 