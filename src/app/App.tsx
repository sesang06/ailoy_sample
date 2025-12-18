import React, { useState, useCallback, useEffect } from 'react';
import { FileList } from './components/FileList';
import { ChatArea } from './components/ChatArea';
import { FileViewerDialog } from './components/FileViewerDialog';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import * as ai from 'ailoy-web';

interface File {
  id: string;
  name: string;
  content: string;
  size: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type LLMStatus = 'loaded' | 'not-loaded' | 'processing';

// LocalStorage keys
const STORAGE_KEY_FILES = 'llm-files';
const STORAGE_KEY_FILE_CONTENTS = 'llm-file-contents';

// LocalStorage utilities
const saveFilesToStorage = (files: File[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  } catch (error) {
    console.error('Failed to save files to localStorage:', error);
  }
};

const loadFilesFromStorage = (): File[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_FILES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load files from localStorage:', error);
    return [];
  }
};

const deleteFileFromStorage = (fileId: string) => {
  try {
    const files = loadFilesFromStorage();
    const updated = files.filter(f => f.id !== fileId);
    saveFilesToStorage(updated);
  } catch (error) {
    console.error('Failed to delete file from localStorage:', error);
  }
};

// Utility function to chunk text
const chunkText = (text: string, chunkSize: number = 500): string[] => {
  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [llmStatus, setLLMStatus] = useState<LLMStatus>('not-loaded');
  const [agent, setAgent] = useState<ai.Agent | null>(null);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);
  const [embeddingModel, setEmbeddingModel] = useState<ai.EmbeddingModel | null>(null);
  const [vectorStore, setVectorStore] = useState<ai.VectorStore | null>(null);
  const [knowledge, setKnowledge] = useState<ai.Knowledge | null>(null);

  // Load files from localStorage on mount and index them
  useEffect(() => {
    const initializeSampleFiles = async () => {
      const storedFiles = loadFilesFromStorage();
      if (storedFiles.length > 0) {
        setFiles(storedFiles);
        
        // Re-index stored files into vector store
        if (embeddingModel && vectorStore) {
          toast.info('Re-indexing stored files...');
          for (const file of storedFiles) {
            const chunks = chunkText(file.content);
            for (let i = 0; i < chunks.length; i++) {
              try {
                const embedding = await embeddingModel.infer(chunks[i]);
                console.log(chunks[i])
                await vectorStore.addVector({
                  embedding: embedding,
                  document: chunks[i],
                  metadata: {
                    fileName: file.name,
                    fileId: file.id,
                    chunkIndex: i,
                  },
                });
              } catch (error) {
                console.error(`Failed to re-index chunk ${i} of ${file.name}:`, error);
              }
            }
          }
          
          // Update knowledge
          const newKnowledge = ai.Knowledge.newVectorStore(vectorStore, embeddingModel);
          setKnowledge(newKnowledge);
          
          // Recreate agent with knowledge
          if (agent) {
            const langModel = await ai.LangModel.newLocal("Qwen/Qwen3-0.6B");
            const newAgent = new ai.Agent(langModel, undefined, newKnowledge);
            setAgent(newAgent);
          }
          
          toast.success(`Loaded ${storedFiles.length} file(s) from storage`);
        }
      } else {
        // Add sample file if no files exist
        const sampleFile: File = {
          id: 'sample-chainsaw-man',
          name: 'chainsaw_man_info.txt',
          content: `Chainsaw Man (チェンソーマン)

Overview:
Chainsaw Man is a Japanese manga series written and illustrated by Tatsuki Fujimoto. Part 1 was serialized in Weekly Shonen Jump from 2019 to 2021, and Part 2 has been serializing in Shonen Jump+ since 2022.

Main Characters:
- Denji: The protagonist. He gains the ability to transform into Chainsaw Man after making a contract with Pochita, the Chainsaw Devil.
- Makima: Leader of Public Safety Devil Hunter Special Division 4. The Control Devil.
- Power: A Blood Fiend. Denji's companion and partner.
- Aki Hayakawa: A Devil Hunter working for Public Safety. Denji's senior and mentor.

Plot Summary:
Denji is a poor young man who works as a Devil Hunter with Pochita, the Chainsaw Devil, to pay off his father's debt. One day, he is killed by the Zombie Devil, but Pochita becomes Denji's heart, reviving him as Chainsaw Man. After this transformation, he is recruited by Makima to join Public Safety and begins a new life as a Devil Hunter.

Key Features:
- Unique storytelling with unpredictable plot developments
- Perfect blend of dark fantasy and action
- Deep character psychology and emotional depth
- Social commentary and philosophical themes

Media Adaptations:
In October 2022, an anime adaptation produced by MAPPA was released. It gained massive attention for its exceptional animation quality and direction.

Awards and Recognition:
- Winner of the 66th Shogakukan Manga Award (Shonen Category)
- Ranked #1 in the Next Breakthrough Manga Rankings
- Ranked #1 in "Kono Manga ga Sugoi!" 2021 (Male Readers Category)`,
          size: 1024
        };

        setFiles([sampleFile]);
        saveFilesToStorage([sampleFile]);
        setSelectedFileId(sampleFile.id);

        // Index sample file
        if (embeddingModel && vectorStore) {
          const chunks = chunkText(sampleFile.content);
          for (let i = 0; i < chunks.length; i++) {
            try {
              const embedding = await embeddingModel.infer(chunks[i]);
              await vectorStore.addVector({
                embedding: embedding,
                document: chunks[i],
                metadata: {
                  fileName: sampleFile.name,
                  fileId: sampleFile.id,
                  chunkIndex: i,
                },
              });
            } catch (error) {
              console.error(`Failed to index chunk ${i}:`, error);
            }
          }
          
          // Update knowledge
          const newKnowledge = ai.Knowledge.newVectorStore(vectorStore, embeddingModel);
          setKnowledge(newKnowledge);
          
          // Recreate agent with knowledge
          if (agent) {
            const langModel = await ai.LangModel.newLocal("Qwen/Qwen3-0.6B");
            const newAgent = new ai.Agent(langModel, undefined, newKnowledge);
            setAgent(newAgent);
          }
        }
        
        toast.success('Sample file loaded: chainsaw_man_info.txt');
      }
    };

    if (embeddingModel && vectorStore) {
      initializeSampleFiles();
    }
  }, [embeddingModel, vectorStore]);

  // Initialize Ailoy models
  useEffect(() => {
    const initModels = async () => {
      try {
        setLLMStatus('processing');
        toast.info('Loading LLM and embedding models...');
        
        // Initialize language model
        const langModel = await ai.LangModel.newLocal("Qwen/Qwen3-0.6B");
        
        // Initialize embedding model for RAG
        const embModel = await ai.EmbeddingModel.newLocal("BAAI/bge-m3", {
          progressCallback: (progress: any) => {
            console.log('Embedding model loading:', progress);
          }
        });
        
        // Initialize vector store (dimension 1024 for BAAI/bge-m3)
        const vs = await ai.VectorStore.newFaiss(1024);
        
        setEmbeddingModel(embModel);
        setVectorStore(vs);
        
        // Create agent without knowledge initially
        const newAgent = new ai.Agent(langModel);
        setAgent(newAgent);
        
        setLLMStatus('loaded');
        toast.success('Models loaded successfully');
      } catch (error) {
        console.error('Failed to initialize models:', error);
        setLLMStatus('not-loaded');
        toast.error('Failed to load models');
      }
    };

    initModels();
  }, []);

  const handleFileUpload = useCallback(async (fileList: FileList) => {
    if (!embeddingModel || !vectorStore) {
      toast.error('Embedding model not ready. Please wait...');
      return;
    }

    const fileArray = Array.from(fileList);
    
    // Read all files
    const filePromises = fileArray.map(async (file) => {
      // Check if it's a text file
      if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        toast.error(`${file.name} is not a text file. Only text files are supported.`);
        return null;
      }

      try {
        const content = await file.text();
        return {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          content,
          size: file.size,
        };
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
        toast.error(`Failed to read ${file.name}`);
        return null;
      }
    });

    const newFiles = (await Promise.all(filePromises)).filter((f): f is File => f !== null);

    if (newFiles.length > 0) {
      // Add documents to vector store
      toast.info('Processing documents for RAG...');
      
      for (const file of newFiles) {
        const chunks = chunkText(file.content);
        console.log(`Processing ${file.name}: ${chunks.length} chunks`);
        
        for (let i = 0; i < chunks.length; i++) {
          try {
            const embedding = await embeddingModel.infer(chunks[i]);
            await vectorStore.addVector({
              embedding: embedding,
              document: chunks[i],
              metadata: {
                fileName: file.name,
                fileId: file.id,
                chunkIndex: i,
              },
            });
          } catch (error) {
            console.error(`Failed to embed chunk ${i} of ${file.name}:`, error);
          }
        }
      }

      // Update knowledge with new vector store
      const newKnowledge = ai.Knowledge.newVectorStore(vectorStore, embeddingModel);
      setKnowledge(newKnowledge);

      // Recreate agent with knowledge
      if (agent) {
        const langModel = await ai.LangModel.newLocal("Qwen/Qwen3-0.6B");
        const newAgent = new ai.Agent(langModel, undefined, newKnowledge);
        setAgent(newAgent);
      }

      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        saveFilesToStorage(updated);
        return updated;
      });
      toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} uploaded and indexed for RAG`);

      // Auto-select first file if none selected
      if (!selectedFileId && newFiles.length > 0) {
        setSelectedFileId(newFiles[0].id);
      }
    }
  }, [selectedFileId, embeddingModel, vectorStore, agent]);

  const handleFileDelete = useCallback((id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id);
      saveFilesToStorage(updated);
      return updated;
    });
    deleteFileFromStorage(id);
    toast.info('File deleted');

    // If deleted file was selected, clear selection
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  }, [selectedFileId]);

  const handleFileSelect = useCallback((id: string) => {
    setSelectedFileId(id);
  }, []);

  const handleFileView = useCallback((id: string) => {
    setViewingFileId(id);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!agent) {
      toast.error('LLM agent is not initialized');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setLLMStatus('processing');

    try {
      // Build message history for Ailoy agent
      let ailoyMessages: any[] = [];

      // Add conversation history
      messages.forEach(msg => {
        ailoyMessages.push({
          role: msg.role,
          contents: msg.content
        });
      });

      // Add current user message
      ailoyMessages.push({
        role: 'user',
        contents: content
      });

      // Use Ailoy agent.run() with RAG
      // If knowledge exists, it will automatically retrieve relevant documents
      const config = knowledge 
        ? { inference: { documentPolyfill: ai.getDocumentPolyfill("Qwen3") } }
        : undefined;

      let responseText = '';
      for await (const resp of agent.run(ailoyMessages, config)) {
        if (resp.message.contents?.[0]?.type === 'text') {
          responseText = resp.message.contents[0].text;
        }
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('LLM response error:', error);
      toast.error('Failed to generate response');
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLLMStatus('loaded');
    }
  }, [agent, messages, knowledge]);

  const handleClearConversation = useCallback(() => {
    setMessages([]);
    toast.info('Conversation cleared');
  }, []);

  const selectedFile = files.find((file) => file.id === selectedFileId);
  const viewingFile = files.find((file) => file.id === viewingFileId);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <FileList
        files={files}
        selectedFileId={selectedFileId}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onFileUpload={handleFileUpload}
        onFileView={handleFileView}
      />

      <ChatArea
        messages={messages}
        selectedFileName={selectedFile?.name || null}
        onSendMessage={handleSendMessage}
        onClearConversation={handleClearConversation}
        isLoading={isLoading}
        llmStatus={llmStatus}
      />

      {viewingFile && (
        <FileViewerDialog
          isOpen={!!viewingFileId}
          onClose={() => setViewingFileId(null)}
          fileName={viewingFile.name}
          fileContent={viewingFile.content}
          fileSize={viewingFile.size}
        />
      )}

      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;
