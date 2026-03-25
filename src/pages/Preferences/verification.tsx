import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Image, X, Loader, Camera, Upload, IdCard, Check, Info, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

export const KYC_PARTNERS = [
  { name: "Binance", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAWlBMVEX////zui/zuCbzthvzuSv1xmH98+H//vz1x2T0vj7ytQDythP++/X77dL0vDj99eX31Y/42Zv65sD41pT1ym31xVv76sr0v0T88dv+9+v30Yf2zHT1w1L536sE+uBoAAAEUUlEQVR4nM2c6WKbMBCEzVEcoyQ4Z+2mff/XLMIXEnsIENLs30A6+aCrWbHa3S5SdJ/PsX5VtOgO5iu3Bj+6tiyqLyxW3aEsil5Vbh3j6IzV1Kv6hcOqOVw0WVW5tdyiKW+acFg1rw9NKKyaeqwJg5XLaVD1tM+tqfA15Wc15ZSfFa3Jssqninp2uVlxnHKq8nMBwtveCZwurNJrGq8tKKy6g6Yp/YrTVbqm1KxCOKVmdfN0SKxCOQ2qEjlkWyOER5pqYg6nVKzmcUrDai6nFKzmc9qe1RJOg6oN81VYHqdVbcWqWchpS1ad6gvSs5J85hDKj7dgJfvMoqirP1VqVhqnunzfvRlFVWTfztctV03tS3/VMSkrlVP9PlyXkpWqqf2+XnnUVEWrUtVnV3/fr9VZxXmC4ZxspGGl5oL627k+BSut5nQ52dBZrdWk1Zw+Jxsqq5WZQfMqU042tmXVKF6F4mRjS1b7v3KKrtt35k6NVXtcLGr3LD69unxh75RZmZ81b5WUo3hONiRWZqVn51lJnGzwrMzP2vzJsZI52eBYreVkg2ZVVzInGzSr9ZxsUDm9NhonGx+EKhPJU51/+6pCONGq4nCy4bOqqxBOlKpYzsWGy6o2YZymqsxnTJc+ZhXOyVdVRe4SeLC61AhLVC3n1NBL7N0v2FqKvoBbOm6ZgeX0T9PalKQZsf/owIrldHptv5hffsmiLKePVskSff7m7Mju3LPiOfXFRSWxYjn1P5R9+1C30MZtN7DiOZVDYmRZGa7iGzBK9eC1lrqVlpM4HwRO4mvzJnAqRFX3tZdlxdx5ui+PLBBG033R5p7gqOZkXx3txpmpaLRk07ne8ShzkpFrblhWRDgbIhQrr+YMZ+UbrnBWnrWZspp4uVBWUxMYmrgnJtCvvIiaM4zViWqWCLIChAV0Ky+y5gwxA3SxGsKKMoAOK+b7nW4HKE5hrEhNY1Zsba4ZTH7zQ2PFljo3VsL3FtmKc5zcP3kGp8eNZ6kKllidxU0iyYyL5fPwzUveE+PLu1NZSzfyn672ykaDvRFSFOTjQ3vRr4D5lKCkz+UpgVX1SJ+IyRNzmcmyIBOq/BcR0bpAmDziP2wOO2wcTdSNiIUDZol1V5WjGBUK92xlu7yZIGxwdJk2OGybxuKtILNwK+iobQVhbppx0S3eXnwko7jbsG6CRNmIdc0Axpa1v7whbO5PXXz+zyBUA0fYByOqbInThENXO3k/rZ2YunD5R8j1DZZ8cZfvc+3plS+Dc33YlovgPC0AmM0SiG0lmA04mK1KmE1dmO1vmI2CmC2VmM2nmG26wQ3Nm+cCTxVg6zdmkzzmcQLMgxeYR1QwD/NgHnvCPCCGeZQO89Ah5vFMzIOsmEd+MQ9HYx4jxzxwjzmaAHOIA+a4C8zBIJgjVDCHzWCO5cEcYIQ56glzKBbm+DDMQWuYI+kwh/dhjjnEHAiJOToTc8ho3HGs/wFWyE1zPSqCKwAAAABJRU5ErkJggg==" },
  { name: "Bybit", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAACUCAMAAAAeaLPCAAAAgVBMVEUAAAD////3pgBSUlLu7u75+fkpKSm9vb3MzMwSCwB9fX3y8vL/tQD7qQDUjwBaWlo8PDwWFhZubm6xsbHg4ODa2tozMzNBQUHo6OgbGxt5UQCcnJzxogAMDAxLS0t3d3dmZmbmmwCLi4tQNgCEWABpRwAiIiKoqKjJiABZOwBHMABiSzPbAAADdUlEQVR4nO2Z65aaMBRGYQChMlPkKlMLUtpi2/d/wKo5CbkAdVBhra5v/5mVy4GdQ0giY1kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5Pfny58HNtjXm8fj3z8vnT2h6zeH058wb55YH8WkB+LSA/SrV3FOr9pm+MWV20kQNqVldcClPBhnznjLCvZspv/NCVKXO/bbTG8BT3AUXJAraXQmoGJ7F8eVk+ydTenNDXh3yzfGAblGlBrVtW4e37gAOrCq5dfDPY9Z0R+WNo9mbXeqT8WX+ntqZ9gMeG01oj8mf9Zl1526bm1lOK5wpWzq1xedsuRPd15MnOouYT7++ycjIp7y4snzFKyrQdkl7CKsKOFQ+eMjRfDeZ2NKk0+STIGRndghfTe+Vp1Ypankw+zZXUb3JWilT5iJbPbcpzOST/vmMUCRukX7PyvrBmwuXFAteRUECL746Se70DvQLCjfqKzFW0FuW7AXlBRPLdXGld/l3UdNr9qcNBGlijyfepq9joMv5oJuXnzpYJeXon85qKlPrgPJiEZpTobMjTUEs+vMXl2aVzbhTTRG6tmLnyd3lQPl838zzToqJh9wq6mrX4/VHEnDY057jXMvLihX2X5jgJUepr9lfeQPUXlleIHXkZ+d3+inOgxTCUzldNyVKvLTW9a8SinZYuFoqz0DLyHmETkdxJ3ki9ndmgB4s9aiF5lfCodCrcvimVGwaPB14/49aQ97Zar7RvU+oH5SX3VTKfa/aVaDkp9YPy2bqZl49WDNr2pVdxXF7O/Srytqu8sdYuNKfEuHwoHtwy8mLjaUkzULrRNittrrK8KPMje8DPXEvvsLSPiuPJDfL9DhvTr0Se+sXPNuIsM0Oe/0zk02tx+WRget8s77Aavii9fbvwazn55gHyKb1Dv79f+KNGPVP+cI98omZ+kCfKF6zCmzXnu2xg5E+Xp8dcFQ0dK0tlob9NfhNRhXY2erZ8SgT880WgfP2clvcp2OcHuHzS6+k7rKfmblreCNYOF0vLp2q3j8nn1iTPlve1bh+Sz/5xz+fKl8Zj/4B8OblMPlrek7n8g+Bgfn+LT9duriGvBIfn4FNtBBvy7vU34/1fzOJmq5A0gzevomvrURuWEezEQ9Eam+O1dzT3vzkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7HXxy1QWC9MGo8AAAAAElFTkSuQmCC" },
  { name: "Coinbase", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAkFBMVEUAUv////8AU/8AOP/b4f8AUP8AS/8ATv8ARv8ASP8AQv/g5v93jP8aWP8ARP8AQP+Vq//n7f/2+f+5xP9Xfv8APP+mtv/E0f/s8v8AM/9Sd/+vv/92lf9ffP+OqP+AnP82Z/9FbP/R2/+mu/+4yf/L1v9nif8vYv9thv9Rcf+csP9/k/8rXf9ngf+Iof9tjv/mEMHEAAAGpUlEQVR4nO2cbXeiPBCGAUlCoBBFERasohXU1tr//+8e1G6rXSeZBPaRc9b7S08/NL3ywmRmMoll91DW9a8j9y4agVDBeCIGd5KYjIMbUPEwFJRYzl1kESrCYfwTKqU+se4q4tP0GmrK2H2RjmJsegk1/XXnYTqL/Jp+Q6W0F0wNFUt/Q8W0B3N3FqPxJ9TQvzfLt/zhGSoIezJ5R5EwOEGNxb1JLiXGJ6gJvTfIpejkBCV6NHvN/Ikj1Ghwb45rDUYNlDtw7s1xKWfgPqBQekBh9YDC6gGF1T8ARUgne2gnUIRRHokkEZHnNz98j1PWhq41FGG+2Dx/zItVkGWxnWUjdz1dbJdUcGOudlCERlE5XI2+QsgvZW5Rs4ibOf5toJhw6uJPnm9Vi6Vv4j2aQzEvnAYSovOAVXmkP42mUEzkaxXRWcEsjDSxzKBYVKayebvW6IPrTaIRVGQVaKKTVrlW6sQAikUz5Vr6qXhMNQZLH4rvx7pIRwXbBD1Y2lBenpkwNXpFp5o0oUgyxC/wn6oYcgr1oBjTXOHXcpe8eyjmI20TpNHO6xqKhVU7psbCP2OoNKCY35qpodohZhAPRVjLufukytVUeKik1Rr/VuAoLQMayht2w9TsOUqfGQvFc3P79FNF0g0U25va8VtaKJYVEioy2u8gZYplhYOKZl0y2XbqSZcVCooRbV9FoTfpBKKgPIw1iINVlaZp9fM08aYySzZUGChWqomK2W5DmojUo/tyO1dzHWSJewyUnyr+Q1WLhLOz+SFNuBwNNlMFV1ZK1joCiilMlPtO/4iimF9O5VSvkp0ZAeVJ97xskdx03VhSSvfvWJJtUEOxUDpMJdhjyl9lf7mAz83UUEI2D2NZtoCIWjLxgQMOlRKKOBIbVSgyGN5WQvUEeuxKKFrDza6VaYJoKxnlyBgqgg1ngDji9efgn2fgXqOCIhE4AVJT8yUP3srBQ0YVlMSaL1CRCXPAXo0hv0oF5YMOp6ty1T4FexguVHWgghKgBdwiw13irIAWsiUw/woosoH2sBW6uCJ6g/r1AfRLAcWeoRXxgVpRp44lUBtToA0FFP2AeqmRBRMvQBtrYKdRQHHIzKyRy/zUs3egkQBoRAEFmk5VQHIpsgF2qhgYbgWUAL6cONdJ21PoEwb2ZAVUAvQx2OgkVmn+dFNvhlCARVjBfsctMXpbZsZTAIFx9VdLwORQ4Hacoq3UX4DyICjQF/ofoODpux+UlQBQ6hzTlQggQyjIJOx1oIgT3pbh1wcYT9DruCleBDc1AqgUUGDiHPI6bonsoYAICDwUUB4UT041SjDBuH8EZDlUrgvky+oUzEWQS12ZQbF3yEHb4edvAM1eAVg7FdQSSsBCDf4pmgNN2Aszd5hQF2gQ//1x6GOJn80CB0uAAfIL0vekoJsP1garoI7FqYBwq4pApg5e5+qwnYJQK1SRTXQAG1hAy1Kd4IDzcS+IKmgOTp5tg51SQnG4p/ZM+QXSEE7IVqD9VUKxUpLnrRVUdA8uKNs+gAERIr0oS1jX0vJs7kAGxZbaFDUUbPuOGnpg08TPZcn0Al6RiJR1JOluEyqHQERJk4U0/76BjS8CioNZk5Pig3OjFIlGz5LldOxMu+Q+UZ1huQshLkMuwrzBcq04Sa0lphdzNuNJEsSfo1W8l1REvJEnon0+l874aaDaHhgRKp+Jk0bVeD6r3z9m09RFHDeXsj0Kdd5Hd92dap8lOy7CHtf6HdUk/Fa2l/o9OCjCMMedeOXyqB952k4lxxn6KhSZCGyxRAIfZ2gLzJ/rQhHWQUnQWZnSO0TXujDZ5qqliTKNhK8KostuFrv0nF0XyuJguKWjOSI00yl/88DIFK8hpo5Yq1DQaz2Dc1Rts15JJd+1K3o5yAtvzKAsHiL2ZkjxBHkJVLdMlxFFZQYsF1fkaQBlkcGb2UdY4OusDUq/+d7AuGcT3HIyhbJY9KQ7WK97ndMAo8p94jmvOlhpCQdinUEdcyklugZ8XeveUzG+osI8Ng/UXNm49LRPJ1pc5iG+sx3LsarDMjG4ZNTq2hOhHq8L9+byioOqiVLN7j21vSBGuGC72XR9NZOj6uXwvBeR6RMMHVylI4x6fuI7YZnX9WS3Cblo4tI2d+k6u3RICGOUc0pZ+4uH/8D1zI70gMLqAYXVAwqrBxRWZ6hePqHSy8dm+vksTy8fMOrlU0+9fBSrn8+H2WmrtyA61MVDa/18kq4vj/fRq8f7+vnMYT8fhLR7+XTmZ3zbt0dG+6P/ACAucl3tXULyAAAAAElFTkSuQmCC" },
  { name: "KuCoin", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAUVBMVEUtvZb///8At4zz+vij3swgu5IRuY/r+PT5/fwAtonc8uur4NDu+fYzv5k/wZ1jyqzQ7eSD07ub28fC6dy15NVNxKKO18BYx6dwzrLi9O970LaoGb10AAAEIElEQVR4nO1b67qqIBBVa7A0NTXt8v4PetJ9cgfMIAIq53ysvxItFiPOjSgKCAgICAgICAgICAgI+AAYY7A3CQ4QVXV+ax4l25vJL5IqO8UDnk2yN5cPWB5PyEo/9jD54vQWywvLYm3MIfVAK5bHAlLYm1XSipzerLp9WcFN5hTHl8I9K8aKrosSjYmTK8ZpBa0g6rP0cknbatY2ANm7VbRij8tn5nbmPaJ0cq4V9N/rVc9M6jT+1t3JABU3c1bQQ1U6jazurlgVGT9zQ0+s1GnAwdEOwkucmJp3TqcfrZw4DUw6diqUFRQanN5LcrKDyVOct8EWC0yLkyOtkoM47RGZVVMnV1ppkQLQ5jSwstZKhxSIb6gaJ9wq3ZJapNOoVWWp1TwpKCmd2teJ0Ophp9UsKVqnKyQ98ehkp9UcKYVO7zCG1ZRWLxtWM6QgonRqx+eM1soi9FKTglI6Wz+czj8jGGlXFlopSdFnQTuNYTWplTErFSkoU+IPb+ffGVhFaBXXpqwUpGgbv3FvPLmDsaknQ5OidWrP/BykVpkZJ5qUrk4jK0qrl5lUFCkoL9i/xLw9TawqYqyZVRGk4E6dBTm6ePaS5hnwNDuscFLQUbabIzqNrFC7OjgkBXfKxo+kkXxFj79I3ZFartPI6i7vYOvMps4VpZMi/IqGCFL6Xe3q7WtK1GYHnWY2Q9IqVUS2y0i11HuHhjkcRK1MfT2ZFIWjhtHyWs2vwpaU3j9AN/lfB8PjfAEphBNacQDor8OU2dEi7a9JSvJCILr3ed485FTZkHgrIqvUrB6pXuSUVH+3aZWKgxYpSaeVKw46pCSdWPP9+Om8ZqRBSranB/8ZMnRQbEj1sk8nhF1uklJLSL1kQy7EMbTvsA4p5JMKUlB1dbx/alKnB/LCs6M4zNBtMiaFaLA3qbdJIZ8Xefs2JoVptbuhI0enB0cCenjyA3Y4PP38zGBa7f9BVrsuK7RwWDl5N8LJKzZx8gh3OMHc4fo6+BBvd9iclnbgoJeWg25KIG0QOOwcYtHB6OzK1wtG6bB9TispbH86C9stEhxSMshZgsPPVBBTJBdprdAE43+fXuTOG/ExkYhFV5E5JeUqZe02j+4muW94UJmUQUSttiuDLCgYkcU19wUj/dIaMQiLhOxJqYqQkwaKgu0qRUid8hoTu4omTmuVa5WF7VGrNXTSaAGgd5CpbHzNFgDDZgnLxhKNthJaK7qtxC7E+UcbcBa3Kh22aFVaqJWDBjg/2980GwV1tXLSKOhlS6WXzadSm64iVbhZm66fDc186/fMxY6tWr/9bJIf/JPau+sEw3+xoiv9unixCPLBto5Oy+DjZR4/rz35eUFMukrngU4DVq44GILd/bue6edF1gHAmCfWFBAQEBAQEBAQEBAQsCH+AMpROwOK9+KLAAAAAElFTkSuQmCC" },
  { name: "OKX", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAACUCAMAAAATdsOFAAAAYFBMVEX///8AAABaWlp0dHTPz8/d3d3AwMCEhIQICAgrKyuhoaEkJCSlpaXv7+8MDAxtbW1lZWWbm5u2trb4+Pjn5+d9fX0fHx9VVVWLi4sXFxfJyclMTEw9PT01NTXX19dfX18lJgNkAAABZ0lEQVR4nO3Za2+CMBiGYbWsziMOigfY8P//SxMk7dOoQQkuktzXx/al3MuW2MXJBAAAAAAAAAAAAAAAYMRS84Q0b2bdUZZqPaWWY46uWcr15OTRcNq/PJk+pWyGrS4VekyhO7ZZKnVpqcNL3Yl+qHekX19gv2VprsfMZWNrb0+O0tekk0466aST/rb0lz5N35K+X3n7rvQi33j5ehse/L0OOz0s02F7CjsnN0y6SYLSdKT/pbuglifrvD1alqxJPWN1und5nL7WnTu/1ig9knW8Jjrsp3/uw/Suv0jSSSeddNJJ/6f0EX+aFl9BHV0G76QvzjPvUMuTrr3D6FK2O/jZc+Zka6D06WrhvXRznGQn/+Cqam+OC2FleFPu5TUD3Rwf+/z7eu/0Ef+XRDrppJNO+rjSP/G7pPwwe0b7DZ4J01X0zqQKVzHjbk8uo2HZqfLe6QAAAAAAAAAAAAAAAAAAAAAADOQCxDgn52IbORYAAAAASUVORK5CYII=" },
  { name: "Gate.io", logo: "data:image/png;base64,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" },
  { name: "Kraken", logo: "data:image/png;base64,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" },
  { name: "Bitget", logo: "data:image/png;base64,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" },
  { name: "Crypto.com", logo: "data:image/png;base64,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" },
  { name: "HTX", logo: "data:image/png;base64,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" }
];

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
