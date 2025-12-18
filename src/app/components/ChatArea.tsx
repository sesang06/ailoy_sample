import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages: Message[];
  selectedFileName: string | null;
  onSendMessage: (message: string) => void;
  onClearConversation: () => void;
  isLoading?: boolean;
  llmStatus: 'loaded' | 'not-loaded' | 'processing';
}

export function ChatArea({ 
  messages, 
  selectedFileName, 
  onSendMessage, 
  onClearConversation,
  isLoading = false,
  llmStatus
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getStatusColor = () => {
    switch (llmStatus) {
      case 'loaded':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'not-loaded':
        return 'bg-red-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getStatusText = () => {
    switch (llmStatus) {
      case 'loaded':
        return 'LLM Ready';
      case 'processing':
        return 'Processing...';
      case 'not-loaded':
        return 'LLM Not Loaded';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-zinc-200">
              {selectedFileName || 'All Files'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs text-zinc-500">{getStatusText()}</span>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={onClearConversation}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-zinc-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear Conversation
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-zinc-400 mb-2">
              No conversation yet
            </h3>
            <p className="text-sm text-zinc-600 max-w-md">
              {selectedFileName 
                ? `Ask questions about ${selectedFileName} to get started` 
                : 'Start asking questions to interact with the local LLM. You can upload files for document-based answers.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="flex items-center gap-2 p-4 rounded-xl bg-zinc-800">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={onSendMessage}
        disabled={isLoading || llmStatus === 'not-loaded'}
        placeholder={
          llmStatus === 'not-loaded' 
            ? 'LLM not available...' 
            : selectedFileName 
              ? `Ask questions about ${selectedFileName}...`
              : 'Ask me anything...'
        }
      />
    </div>
  );
}
