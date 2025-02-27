'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export function MessageList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages from client component');
        setLoading(true);
        const response = await fetch('/api/contact/messages');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        setMessages(data.messages || []);
        setDebugInfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(`Failed to load messages: ${err instanceof Error ? err.message : String(err)}`);
        
        // Try the debug endpoint as a fallback
        try {
          const debugResponse = await fetch('/api/contact/debug');
          const debugData = await debugResponse.json();
          setDebugInfo(debugData);
        } catch (debugErr) {
          console.error('Debug endpoint also failed:', debugErr);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Refresh messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleExpandMessage = async (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
    
    // If message is unread, mark it as read
    const message = messages.find(m => m.id === messageId);
    if (message && !message.read) {
      try {
        const response = await fetch(`/api/contact/messages/${messageId}/read`, {
          method: 'POST',
        });
        
        if (response.ok) {
          // Update the message in the local state
          setMessages(messages.map(m => 
            m.id === messageId ? { ...m, read: true } : m
          ));
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-500">{error}</div>
        {debugInfo && (
          <div className="p-4 border rounded bg-light-secondary dark:bg-dark-secondary overflow-auto">
            <h3 className="font-medium mb-2">Debug Information:</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12 border rounded-lg bg-light-secondary dark:bg-dark-secondary">
          <p className="text-dark-secondary dark:text-light-secondary">No messages found</p>
        </div>
        {debugInfo && (
          <div className="p-4 border rounded bg-light-secondary dark:bg-dark-secondary overflow-auto">
            <h3 className="font-medium mb-2">Debug Information:</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="mb-4 text-sm text-dark-secondary dark:text-light-secondary">
        Found {messages.length} message(s)
      </div>
      
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`border rounded-lg overflow-hidden transition-colors duration-200 ${
            message.read 
              ? 'border-light-border dark:border-dark-border' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}
        >
          <div 
            className="p-4 cursor-pointer"
            onClick={() => handleExpandMessage(message.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-grow flex items-center gap-3 overflow-hidden">
                {/* Name */}
                <div className="flex items-center min-w-[120px] max-w-[180px]">
                  <h3 className="text-sm font-medium text-dark dark:text-light truncate">
                    {message.name}
                  </h3>
                  {!message.read && (
                    <span className="ml-2 bg-brand text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      New
                    </span>
                  )}
                </div>
                
                {/* Subject */}
                <div className="min-w-[150px] max-w-[250px] px-2">
                  <h4 className="text-sm font-medium text-dark dark:text-light truncate">
                    {message.subject || 'No Subject'}
                  </h4>
                </div>
                
                {/* Message Preview */}
                <div className="flex-grow">
                  <p className="text-sm text-dark-secondary dark:text-light-secondary truncate">
                    {truncateText(message.message, 60)}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-4 text-right">
                <p className="text-xs text-dark-secondary dark:text-light-secondary whitespace-nowrap">
                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          </div>
          
          {expandedMessageId === message.id && (
            <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-medium text-dark-secondary dark:text-light-secondary mb-1">
                    From
                  </div>
                  <p className="text-dark dark:text-light">
                    {message.name} &lt;{message.email}&gt;
                  </p>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-dark-secondary dark:text-light-secondary mb-1">
                    Date
                  </div>
                  <p className="text-dark dark:text-light">
                    {format(new Date(message.created_at), 'PPP p')}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xs font-medium text-dark-secondary dark:text-light-secondary mb-1">
                  Subject
                </div>
                <p className="text-dark dark:text-light font-medium">
                  {message.subject || 'No Subject'}
                </p>
              </div>
              
              <div>
                <div className="text-xs font-medium text-dark-secondary dark:text-light-secondary mb-1">
                  Message
                </div>
                <p className="text-dark dark:text-light whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 