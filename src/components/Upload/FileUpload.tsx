
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { X, FileText, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/hooks/useWorkspace";
import { documentService } from "@/services/documentService";

type FileUploadProps = {
  onClose: () => void;
};

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
};

const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const { activeWorkspace } = useWorkspace();

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [activeWorkspace]
  );

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process files
  const handleFiles = (files: FileList) => {
    if (!activeWorkspace) {
      toast({
        title: "No workspace selected",
        description: "Please select a workspace before uploading files",
        variant: "destructive",
      });
      return;
    }

    const newFiles = Array.from(files).filter(
      // Only accept PDFs
      (file) => file.type === "application/pdf"
    );

    if (newFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are supported",
        variant: "destructive",
      });
    }

    if (newFiles.length === 0) return;

    const filesToAdd = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...filesToAdd]);

    // Upload each file
    filesToAdd.forEach((fileInfo) => {
      const file = newFiles.find((f) => f.name === fileInfo.name);
      if (file) {
        uploadFile(fileInfo.id, file);
      }
    });
  };

  // Actually upload file to API
  const uploadFile = async (fileId: string, file: File) => {
    if (!activeWorkspace) return;
    
    try {
      // Update progress to show upload started
      updateFileProgress(fileId, 10);
      
      // Upload to server
      const response = await documentService.uploadDocument(activeWorkspace.id, file);
      
      // Update progress during "processing" stage
      updateFileProgress(fileId, 50);
      
      // Poll for document status if needed
      // For this example, we'll just simulate a success after a delay
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => 
            f.id === fileId ? { ...f, progress: 100, status: "complete" } : f
          )
        );
        
        toast({
          title: "Upload complete",
          description: `${file.name} has been uploaded successfully`,
        });
      }, 1500);
      
    } catch (error) {
      console.error("File upload failed:", error);
      
      setUploadedFiles((prev) =>
        prev.map((f) => 
          f.id === fileId ? { ...f, progress: 0, status: "error" } : f
        )
      );
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}`,
        variant: "destructive",
      });
    }
  };
  
  // Helper to update file progress
  const updateFileProgress = (fileId: string, progress: number) => {
    setUploadedFiles((prev) =>
      prev.map((f) => 
        f.id === fileId ? { ...f, progress } : f
      )
    );
  };

  // Remove a file from the list
  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upload Documents</h2>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          "file-drop-zone",
          dragActive && "file-drop-zone-active"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDragEnd={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <FileText className="h-12 w-12 mx-auto mb-4 text-datagpt-blue" />
        
        <p className="text-lg font-medium mb-2">
          Drag and drop your PDF files here
        </p>
        
        <p className="text-sm text-muted-foreground mb-4">
          Or click the button below to browse files
        </p>
        
        <label htmlFor="file-upload">
          <Button className="bg-datagpt-blue hover:bg-datagpt-blue/90">
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center bg-datagpt-blue/10 rounded-md mr-3">
                    <FileText className="h-4 w-4 text-datagpt-blue" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    {file.status === "uploading" ? (
                      <Progress value={file.progress} className="h-1.5" />
                    ) : file.status === "complete" ? (
                      <div className="flex items-center text-sm text-datagpt-green">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Complete
                      </div>
                    ) : (
                      <div className="text-sm text-destructive">Error</div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          className="bg-datagpt-blue hover:bg-datagpt-blue/90"
          disabled={uploadedFiles.length === 0 || uploadedFiles.some(f => f.status === "uploading")}
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
