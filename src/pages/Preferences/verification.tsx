import { useState, useEffect } from "react";
import { FileText, User, Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentUploader } from "@/components/verification/document-uploader";

type UploadedFile = {
  id: string;
  type: string;
  name: string;
  uploadedDate: string;
  processedDate: string | null;
  status: "pending" | "verified";
};

export default function VerificationPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);

  // Calculate progress based on number of uploaded files (out of 4 possible uploads)
  useEffect(() => {
    setProgress((uploadedFiles.length / 4) * 100);
  }, [uploadedFiles]);

  const handleUpload = (type: string, file: File) => {
    // Check if this type already exists and replace it if it does
    const newFiles = uploadedFiles.filter((f) => f.type !== type);

    // Add the new file
    setUploadedFiles([
      ...newFiles,
      {
        id: Math.random().toString(36).substring(2, 9),
        type,
        name: file.name,
        uploadedDate: new Date().toLocaleString(),
        processedDate: null,
        status: "pending",
      },
    ]);
  };

  const handleRemove = (type: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.type !== type));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "selfie":
        return "Selfie";
      case "proof_of_address":
        return "Proof of Address";
      case "business_license":
        return "Business License";
      case "tax_document":
        return "Tax Document";
      default:
        return type;
    }
  };

  // Helper function to get uploaded file info for a specific type
  const getUploadedFile = (type: string) => {
    const file = uploadedFiles.find((f) => f.type === type);
    if (!file) return null;

    return {
      name: file.name,
      uploadedDate: file.uploadedDate,
    };
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Identity Verification</h1>

      {/* Document Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DocumentUploader
          type="selfie"
          title="Upload Selfie"
          icon={<User className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          onRemove={handleRemove}
          uploadedFile={getUploadedFile("selfie")}
        />

        <DocumentUploader
          type="proof_of_address"
          title="Upload Proof of Address"
          icon={<FileText className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          onRemove={handleRemove}
          uploadedFile={getUploadedFile("proof_of_address")}
        />

        <DocumentUploader
          type="business_license"
          title="Upload Business License"
          icon={<Building className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          onRemove={handleRemove}
          uploadedFile={getUploadedFile("business_license")}
        />

        <DocumentUploader
          type="tax_document"
          title="Upload Tax Document"
          icon={<FileText className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          onRemove={handleRemove}
          uploadedFile={getUploadedFile("tax_document")}
        />
      </div>

      {/* Verification Status Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <VerificationCard
          title="Identity Verification"
          confirmed={uploadedFiles.some((f) => f.type === "selfie")}
          icon={<User className="h-6 w-6 text-muted-foreground" />}
        />

        <VerificationCard
          title="Address Verification"
          confirmed={uploadedFiles.some((f) => f.type === "proof_of_address")}
          icon={<FileText className="h-6 w-6 text-muted-foreground" />}
        />
      </div> */}

      {/* Progress Bar and File Count Visualization - Moved before the table */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Verification Progress</span>
          <span className="text-sm font-medium">
            {uploadedFiles.length} of 4
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />

        {/* File Count Visualization */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            "selfie",
            "proof_of_address",
            "business_license",
            "tax_document",
          ].map((docType) => {
            const isUploaded = uploadedFiles.some((f) => f.type === docType);
            return (
              <div key={docType} className="relative">
                <div
                  className={`h-2 rounded-full ${
                    isUploaded ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div className="mt-2 text-xs text-center">
                  {getTypeLabel(docType).split(" ")[0]}
                  <span
                    className={`ml-1 ${
                      isUploaded
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isUploaded ? "✓" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Files Table */}
      <Card className="mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Uploaded Documents</h2>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Time Uploaded</TableHead>
                <TableHead>Time Processed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      {getTypeLabel(file.type)}
                    </TableCell>
                    <TableCell>{file.uploadedDate}</TableCell>
                    <TableCell>{file.processedDate || "Pending"}</TableCell>
                    <TableCell>
                      <span
                        className={
                          file.status === "verified"
                            ? "text-success"
                            : "text-amber-500"
                        }
                      >
                        {file.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No documents uploaded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Please upload all required documents to complete your verification
          process. All documents must be clear, unmodified, and show your full
          information.
        </p>
      </Card>
    </div>
  );
}
