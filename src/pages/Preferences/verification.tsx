"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Home, FileText, User } from "lucide-react";
import { VerificationCard } from "@/components/verification/verification-card";
import { DocumentUploader } from "@/components/verification/document-uploader";

// Document types
type DocumentType =
  | "id-front"
  | "id-back"
  | "residence"
  | "credit-card-front"
  | "credit-card-back"
  | "selfie";

// Document status
type DocumentStatus = "confirmed" | "pending" | "rejected";

// Document interface
interface Document {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  uploadedAt: string;
  processedAt?: string;
}

export default function Verification() {
  // Documents state
  const [documents, setDocuments] = React.useState<Document[]>([
    {
      id: "doc-1",
      type: "id-front",
      name: "Proof of Id",
      status: "confirmed",
      uploadedAt: "6/25/2024, 2:55:29 PM",
      processedAt: "6/25/2024, 3:12:00 PM",
    },
    {
      id: "doc-2",
      type: "id-back",
      name: "Proof of Id Back",
      status: "confirmed",
      uploadedAt: "6/25/2024, 2:55:33 PM",
      processedAt: "6/25/2024, 3:11:59 PM",
    },
    {
      id: "doc-3",
      type: "residence",
      name: "Proof of Residence",
      status: "confirmed",
      uploadedAt: "6/25/2024, 3:07:33 PM",
      processedAt: "6/25/2024, 3:11:58 PM",
    },
  ]);

  // Calculate progress
  const totalDocuments = 6;
  const confirmedDocuments = documents.filter(
    (doc) => doc.status === "confirmed"
  ).length;
  const progress = (confirmedDocuments / totalDocuments) * 100;

  // Handle document upload
  const handleUpload = (type: DocumentType, file: File) => {
    console.log("uploading:", type, file)
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      type,
      name: getDocumentName(type),
      status: "pending",
      uploadedAt: new Date().toLocaleString(),
    };

    setDocuments([...documents, newDocument]);

    // Simulate processing (in a real app, this would be an API call)
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDocument.id
            ? {
                ...doc,
                status: "confirmed",
                processedAt: new Date().toLocaleString(),
              }
            : doc
        )
      );
    }, 3000);
  };

  // Get document name based on type
  const getDocumentName = (type: DocumentType): string => {
    switch (type) {
      case "id-front":
        return "Proof of Id";
      case "id-back":
        return "Proof of Id Back";
      case "residence":
        return "Proof of Residence";
      case "credit-card-front":
        return "Credit Card Front";
      case "credit-card-back":
        return "Credit Card Back";
      case "selfie":
        return "Selfie";
    }
  };

  // Check if document is confirmed
  const isConfirmed = (type: DocumentType): boolean => {
    return documents.some(
      (doc) => doc.type === type && doc.status === "confirmed"
    );
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">VERIFICATION</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ID Front */}
        {isConfirmed("id-front") ? (
          <VerificationCard
            title="PROOF OF ID"
            confirmed={true}
            icon={<FileText className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="id-front"
            title="UPLOAD PROOF OF ID"
            icon={<FileText className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}

        {/* Proof of Residence */}
        {isConfirmed("residence") ? (
          <VerificationCard
            title="PROOF OF RESIDENCE"
            confirmed={true}
            icon={<Home className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="residence"
            title="UPLOAD PROOF OF RESIDENCE"
            icon={<Home className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}

        {/* Credit Card Front */}
        {isConfirmed("credit-card-front") ? (
          <VerificationCard
            title="CREDIT CARD FRONT"
            confirmed={true}
            icon={<CreditCard className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="credit-card-front"
            title="UPLOAD CREDIT CARD FRONT"
            icon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}

        {/* Credit Card Back */}
        {isConfirmed("credit-card-back") ? (
          <VerificationCard
            title="CREDIT CARD BACK"
            confirmed={true}
            icon={<CreditCard className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="credit-card-back"
            title="UPLOAD CREDIT CARD BACK"
            icon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}

        {/* ID Back */}
        {isConfirmed("id-back") ? (
          <VerificationCard
            title="PROOF OF ID BACK"
            confirmed={true}
            icon={<FileText className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="id-back"
            title="UPLOAD PROOF OF ID BACK"
            icon={<FileText className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}

        {/* Selfie */}
        {isConfirmed("selfie") ? (
          <VerificationCard
            title="SELFIE"
            confirmed={true}
            icon={<User className="h-8 w-8 text-success" />}
          />
        ) : (
          <DocumentUploader
            type="selfie"
            title="UPLOAD SELFIE"
            icon={<User className="h-8 w-8 text-muted-foreground" />}
            onUpload={handleUpload}
          />
        )}
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2 bg-muted" />
        <p className="text-muted-foreground">
          {confirmedDocuments} of {totalDocuments} of your documents have been
          uploaded and confirmed
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">List of uploaded documents</h2>

        <div className="rounded-md border border-border/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead className="text-foreground font-bold">
                  DOCUMENT
                </TableHead>
                <TableHead className="text-foreground font-bold">
                  TIME UPLOADED
                </TableHead>
                <TableHead className="text-foreground font-bold">
                  TIME PROCESSED
                </TableHead>
                <TableHead className="text-foreground font-bold">
                  STATUS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="bg-card/50 hover:bg-card">
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.uploadedAt}</TableCell>
                  <TableCell>{doc.processedAt || "Pending"}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge
          variant="outline"
          className="bg-success/10 text-success border-success/20"
        >
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        >
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          Rejected
        </Badge>
      );
    default:
      return null;
  }
}
