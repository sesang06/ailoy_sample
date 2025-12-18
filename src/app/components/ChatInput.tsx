import { Send } from 'lucide-react';
import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask questions about the uploaded files..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1 resize-none bg-zinc-800 text-zinc-200 rounded-lg px-4 py-3
            placeholder:text-zinc-500 
            focus:outline-none focus:ring-2 focus:ring-zinc-700
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm
          "
          style={{ minHeight: '44px', maxHeight: '200px' }}
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="
            p-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors flex-shrink-0
          "
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-zinc-200" />
        </button>
      </div>
      
      <p className="text-xs text-zinc-600 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
