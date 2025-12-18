import { Upload, Files } from 'lucide-react';
import { FileItem } from './FileItem';

interface File {
  id: string;
  name: string;
}

interface FileListProps {
  files: File[];
  selectedFileId: string | null;
  onFileSelect: (id: string) => void;
  onFileDelete: (id: string) => void;
  onFileUpload: (files: FileList) => void;
  onFileView: (id: string) => void;
}

export function FileList({ 
  files, 
  selectedFileId, 
  onFileSelect, 
  onFileDelete, 
  onFileUpload,
  onFileView
}: FileListProps) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="w-80 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <Files className="w-5 h-5 text-zinc-400" />
          <h2 className="text-zinc-200">Files</h2>
        </div>
        
        <label className="block">
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept=".txt,.md,text/*"
          />
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload File</span>
          </div>
        </label>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-500">No files uploaded yet</p>
            <p className="text-xs text-zinc-600 mt-1">Upload files to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <FileItem
                key={file.id}
                id={file.id}
                name={file.name}
                isSelected={selectedFileId === file.id}
                onSelect={onFileSelect}
                onDelete={onFileDelete}
                onView={onFileView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Re-export FileText for use in empty state
import { FileText } from 'lucide-react';
