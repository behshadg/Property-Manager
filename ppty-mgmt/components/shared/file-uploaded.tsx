"use client";

import { useState, useCallback } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import Image from "next/image";

interface FileUploadProps {
  onUploadAction: (formData: FormData) => Promise<void>;
  value?: string[];
  onChangeAction?: (urls: string[]) => Promise<void>;
  onRemoveAction?: (url: string) => Promise<void>;
  accept?: string;
  multiple?: boolean;
}

export function FileUpload({
  onUploadAction,
  value = [],
  onChangeAction,
  onRemoveAction,
  accept = "image/*,application/pdf",
  multiple = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      await onUploadAction(formData);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadAction]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      await onUploadAction(formData);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadAction]);

  const handleRemove = useCallback(async (fileUrl: string) => {
    if (onRemoveAction) {
      try {
        await onRemoveAction(fileUrl);
      } catch (error) {
        console.error('Remove failed:', error);
      }
    }
  }, [onRemoveAction]);

  const isImage = (file: string) => {
    return file.match(/\.(jpg|jpeg|png|gif)$/i);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors hover:border-primary
          ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className={`cursor-pointer ${uploading ? 'cursor-not-allowed' : ''}`}>
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-1">
            {uploading ? 'Uploading...' : 'Drag and drop files here, or click to select files'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: {accept.split(',').join(', ')}
          </p>
        </label>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((file, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                {isImage(file) ? (
                  <div className="relative aspect-square">
                    <Image
                      src={file}
                      alt="Uploaded file"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-muted rounded-md">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {onRemoveAction && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}