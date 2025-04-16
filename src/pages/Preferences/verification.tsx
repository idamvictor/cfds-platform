import { useState } from "react";
import { FileText, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axiosInstance from "@/lib/axios";
import { DocumentUploader } from "@/components/verification/document-uploader";
import { DocumentsTable } from "@/components/verification/documents-table";
import { toast } from "@/components/ui/sonner";

type Document = {
  id: string;
  user_id: string;
  document: string[];
  type: string;
  status: string;
};

export default function VerificationPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingType, setEditingType] = useState<string | null>(null);

  // Calculate progress based on number of unique document types
  const progress =
    ((documents.length + (documents.find((d) => d.type === "id") ? 1 : 0)) /
      4) *
    100;

  const handleUpload = async (type: string, file: File) => {
    try {
      const formData = new FormData();

      switch (type) {
        case "selfie":
          formData.append("type", "selfie");
          formData.append("document", file);
          break;
        case "proof_of_id":
          formData.append("type", "id");
          formData.append("id_front", file);
          break;
        case "proof_of_id_back":
          formData.append("type", "id");
          formData.append("id_back", file);
          break;
        case "proof_of_address":
          formData.append("type", "proof_of_address");
          formData.append("document", file);
          break;
      }

      toast.loading(`Uploading ${getTypeLabel(type).toLowerCase()}...`);

      await axiosInstance.post("/update/kyc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingType(null);
      toast.success(`${getTypeLabel(type)} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Failed to upload ${getTypeLabel(
          type
        ).toLowerCase()}. Please try again.`
      );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "selfie":
        return "Selfie";
      case "proof_of_address":
        return "Proof of Address";
      case "proof_of_id":
        return "Proof of ID";
      case "proof_of_id_back":
        return "Proof of ID Back";
      default:
        return type;
    }
  };

  const isDocumentUploaded = (type: string) => {
    if (type === "proof_of_id") {
      return documents.some((doc) => doc.type === "id" && doc.document[0]);
    }
    if (type === "proof_of_id_back") {
      return documents.some((doc) => doc.type === "id" && doc.document[1]);
    }
    return documents.some((doc) => doc.type === type);
  };

  const handleEditDocument = (type: string) => {
    setEditingType(type);
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
          disabled={isDocumentUploaded("selfie") && editingType !== "selfie"}
        />

        <DocumentUploader
          type="proof_of_address"
          title="Upload Proof of Address"
          icon={<FileText className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          disabled={
            isDocumentUploaded("proof_of_address") &&
            editingType !== "proof_of_address"
          }
        />

        <DocumentUploader
          type="proof_of_id"
          title="Upload Proof of ID"
          icon={<FileText className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          disabled={
            isDocumentUploaded("proof_of_id") && editingType !== "proof_of_id"
          }
        />

        <DocumentUploader
          type="proof_of_id_back"
          title="Upload Proof of ID Back"
          icon={<FileText className="h-6 w-6 text-primary" />}
          onUpload={handleUpload}
          disabled={
            isDocumentUploaded("proof_of_id_back") &&
            editingType !== "proof_of_id_back"
          }
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Verification Progress</span>
          <span className="text-sm font-medium">
            {documents.length +
              (documents.find((d) => d.type === "id") ? 1 : 0)}{" "}
            of 4
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />

        {/* File Count Visualization */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            "selfie",
            "proof_of_address",
            "proof_of_id",
            "proof_of_id_back",
          ].map((docType) => {
            const isUploaded = isDocumentUploaded(docType);
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

      {/* Documents Table */}
      <DocumentsTable
        onEditDocument={handleEditDocument}
        onDocumentsChange={setDocuments}
      />

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
