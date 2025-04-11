import * as React from "react";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface DocumentUploaderProps {
  type: string;
  title: string;
  icon: ReactNode;
  onUpload: (type: any, file: File) => void;
}

export function DocumentUploader({
  type,
  title,
  icon,
  onUpload,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(type, files[0]);
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onUpload(type, files[0]);
      }
    };
    input.click();
  };

  return (
    <Card
      className={`flex flex-col items-center justify-center p-6 h-[150px] bg-card border-card-foreground/10 cursor-pointer transition-all ${
        isDragging ? "border-success border-2" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center mb-3">{icon}</div>
      <div className="text-center">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          drag and drop the document to this area
        </p>
      </div>
    </Card>
  );
}
