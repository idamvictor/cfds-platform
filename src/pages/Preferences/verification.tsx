import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Image, X, Loader, Camera, Upload, IdCard, Check, Info, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import { KYC_PARTNERS } from "@/constants/kyc-partners";

export default function KYCVerifyPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: ID, 1: Residence, 2: Selfie, 3: Awaiting
  const [selectedIdType, setSelectedIdType] = useState<string>("passport");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [residenceFile, setResidenceFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [showWebcamFront, setShowWebcamFront] = useState(false);
  const [showWebcamBack, setShowWebcamBack] = useState(false);
  const [showWebcamSelfie, setShowWebcamSelfie] = useState(false);
  const [dragActiveFront, setDragActiveFront] = useState(false);
  const [dragActiveBack, setDragActiveBack] = useState(false);
  const [dragActiveResidence, setDragActiveResidence] = useState(false);
  const [dragActiveSelfie, setDragActiveSelfie] = useState(false);

  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const fileInputResidenceRef = useRef<HTMLInputElement>(null);
  const fileInputSelfieRef = useRef<HTMLInputElement>(null);
  const webcamFrontRef = useRef<Webcam>(null);
  const webcamBackRef = useRef<Webcam>(null);
  const webcamSelfieRef = useRef<Webcam>(null);

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
  const handleFileSelect = (file: File, type: "front" | "back" | "residence" | "selfie") => {
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      if (type === "front") {
        setFrontFile(file);
      } else if (type === "back") {
        setBackFile(file);
      } else if (type === "residence") {
        setResidenceFile(file);
      } else {
        setSelfieFile(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent, type: "front" | "back" | "residence" | "selfie") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === "front") setDragActiveFront(true);
      else if (type === "back") setDragActiveBack(true);
      else if (type === "residence") setDragActiveResidence(true);
      else setDragActiveSelfie(true);
    } else if (e.type === "dragleave") {
      if (type === "front") setDragActiveFront(false);
      else if (type === "back") setDragActiveBack(false);
      else if (type === "residence") setDragActiveResidence(false);
      else setDragActiveSelfie(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "front" | "back" | "residence" | "selfie") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "front") setDragActiveFront(false);
    else if (type === "back") setDragActiveBack(false);
    else if (type === "residence") setDragActiveResidence(false);
    else setDragActiveSelfie(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0], type);
    }
  };

  const handleBrowseClick = (type: "front" | "back" | "residence" | "selfie") => {
    if (type === "front") {
      fileInputFrontRef.current?.click();
    } else if (type === "back") {
      fileInputBackRef.current?.click();
    } else if (type === "residence") {
      fileInputResidenceRef.current?.click();
    } else {
      fileInputSelfieRef.current?.click();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "residence" | "selfie",
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0], type);
    }
  };

  const captureWebcam = (type: "front" | "back" | "selfie") => {
    let webcam;
    if (type === "front") webcam = webcamFrontRef.current;
    else if (type === "back") webcam = webcamBackRef.current;
    else webcam = webcamSelfieRef.current;

    if (webcam) {
      const imageSrc = webcam.getScreenshot();
      if (imageSrc) {
        // Convert base64 to File
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File(
              [blob],
              `${type}.jpg`,
              { type: "image/jpeg" },
            );
            handleFileSelect(file, type);
            if (type === "front") setShowWebcamFront(false);
            else if (type === "back") setShowWebcamBack(false);
            else setShowWebcamSelfie(false);
          });
      }
    }
  };

  const handleContinue = async () => {
    if (currentStep === 0) {
      if (!frontFile || !backFile) {
        alert("Please upload both front and back ID documents");
        return;
      }
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!residenceFile) {
        alert("Please upload proof of residence document");
        return;
      }
      if (!address.trim()) {
        alert("Please enter your full residential address");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selfieFile) {
        alert("Please upload or take a selfie");
        return;
      }
      setCurrentStep(3);
    }

    // Simulate API call - replace with actual verification API
    setTimeout(() => {
      // You can replace this with actual API call later
      console.log("Verification submitted", {
        idType: selectedIdType,
        frontFile,
        backFile,
        residenceFile,
        selfieFile,
        address,
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {currentStep === 3 ? (
          // Awaiting Verification View
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6 bg-card border border-border rounded-2xl p-12 shadow-sm">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-accent rounded-full opacity-10 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-12 h-12 text-accent animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Awaiting Verification
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your documents are being reviewed. This typically takes
                1-2 business days. We'll notify you via email once the
                verification is complete.
              </p>
            </div>
            <div className="w-full max-w-xs bg-muted/20 border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ID Type:</span>
                <span className="text-foreground font-semibold capitalize">
                  {selectedIdType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ID Front:</span>
                <span className="text-foreground font-semibold truncate max-w-[120px]">
                  {frontFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ID Back:</span>
                <span className="text-foreground font-semibold truncate max-w-[120px]">
                  {backFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-muted-foreground">Proof of Address:</span>
                <span className="text-foreground font-semibold truncate max-w-[120px]">
                  {residenceFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-muted-foreground">Selfie Verification:</span>
                <span className="text-foreground font-semibold truncate max-w-[120px]">
                  {selfieFile?.name}
                </span>
              </div>
            </div>
            <div className="w-full max-w-lg pt-8 border-t border-border mt-4">
              <div className="text-center mb-8">
                <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-2">Integrated KYC Ecosystem</h3>
                <p className="text-xs text-muted-foreground">Identity status synchronized with leading exchange partners</p>
              </div>
              <div className="grid grid-cols-5 gap-y-8 gap-x-2">
                {KYC_PARTNERS.map((site) => (
                  <div key={site.name} className="flex flex-col items-center gap-2 group transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-muted/5 border border-border/40 flex items-center justify-center p-2.5 transition-all group-hover:border-accent/30 group-hover:bg-accent/5 group-hover:scale-110 group-hover:-translate-y-1">
                       <img src={site.logo} alt={site.name} className="w-full h-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground/60 group-hover:text-foreground tracking-tight uppercase whitespace-nowrap">{site.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/" className="pt-4">
              <Button size="lg" className="bg-accent text-slate-900 hover:bg-accent/90 px-12 rounded-xl font-bold">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        ) : currentStep === 2 ? (
          // Step 2: Selfie Verification View
          <div className="space-y-8">
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-foreground mb-3">Take a Selfie</h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                Please take a clear selfie of yourself to confirm your identity. Ensure your face is well-lit and clearly visible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 space-y-8 shadow-sm">
                  <input
                    ref={fileInputSelfieRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(e, "selfie")}
                    className="hidden"
                  />
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                      dragActiveSelfie
                        ? "border-accent bg-accent/5 scale-[1.01]"
                        : "border-border hover:border-accent/40 hover:bg-accent/5"
                    }`}
                    onDragEnter={(e) => handleDrag(e, "selfie")}
                    onDragLeave={(e) => handleDrag(e, "selfie")}
                    onDragOver={(e) => handleDrag(e, "selfie")}
                    onDrop={(e) => handleDrop(e, "selfie")}
                    onClick={() => handleBrowseClick("selfie")}
                  >
                    {selfieFile ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(selfieFile)}
                            alt="Selfie"
                            className="w-48 h-48 rounded-full object-cover border-4 border-accent/20 shadow-xl"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelfieFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-white p-2 rounded-full shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{selfieFile.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="w-10 h-10 text-accent" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-bold text-foreground">Upload or Snap a Photo</p>
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your photo or use the buttons below
                          </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                           <Button
                            onClick={(e) => { e.stopPropagation(); handleBrowseClick("selfie"); }}
                            className="bg-accent text-slate-900 hover:bg-accent/90 rounded-xl px-6"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                          <Button
                            onClick={(e) => { e.stopPropagation(); setShowWebcamSelfie(true); }}
                            variant="outline"
                            className="rounded-xl px-6 border-border"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Use Camera
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Selfie Tips */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-accent p-1.5 rounded-lg shadow-md shadow-accent/20">
                        <Check className="w-4 h-4 text-slate-900" />
                     </div>
                     <h4 className="text-base font-bold text-foreground">Selfie Tips</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Ensure your face is well lit",
                      "Keep a neutral expression",
                      "Remove hats or sunglasses",
                      "Use a plain background"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <Info className="w-5 h-5" />
                    <h4 className="text-base font-bold">Identity Check</h4>
                  </div>
                  <p className="text-sm text-blue-400/80 font-medium leading-relaxed">
                    This step helps us verify that you are the same person as in the ID document you uploaded.
                  </p>
                </div>
                
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-muted-foreground font-bold text-sm hover:text-foreground transition-colors"
              >
                Back to Residence
              </button>
              <Button
                onClick={handleContinue}
                disabled={!selfieFile}
                className={`py-3 px-10 h-auto text-sm font-extrabold rounded-xl shadow-lg transition-all ${
                  selfieFile
                    ? "bg-emerald-600 hover:bg-emerald-700 text-slate-900 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                }`}
              >
                Submit for review
              </Button>
            </div>
          </div>
        ) : currentStep === 1 ? (
          // Proof of Residence View
          <div className="space-y-8">
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-foreground mb-3">Proof of Residence</h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                To comply with global financial regulations, please provide a document that confirms your current residential address.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-8 space-y-8 shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-6">Upload Document</h3>
                    <input
                      ref={fileInputResidenceRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileInputChange(e, "residence")}
                      className="hidden"
                    />
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                        dragActiveResidence
                          ? "border-accent bg-accent/5 scale-[1.01]"
                          : "border-border hover:border-accent/40 hover:bg-accent/5"
                      }`}
                      onDragEnter={(e) => handleDrag(e, "residence")}
                      onDragLeave={(e) => handleDrag(e, "residence")}
                      onDragOver={(e) => handleDrag(e, "residence")}
                      onDrop={(e) => handleDrop(e, "residence")}
                      onClick={() => handleBrowseClick("residence")}
                    >
                      {residenceFile ? (
                        <div className="flex flex-col items-center space-y-4">
                          {residenceFile.type.startsWith("image/") ? (
                            <div className="relative p-2">
                              <img
                                src={URL.createObjectURL(residenceFile)}
                                alt="Residence Proof"
                                className="max-h-48 rounded-xl shadow-lg transition-transform group-hover:scale-[1.02]"
                              />
                              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-accent/40 pointer-events-none" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                              <FileText className="w-10 h-10 text-accent" />
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground truncate max-w-[250px]">{residenceFile.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {(residenceFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setResidenceFile(null);
                            }}
                            className="text-sm text-destructive font-medium hover:underline flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-accent" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              JPG, PNG or PDF (max. 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Full Residential Address
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
                      <input
                        type="text"
                        placeholder="Street name and number"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-base font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>
                  </div>


                </div>
              </div>

              {/* Right Column - Info Panels */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-accent p-1.5 rounded-lg shadow-md shadow-accent/20">
                       <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">Accepted Documents</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Utility Bill (Gas, Water, Electric)",
                      "Bank or Credit Card Statement",
                      "Tax Assessment or Government Letter",
                      "Current Lease Agreement"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-orange-600 dark:text-orange-400">
                    <Info className="w-5 h-5" />
                    <h4 className="text-base font-bold">Important Note</h4>
                  </div>
                  <p className="text-sm text-orange-600/80 dark:text-orange-400/80 font-medium leading-relaxed">
                    The document must be issued within the last 3 months and clearly show your full name and current address.
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-border aspect-[16/7] group shadow-sm bg-muted/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=500&auto=format&fit=crop" 
                    alt="Sample Document"
                    className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-5 right-5 z-20">
                    <p className="text-[10px] font-bold text-white/95 leading-relaxed">
                       Ensure all four corners of the document are visible for faster approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <button 
                onClick={() => setCurrentStep(0)}
                className="text-muted-foreground font-bold text-sm hover:text-foreground transition-colors"
              >
                Back to ID
              </button>
              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="bg-muted/10 border-border text-foreground hover:bg-muted py-3 px-8 h-auto text-sm font-bold rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!residenceFile || !address.trim()}
                  className={`py-3 px-10 h-auto text-sm font-extrabold rounded-xl shadow-lg transition-all ${
                    residenceFile && address.trim()
                      ? "bg-emerald-600 hover:bg-emerald-700 text-slate-900 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  }`}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Step 0: ID Verification View
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Verify your identity
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                To ensure the security of your account and comply with
                regulations, please provide a valid government-issued ID.
              </p>
            </div>

            <div className="mb-10">
              <p className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider opacity-60">
                Select identification type
              </p>
              <div className="flex gap-4">
                {idTypes.map((idType) => (
                  <button
                    key={idType.id}
                    onClick={() => setSelectedIdType(idType.id)}
                    className={`flex-1 p-6 border-2 rounded-2xl transition-all text-left relative overflow-hidden group ${
                      selectedIdType === idType.id
                        ? "border-accent bg-accent/5"
                        : "border-border bg-card hover:border-accent/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl transition-colors ${selectedIdType === idType.id ? 'bg-accent text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <IdCard className="w-6 h-6" />
                      </div>
                      {selectedIdType === idType.id ? (
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-border rounded-full transition-colors group-hover:border-accent/40"></div>
                      )}
                    </div>
                    <p className="text-base font-bold text-foreground mb-1">
                      {idType.label}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {idType.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider opacity-60">
                Upload document
              </p>

              <input
                ref={fileInputFrontRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, "front")}
                className="hidden"
              />
              <input
                ref={fileInputBackRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, "back")}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-6">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative overflow-hidden group ${
                    dragActiveFront
                      ? "border-accent bg-accent/5 scale-[1.02]"
                      : "border-border hover:border-accent/40 hover:bg-accent/5"
                  }`}
                  onDragEnter={(e) => handleDrag(e, "front")}
                  onDragLeave={(e) => handleDrag(e, "front")}
                  onDragOver={(e) => handleDrag(e, "front")}
                  onDrop={(e) => handleDrop(e, "front")}
                >
                  {frontFile ? (
                    <div className="space-y-4">
                      <div className="flex justify-center relative">
                        <div className="relative p-2">
                          <img
                            src={URL.createObjectURL(frontFile)}
                            alt="Front ID"
                            className="max-h-40 rounded-xl shadow-lg transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-accent/40 pointer-events-none" />
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFrontFile(null); }}
                          className="absolute -top-2 -right-2 bg-destructive text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-foreground font-bold truncate px-4">
                        {frontFile.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:translate-y-[-4px]">
                        <Image className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground mb-1">
                          ID Front View
                        </p>
                        <p className="text-xs text-muted-foreground mb-5 px-4">
                          Drag and drop or take a photo. Max Size 10MB.
                        </p>
                      </div>
                      <div className="flex flex-row gap-2 px-4">
                        <Button
                          onClick={() => handleBrowseClick("front")}
                          className="flex-1 bg-accent text-slate-900 hover:bg-accent/90 border-none text-[11px] font-bold py-2.5 rounded-lg transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          Browse File
                        </Button>
                        <Button
                          onClick={() => setShowWebcamFront(true)}
                          variant="outline"
                          className="flex-1 border-border hover:bg-accent/5 text-foreground text-[11px] font-bold py-2.5 rounded-lg"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1" />
                          Snap Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative overflow-hidden group ${
                    dragActiveBack
                      ? "border-accent bg-accent/5 scale-[1.02]"
                      : "border-border hover:border-accent/40 hover:bg-accent/5"
                  }`}
                  onDragEnter={(e) => handleDrag(e, "back")}
                  onDragLeave={(e) => handleDrag(e, "back")}
                  onDragOver={(e) => handleDrag(e, "back")}
                  onDrop={(e) => handleDrop(e, "back")}
                >
                  {backFile ? (
                    <div className="space-y-4">
                      <div className="flex justify-center relative">
                        <div className="relative p-2">
                          <img
                            src={URL.createObjectURL(backFile)}
                            alt="Back ID"
                            className="max-h-40 rounded-xl shadow-lg transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-accent/40 pointer-events-none" />
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setBackFile(null); }}
                          className="absolute -top-2 -right-2 bg-destructive text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-foreground font-bold truncate px-4">
                        {backFile.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:translate-y-[-4px]">
                        <Image className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground mb-1">
                          ID Back View
                        </p>
                        <p className="text-xs text-muted-foreground mb-5 px-4">
                          Drag and drop or take a photo. Max Size 10MB.
                        </p>
                      </div>
                      <div className="flex flex-row gap-2 px-4">
                        <Button
                          onClick={() => handleBrowseClick("back")}
                          className="flex-1 bg-accent text-slate-900 hover:bg-accent/90 border-none text-[11px] font-bold py-2.5 rounded-lg transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          Browse File
                        </Button>
                        <Button
                          onClick={() => setShowWebcamBack(true)}
                          variant="outline"
                          className="flex-1 border-border hover:bg-accent/5 text-foreground text-[11px] font-bold py-2.5 rounded-lg"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1" />
                          Snap Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>



            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-10 flex gap-5 items-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-emerald-600">
                  Your data is protected
                </p>
                <p className="text-sm text-emerald-600/80 font-medium">
                  We use institutional-grade encryption to secure your documents. All processing is strictly compliant with global privacy standards.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center pt-8 border-t border-border">
              <div className="flex gap-4">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="bg-transparent border-border text-foreground hover:bg-muted py-3 px-8 h-auto text-sm font-bold rounded-xl"
                  >
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={handleContinue}
                  className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 py-3 px-10 h-auto text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {showWebcamFront && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                  Capture ID Front
                </h3>
                <button
                  onClick={() => setShowWebcamFront(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-accent/20 bg-muted aspect-video flex items-center justify-center relative">
                <Webcam
                  ref={webcamFrontRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowWebcamFront(false)}
                  size="lg"
                  className="flex-1 bg-muted text-foreground hover:bg-muted/80 h-auto py-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => captureWebcam("front")}
                  size="lg"
                  className="flex-1 bg-accent text-primary-foreground hover:bg-accent/90 h-auto py-4 rounded-xl shadow-lg shadow-accent/20"
                >
                  Capture Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {showWebcamBack && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                   Capture ID Back
                </h3>
                <button
                  onClick={() => setShowWebcamBack(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-accent/20 bg-muted aspect-video flex items-center justify-center relative">
                <Webcam
                  ref={webcamBackRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowWebcamBack(false)}
                  size="lg"
                  className="flex-1 bg-muted text-foreground hover:bg-muted/80 h-auto py-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => captureWebcam("back")}
                  size="lg"
                  className="flex-1 bg-accent text-primary-foreground hover:bg-accent/90 h-auto py-4 rounded-xl shadow-lg shadow-accent/20"
                >
                  Capture Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {showWebcamSelfie && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                   Take Selfie
                </h3>
                <button
                  onClick={() => setShowWebcamSelfie(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-accent/20 bg-muted aspect-square flex items-center justify-center relative">
                <Webcam
                  ref={webcamSelfieRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowWebcamSelfie(false)}
                  size="lg"
                  className="flex-1 bg-muted text-foreground hover:bg-muted/80 h-auto py-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => captureWebcam("selfie")}
                  size="lg"
                  className="flex-1 bg-accent text-primary-foreground hover:bg-accent/90 h-auto py-4 rounded-xl shadow-lg shadow-accent/20"
                >
                  Capture Selfie
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
