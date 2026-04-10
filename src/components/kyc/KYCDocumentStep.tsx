import { useState } from "react";
import { IdCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "@/components/verification/document-uploader";
import { uploadKycDocument } from "./kycUpload";

interface KYCDocumentStepProps {
  onBack: () => void;
  onNext: () => void;
}

interface UploadedRef {
  name: string;
  uploadedDate: string;
}

export function KYCDocumentStep({ onBack, onNext }: KYCDocumentStepProps) {
  const [front, setFront] = useState<UploadedRef | null>(null);
  const [back, setBack] = useState<UploadedRef | null>(null);

  const handleUpload = async (type: string, file: File) => {
    try {
      await uploadKycDocument(type, file);
      const meta = {
        name: file.name,
        uploadedDate: new Date().toLocaleDateString(),
      };
      if (type === "proof_of_id") setFront(meta);
      if (type === "proof_of_id_back") setBack(meta);
    } catch {
      // toast already shown by uploadKycDocument
    }
  };

  const canContinue = !!front && !!back;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.06)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[12px]"
            style={{
              background: "rgba(91,141,239,0.1)",
              color: "#5b8def",
            }}
          >
            <IdCard className="h-[1.05rem] w-[1.05rem]" />
          </div>
          <div>
            <div className="text-[1.05rem] font-extrabold text-[#eef2f7]">
              Identity Document
            </div>
            <div className="mt-0.5 text-[0.82rem] text-[#8b97a8]">
              Upload both sides of your government-issued ID. Color, all corners
              visible, no glare.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DocumentUploader
            type="proof_of_id"
            title="Upload ID — Front"
            icon={<FileText className="h-5 w-5 text-[#00dfa2]" />}
            onUpload={handleUpload}
            uploadedFile={front}
          />
          <DocumentUploader
            type="proof_of_id_back"
            title="Upload ID — Back"
            icon={<FileText className="h-5 w-5 text-[#00dfa2]" />}
            onUpload={handleUpload}
            uploadedFile={back}
          />
        </div>

        {/* Nav buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-white/[0.08] bg-white/[0.03] text-[#8b97a8] font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-[#eef2f7] hover:border-white/[0.12] transition-all active:scale-[0.98]"
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={!canContinue}
            onClick={onNext}
            className="bg-gradient-to-br from-[#00dfa2] to-[#00b881] text-[#07080c] font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-[0_4px_16px_rgba(0,223,162,0.2)] hover:shadow-[0_6px_24px_rgba(0,223,162,0.3)] hover:-translate-y-px transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
