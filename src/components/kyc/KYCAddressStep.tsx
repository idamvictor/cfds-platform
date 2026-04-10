import { useState } from "react";
import { MapPinned, Zap, Building2, Landmark, FileSignature, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "@/components/verification/document-uploader";
import { uploadKycDocument } from "./kycUpload";

interface KYCAddressStepProps {
  onBack: () => void;
  onNext: () => void;
}

interface UploadedRef {
  name: string;
  uploadedDate: string;
}

const acceptedTypes = [
  { id: "utility", icon: Zap, name: "Utility Bill", hint: "Electricity, water, gas, internet" },
  { id: "bank", icon: Building2, name: "Bank Statement", hint: "Official bank or credit card statement" },
  { id: "gov", icon: Landmark, name: "Government Letter", hint: "Tax assessment or benefits letter" },
  { id: "lease", icon: FileSignature, name: "Lease Agreement", hint: "Signed rental or mortgage letter" },
];

export function KYCAddressStep({ onBack, onNext }: KYCAddressStepProps) {
  const [selectedDocType, setSelectedDocType] = useState("utility");
  const [uploaded, setUploaded] = useState<UploadedRef | null>(null);

  const handleUpload = async (type: string, file: File) => {
    try {
      await uploadKycDocument(type, file);
      setUploaded({
        name: file.name,
        uploadedDate: new Date().toLocaleDateString(),
      });
    } catch {
      // toast already shown
    }
  };

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
              background: "rgba(255,152,0,0.1)",
              color: "#FF9800",
            }}
          >
            <MapPinned className="h-[1.05rem] w-[1.05rem]" />
          </div>
          <div>
            <div className="text-[1.05rem] font-extrabold text-[#eef2f7]">
              Proof of Address
            </div>
            <div className="mt-0.5 text-[0.82rem] text-[#8b97a8]">
              Upload a document dated within the last 3 months that shows your
              name and residential address.
            </div>
          </div>
        </div>

        {/* Accepted document type pills (presentational) */}
        <div className="mb-5">
          <div className="mb-2.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
            Accepted Document Types
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {acceptedTypes.map((doc) => {
              const Icon = doc.icon;
              const active = selectedDocType === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocType(doc.id)}
                  className={`flex items-center gap-3 rounded-[12px] border-[1.5px] p-3 text-left transition-all ${
                    active
                      ? "border-[#00dfa2] bg-[rgba(0,223,162,0.08)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                  }`}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                    style={{
                      background: active
                        ? "rgba(0,223,162,0.12)"
                        : "rgba(255,255,255,0.04)",
                      color: active ? "#00dfa2" : "#8b97a8",
                    }}
                  >
                    <Icon className="h-[0.88rem] w-[0.88rem]" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-[0.84rem] font-bold ${
                        active ? "text-[#eef2f7]" : "text-[#eef2f7]"
                      }`}
                    >
                      {doc.name}
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-[#4a5468]">
                      {doc.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload zone */}
        <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
          Upload Document
        </div>
        <DocumentUploader
          type="proof_of_address"
          title="Address Proof"
          icon={<FileText className="h-5 w-5 text-[#00dfa2]" />}
          onUpload={handleUpload}
          uploadedFile={uploaded}
        />

        {/* Notice */}
        <div
          className="mt-4 flex items-start gap-2.5 rounded-[10px] border border-[rgba(74,144,226,0.2)] p-3"
          style={{ background: "rgba(74,144,226,0.06)" }}
        >
          <div className="mt-0.5 text-[0.82rem] text-[#4A90E2]">ⓘ</div>
          <div className="text-[0.78rem] leading-[1.5] text-[#8b97a8]">
            The document must display your{" "}
            <strong className="text-[#eef2f7]">full name</strong> and{" "}
            <strong className="text-[#eef2f7]">residential address</strong>{" "}
            exactly as entered in the previous step.
          </div>
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
            disabled={!uploaded}
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
