import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
}

/**
 * Upload a KYC document using the same contract as verification-old.tsx.
 * Adheres to the existing /update/kyc API — does not duplicate business logic,
 * only constructs the same FormData payload the existing flow uses.
 *
 * Allowed types match DocumentUploader's `type` prop:
 *   - "selfie"           → FormData: { type: "selfie", document: file }
 *   - "proof_of_address" → FormData: { type: "proof_of_address", document: file }
 *   - "proof_of_id"      → FormData: { type: "id", id_front: file }
 *   - "proof_of_id_back" → FormData: { type: "id", id_back: file }
 */
export async function uploadKycDocument(type: string, file: File): Promise<void> {
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
      default:
        throw new Error(`Unsupported KYC document type: ${type}`);
    }

    const label = getTypeLabel(type);
    toast.loading(`Uploading ${label.toLowerCase()}...`, { id: "kyc-upload" });

    await axiosInstance.post("/update/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.dismiss("kyc-upload");
    toast.success(`${label} uploaded successfully`);
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message =
      axiosError.response?.data?.message ||
      (error as Error).message ||
      "Failed to upload document. Please try again.";
    toast.dismiss("kyc-upload");
    toast.error(message);
    throw error;
  }
}

function getTypeLabel(type: string): string {
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
}
