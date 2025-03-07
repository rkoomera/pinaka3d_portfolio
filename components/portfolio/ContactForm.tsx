// components/portfolio/ContactForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');
    setErrorMessage('');
    
    console.log('Submitting form with data:', formState);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        // Extract error details from the response
        const errorMsg = data.error || 'Failed to submit form';
        let errorDetails = '';
        
        if (data.message) {
          errorDetails += `: ${data.message}`;
        }
        
        if (data.details) {
          errorDetails += ` (${data.details})`;
        }
        
        if (data.code) {
          errorDetails += ` [Code: ${data.code}]`;
        }
        
        throw new Error(`${errorMsg}${errorDetails}`);
      }
      
      console.log('Form submitted successfully!');
      setFormStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setFormStatus('idle');
    setErrorMessage('');
  };
  
  // If form was successfully submitted, show success message and reset button
  if (formStatus === 'success') {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-6 text-green-700 dark:text-green-300 transition-colors duration-200">
          <h3 className="text-lg font-medium mb-2">Thank you for your message!</h3>
          <p className="mb-4">I&apos;ll get back to you as soon as possible.</p>
          <Button 
            onClick={handleReset}
            className="px-6 py-3 text-base"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formStatus === 'error' && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-700 dark:text-red-300 transition-colors duration-200">
          <p>Something went wrong. Please try again or email me directly.</p>
          {errorMessage && (
            <p className="mt-2 text-xs font-mono">{errorMessage}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
          className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formState.subject}
          onChange={handleChange}
          required
          placeholder="What's this about?"
          className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
          placeholder="Your message"
          rows={7}
          className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200 resize-y"
        />
      </div>
      
      <div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="primary"
          className="w-full sm:w-auto px-6 py-3"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
}