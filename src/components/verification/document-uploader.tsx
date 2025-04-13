// import * as React from "react";
// import { Card } from "@/components/ui/card";
// import type { ReactNode } from "react";

// interface DocumentUploaderProps {
//   type: string;
//   title: string;
//   icon: ReactNode;
//   onUpload: (type: any, file: File) => void;
// }

// export function DocumentUploader({
//   type,
//   title,
//   icon,
//   onUpload,
// }: DocumentUploaderProps) {
//   const [isDragging, setIsDragging] = React.useState(false);

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       onUpload(type, files[0]);
//     }
//   };

//   const handleClick = () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = (e) => {
//       const files = (e.target as HTMLInputElement).files;
//       if (files && files.length > 0) {
//         onUpload(type, files[0]);
//       }
//     };
//     input.click();
//   };

//   return (
//     <Card
//       className={`flex flex-col items-center justify-center p-6 h-[150px] bg-card border-card-foreground/10 cursor-pointer transition-all ${
//         isDragging ? "border-success border-2" : ""
//       }`}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       onClick={handleClick}
//     >
//       <div className="flex items-center justify-center mb-3">{icon}</div>
//       <div className="text-center">
//         <p className="font-medium text-sm">{title}</p>
//         <p className="text-xs text-muted-foreground mt-1">
//           drag and drop the document to this area
//         </p>
//       </div>
//     </Card>
//   );
// }



"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface DocumentUploaderProps {
  type: string;
  title: string;
  icon: ReactNode;
  onUpload: (type: any, file: File) => void;
  onRemove?: (type: string) => void;
  uploadedFile?: {
    name: string;
    uploadedDate: string;
  } | null;
}

export function DocumentUploader({
  type,
  title,
  icon,
  onUpload,
  onRemove,
  uploadedFile,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (uploadedFile) return; // Prevent drag if already uploaded
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (uploadedFile) return; // Prevent drop if already uploaded
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(type, files[0]);
    }
  };

  const handleClick = () => {
    if (uploadedFile) return; // Prevent click if already uploaded

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

  const handleRemove = () => {
    if (onRemove) {
      onRemove(type);
    }
  };

  // If file is uploaded, show a different UI
  if (uploadedFile) {
    return (
      <Card className="flex flex-col p-6 h-[200px] bg-card border-card-foreground/10 relative">
        <div className="absolute top-2 right-2">
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Check className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-primary mt-1">Uploaded</p>
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-full">
            {uploadedFile.name}
          </p>
        </div>
      </Card>
    );
  }

  // Default UI for uploading
  return (
    <Card
      className={`flex flex-col items-center justify-center p-6 h-[200px] bg-card border-card-foreground/10 cursor-pointer transition-all ${
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
