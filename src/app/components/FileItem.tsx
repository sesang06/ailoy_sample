import { Trash2, FileText, Eye } from 'lucide-react';
import { useState } from 'react';

interface FileItemProps {
  id: string;
  name: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function FileItem({ id, name, isSelected, onSelect, onDelete, onView }: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg cursor-pointer
        transition-all duration-200
        ${isSelected 
          ? 'bg-zinc-700 border border-zinc-600' 
          : 'hover:bg-zinc-800 border border-transparent'
        }
      `}
      onClick={() => onSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <span className="text-sm text-zinc-200 truncate">{name}</span>
      </div>
      
      {isHovered && (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(id);
            }}
            className="p-1 hover:bg-zinc-600 rounded transition-colors"
            aria-label="View file"
            title="View file contents"
          >
            <Eye className="w-4 h-4 text-zinc-400 hover:text-blue-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-1 hover:bg-zinc-600 rounded transition-colors"
            aria-label="Delete file"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}
