import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface FileViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileContent: string;
  fileSize: number;
}

export function FileViewerDialog({
  isOpen,
  onClose,
  fileName,
  fileContent,
  fileSize,
}: FileViewerDialogProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-zinc-900 border-zinc-700 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <DialogTitle className="text-lg text-zinc-100">{fileName}</DialogTitle>
              <p className="text-sm text-zinc-500 mt-1">
                {formatFileSize(fileSize)} • {fileContent.split('\n').length} lines
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 max-h-[60vh] overflow-y-auto">
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
              {fileContent}
            </pre>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

