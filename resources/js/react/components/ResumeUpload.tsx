import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2, Loader2, Tag } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ResumeUploadProps {
  onUpload: (file: File, field: string) => void;
  isAnalyzing: boolean;
}

export function ResumeUpload({ onUpload, isAnalyzing }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  
  // Load dynamic fields from the backend
  const fields = (window as any).AppConfig?.fieldsOfWork || [];

  const onDrop = useCallback((acceptedFiles: File[], _fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const dropzoneOptions: any = {
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isAnalyzing
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Dynamic Fields Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6 font-display">
          <Tag className="h-5 w-5 text-blue-600" />
          Select Target Industry
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {fields.map((field: any) => (
            <button
              key={field.id}
              onClick={() => setSelectedTag(field.name)}
              disabled={isAnalyzing}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                selectedTag === field.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50",
                isAnalyzing && "opacity-50 cursor-not-allowed"
              )}
            >
              {field.name}
            </button>
          ))}
        </div>
        
        {selectedTag && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm text-slate-600">
            {fields.find((f: any) => f.name === selectedTag)?.description}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {!file ? (
          <div
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer rounded-3xl border-2 border-dashed p-8 transition-all duration-300 ease-in-out md:col-span-2",
              isDragActive 
                ? "border-blue-500 bg-blue-50/50" 
                : "border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/50",
              isAnalyzing && "opacity-50 cursor-not-allowed"
            )}
            style={{ height: '300px' }}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                isDragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
              )}>
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </h3>
              <p className="mb-6 text-sm text-slate-500 max-w-xs">
                Drag and drop your PDF, DOCX or TXT file here.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> PDF</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> DOCX</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> TXT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-8 w-8" />
              </div>
              <div className="truncate">
                <h4 className="font-bold text-slate-900 text-lg truncate">{file.name}</h4>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {!isAnalyzing && (
                <button 
                  onClick={() => setFile(null)}
                  className="rounded-full p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
              
              <button
                onClick={() => onUpload(file, selectedTag)}
                disabled={!file || !selectedTag || isAnalyzing}
                className={cn(
                  "flex-1 md:flex-none px-8 py-3 rounded-full font-bold text-white transition-all",
                  (!file || !selectedTag || isAnalyzing)
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                )}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                  </span>
                ) : "Analyze Resume"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
