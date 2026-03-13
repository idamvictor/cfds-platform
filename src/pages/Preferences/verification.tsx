import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Cloud, X, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

export default function KYCVerifyPage() {
  const [selectedIdType, setSelectedIdType] = useState<string>("passport");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [showWebcamFront, setShowWebcamFront] = useState(false);
  const [showWebcamBack, setShowWebcamBack] = useState(false);
  const [dragActiveFront, setDragActiveFront] = useState(false);
  const [dragActiveBack, setDragActiveBack] = useState(false);
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const webcamFrontRef = useRef<Webcam>(null);
  const webcamBackRef = useRef<Webcam>(null);

  const idTypes = [
    {
      id: "passport",
      label: "Passport",
      description: "International travel document",
    },
    {
      id: "drivers",
      label: "Driver's License",
      description: "State issued license",
    },
    { id: "national", label: "National ID", description: "Government ID card" },
  ];

  // File handling functions
  const handleFileSelect = (file: File, isFront: boolean) => {
    if (file && file.type.startsWith("image/")) {
      if (isFront) {
        setFrontFile(file);
      } else {
        setBackFile(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent, isFront: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (isFront) setDragActiveFront(true);
      else setDragActiveBack(true);
    } else if (e.type === "dragleave") {
      if (isFront) setDragActiveFront(false);
      else setDragActiveBack(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isFront: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFront) setDragActiveFront(false);
    else setDragActiveBack(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0], isFront);
    }
  };

  const handleBrowseClick = (isFront: boolean) => {
    if (isFront) {
      fileInputFrontRef.current?.click();
    } else {
      fileInputBackRef.current?.click();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFront: boolean,
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0], isFront);
    }
  };

  const captureWebcam = (isFront: boolean) => {
    const webcam = isFront ? webcamFrontRef.current : webcamBackRef.current;
    if (webcam) {
      const imageSrc = webcam.getScreenshot();
      if (imageSrc) {
        // Convert base64 to File
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File(
              [blob],
              `id-${isFront ? "front" : "back"}.jpg`,
              { type: "image/jpeg" },
            );
            handleFileSelect(file, isFront);
            if (isFront) setShowWebcamFront(false);
            else setShowWebcamBack(false);
          });
      }
    }
  };

  const handleContinue = async () => {
    if (!frontFile || !backFile) {
      alert("Please upload both front and back ID documents");
      return;
    }

    setIsAwaitingVerification(true);

    // Simulate API call - replace with actual verification API
    setTimeout(() => {
      // You can replace this with actual API call later
      console.log("Verification submitted", {
        idType: selectedIdType,
        frontFile,
        backFile,
      });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        {isAwaitingVerification ? (
          // Awaiting Verification View
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-accent rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-10 h-10 text-accent animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Awaiting Verification
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your identity documents are being reviewed. This typically takes
                1-2 business days. We'll notify you via email once the
                verification is complete.
              </p>
            </div>
            <div className="w-full max-w-xs bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ID Type:</span>
                <span className="text-foreground font-semibold capitalize">
                  {selectedIdType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Front:</span>
                <span className="text-foreground font-semibold">
                  {frontFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Back:</span>
                <span className="text-foreground font-semibold">
                  {backFile?.name}
                </span>
              </div>
            </div>
            <Link to="/">
              <Button className="bg-accent text-primary-foreground hover:bg-accent/90">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          // Document Upload View
          <>
            {/* Title */}
            <h2 className="text-lg font-bold text-foreground mb-2">
              Verify your identity
            </h2>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              To ensure the security of your account and comply with
              regulations, please provide a valid government-issued ID.
            </p>

            {/* ID Type Selection */}
            <div className="mb-6">
              <p className="text-sm font-bold text-foreground mb-4">
                Select identification type
              </p>
              <div className="flex gap-4">
                {idTypes.map((idType) => (
                  <button
                    key={idType.id}
                    onClick={() => setSelectedIdType(idType.id)}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all text-center ${
                      selectedIdType === idType.id
                        ? "border-accent bg-card"
                        : "border-border bg-card hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <svg
                        className="w-8 h-8 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {selectedIdType === idType.id ? (
                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-border rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {idType.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {idType.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <p className="text-sm font-bold text-foreground mb-4">
                Upload document
              </p>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputFrontRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, true)}
                className="hidden"
              />
              <input
                ref={fileInputBackRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, false)}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Front Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActiveFront
                      ? "border-accent bg-accent/5"
                      : "border-muted-foreground hover:border-muted-foreground/80"
                  }`}
                  onDragEnter={(e) => handleDrag(e, true)}
                  onDragLeave={(e) => handleDrag(e, true)}
                  onDragOver={(e) => handleDrag(e, true)}
                  onDrop={(e) => handleDrop(e, true)}
                >
                  {frontFile ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <img
                          src={URL.createObjectURL(frontFile)}
                          alt="Front ID"
                          className="max-h-32 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-foreground font-semibold">
                        {frontFile.name}
                      </p>
                      <button
                        onClick={() => setFrontFile(null)}
                        className="text-xs text-accent hover:text-accent/80"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Cloud className="w-10 h-10 text-accent mx-auto mb-3" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Drag and drop your ID here (front)
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Supported formats: JPG, PNG, PDF. Maximum file size is
                        5MB.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleBrowseClick(true)}
                          className="bg-muted hover:bg-muted/80 text-foreground text-xs py-1.5 px-3 rounded"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          Browse files
                        </Button>
                        <Button
                          onClick={() => setShowWebcamFront(true)}
                          className="bg-transparent border border-foreground hover:bg-foreground/10 text-foreground text-xs py-1.5 px-3 rounded"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Take a photo
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Back Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActiveBack
                      ? "border-accent bg-accent/5"
                      : "border-muted-foreground hover:border-muted-foreground/80"
                  }`}
                  onDragEnter={(e) => handleDrag(e, false)}
                  onDragLeave={(e) => handleDrag(e, false)}
                  onDragOver={(e) => handleDrag(e, false)}
                  onDrop={(e) => handleDrop(e, false)}
                >
                  {backFile ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <img
                          src={URL.createObjectURL(backFile)}
                          alt="Back ID"
                          className="max-h-32 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-foreground font-semibold">
                        {backFile.name}
                      </p>
                      <button
                        onClick={() => setBackFile(null)}
                        className="text-xs text-accent hover:text-accent/80"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Cloud className="w-10 h-10 text-accent mx-auto mb-3" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Drag and drop your ID here (Back)
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Supported formats: JPG, PNG, PDF. Maximum file size is
                        5MB.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleBrowseClick(false)}
                          className="bg-muted hover:bg-muted/80 text-foreground text-xs py-1.5 px-3 rounded"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          Browse files
                        </Button>
                        <Button
                          onClick={() => setShowWebcamBack(true)}
                          className="bg-transparent border border-foreground hover:bg-foreground/10 text-foreground text-xs py-1.5 px-3 rounded"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Take a photo
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Webcam Modal - Front */}
            {showWebcamFront && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Capture ID Front
                    </h3>
                    <button
                      onClick={() => setShowWebcamFront(false)}
                      className="text-foreground hover:opacity-70"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <Webcam
                    ref={webcamFrontRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowWebcamFront(false)}
                      className="flex-1 bg-transparent border border-border text-foreground hover:bg-card"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => captureWebcam(true)}
                      className="flex-1 bg-accent text-primary-foreground hover:bg-accent/90"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Webcam Modal - Back */}
            {showWebcamBack && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Capture ID Back
                    </h3>
                    <button
                      onClick={() => setShowWebcamBack(false)}
                      className="text-foreground hover:opacity-70"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <Webcam
                    ref={webcamBackRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowWebcamBack(false)}
                      className="flex-1 bg-transparent border border-border text-foreground hover:bg-card"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => captureWebcam(false)}
                      className="flex-1 bg-accent text-primary-foreground hover:bg-accent/90"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Your data is secure
                </p>
                <p className="text-xs text-emerald-600/80">
                  All documents are encrypted and handled in accordance with
                  GDPR and local privacy laws. We never share your sensitive
                  information.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <Link to="/">
                <button className="text-foreground text-sm hover:text-accent transition-colors">
                  Cancel process
                </button>
              </Link>
              <div className="flex gap-3">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="text-foreground border-border hover:bg-card py-2 px-6 text-sm font-semibold rounded-lg"
                  >
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={handleContinue}
                  disabled={!frontFile || !backFile}
                  className={`py-2 px-6 text-sm font-semibold rounded-lg transition-colors ${
                    frontFile && backFile
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
