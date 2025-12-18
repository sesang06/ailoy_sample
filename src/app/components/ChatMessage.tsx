import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col gap-2 max-w-[70%]`}>
        <div
          className={`
            p-4 rounded-xl
            ${isUser 
              ? 'bg-zinc-700 text-zinc-100' 
              : 'bg-zinc-800 text-zinc-200'
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-zinc-600 px-2">
            {timestamp}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-zinc-300" />
        </div>
      )}
    </div>
  );
}
