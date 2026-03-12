"use client";

import { useState } from "react";
import { useColors } from "../../contexts/ColorContext";
import { API_CONFIG } from "../../lib/api";

export default function ConverterPage() {
  const colors = useColors();
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<
    "pdf_to_word" | "word_to_pdf"
  >("pdf_to_word");
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [pollTimeoutId, setPollTimeoutId] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [isCancelled, setIsCancelled] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleFile = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (conversionType === "pdf_to_word" && ext !== "pdf") {
      setError("Please select a PDF file");
      return;
    }
    if (
      conversionType === "word_to_pdf" &&
      !["doc", "docx"].includes(ext || "")
    ) {
      setError("Please select a Word document (.doc or .docx)");
      return;
    }

    if (selectedFile.size > 18 * 1024 * 1024) {
      setError("File size must be less than 15MB");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsCancelled(true);

    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }

    if (pollTimeoutId) {
      clearTimeout(pollTimeoutId);
      setPollTimeoutId(null);
    }

    setUploading(false);
    setConverting(false);
    setDownloading(false);
    setProgress(0);
    setProgressMessage("");
    setError("Upload cancelled");
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsCancelled(false);
    setUploading(true);
    setConverting(false);
    setDownloading(false);
    setProgress(10);
    setProgressMessage("Uploading file...");
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversion_type", conversionType);

    try {
      const controller = new AbortController();
      setAbortController(controller);

      const csrfToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1] || "";

      // Simulate upload progress
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(30);
      setProgressMessage("Connecting to server...");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/converter/convert/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: controller.signal,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        },
      );

      setUploading(false);
      setConverting(true);
      setProgress(50);
      setProgressMessage("Converting file...");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Conversion failed. Please try again.");
      }

      // Check if response is JSON (job-based) or blob (direct file)
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Large file - job-based response
        const result = await response.json();
        const jobId = result.job_id;
        const startTime = Date.now();

        setProgress(10);
        setProgressMessage("Processing large file...");

        // Poll for progress
        const pollProgress = async () => {
          if (isCancelled) return;

          const progressResponse = await fetch(
            `${API_CONFIG.BASE_URL}/api/converter/progress/${jobId}/`,
          );
          const progressData = await progressResponse.json();

          if (isCancelled) return;

          const elapsed = Math.round((Date.now() - startTime) / 1000);
          const estimatedTotal =
            progressData.percentage > 10
              ? Math.round(elapsed / (progressData.percentage / 100))
              : 0;
          const remaining = Math.max(0, estimatedTotal - elapsed);

          setProgress(progressData.percentage);
          setProgressMessage(
            `${progressData.message} ${remaining > 0 ? `(~${remaining}s remaining)` : ""}`,
          );

          if (progressData.error) {
            throw new Error(progressData.message);
          }

          if (progressData.percentage === 100) {
            if (isCancelled) return;

            setConverting(false);
            setDownloading(true);
            setProgress(95);
            setProgressMessage("Downloading file...");

            // Download the file
            const downloadResponse = await fetch(
              `${API_CONFIG.BASE_URL}/api/converter/download/${jobId}/`,
            );
            const blob: Blob = await downloadResponse.blob();

            if (isCancelled) return;

            setProgress(100);
            setProgressMessage("Download complete!");

            // Trigger download
            const url: string = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const outputExt =
              conversionType === "pdf_to_word" ? ".docx" : ".pdf";
            const outputFilename = file.name.replace(/\.[^/.]+$/, outputExt);
            a.download = outputFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloading(false);
            setProgress(0);
            setProgressMessage("");
            setSuccess(
              `Successfully converted! File "${outputFilename}" downloaded.`,
            );
            setShowSuccessModal(true);
            setFile(null);

            setTimeout(() => setShowSuccessModal(false), 4000);
          } else {
            // Continue polling
            const timeoutId = setTimeout(pollProgress, 1000);
            setPollTimeoutId(timeoutId);
          }
        };

        // Start polling
        const initialTimeoutId = setTimeout(pollProgress, 500);
        setPollTimeoutId(initialTimeoutId);
      } else {
        // Small file - direct blob response
        setConverting(true);
        setProgress(60);
        setProgressMessage("Converting file...");

        await new Promise((resolve) => setTimeout(resolve, 800));
        setProgress(80);
        setProgressMessage("Processing pages...");

        setConverting(false);
        setDownloading(true);
        setProgress(90);
        setProgressMessage("Preparing download...");

        const blob = (await response.blob()) as Blob;

        setProgress(100);
        setProgressMessage("Download ready!");

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        const outputExt = conversionType === "pdf_to_word" ? ".docx" : ".pdf";
        const outputFilename = file.name.replace(/\.[^/.]+$/, outputExt);
        a.download = outputFilename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setDownloading(false);
        setProgress(0);
        setProgressMessage("");
        setSuccess(
          `Successfully converted to ${conversionType === "pdf_to_word" ? "Word" : "PDF"}! Your file "${outputFilename}" has been downloaded.`,
        );
        setShowSuccessModal(true);
        setFile(null);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 4000);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return; // Request was cancelled, don't show error
      }
      setError(err.message || "Conversion failed. Please try again.");
      setProgress(0);
      setProgressMessage("");
      setUploading(false);
      setConverting(false);
      setDownloading(false);
    } finally {
      setAbortController(null);
      setPollTimeoutId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowSuccessModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-slideUp">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.accent_color + "20" }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: colors.accent_color }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: colors.primary_color }}
              >
                Success!
              </h3>
              <p className="text-gray-600 mb-6">{success}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: colors.primary_color }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.primary_color }}
          >
            File Converter
          </h1>
          <p className="text-lg text-gray-600">
            Convert your files instantly - PDF to Word or Word to PDF
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => {
                setConversionType("pdf_to_word");
                setFile(null);
                setError("");
                setSuccess("");
              }}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all overflow-hidden group ${
                conversionType === "pdf_to_word"
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={
                conversionType === "pdf_to_word"
                  ? { backgroundColor: colors.primary_color }
                  : {}
              }
            >
              <span className="relative z-10">PDF to Word</span>
              {conversionType === "pdf_to_word" && (
                <div
                  className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                  style={{ backgroundColor: colors.accent_color }}
                ></div>
              )}
            </button>
            <button
              onClick={() => {
                setConversionType("word_to_pdf");
                setFile(null);
                setError("");
                setSuccess("");
              }}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all overflow-hidden group ${
                conversionType === "word_to_pdf"
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={
                conversionType === "word_to_pdf"
                  ? { backgroundColor: colors.primary_color }
                  : {}
              }
            >
              <span className="relative z-10">Word to PDF</span>
              {conversionType === "word_to_pdf" && (
                <div
                  className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                  style={{ backgroundColor: colors.accent_color }}
                ></div>
              )}
            </button>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={
                conversionType === "pdf_to_word"
                  ? ".pdf,application/pdf"
                  : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              }
              onChange={handleFileInput}
            />

            {!file ? (
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your {conversionType === "pdf_to_word" ? "PDF" : "Word"}{" "}
                  file here
                </p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <span
                  className="inline-block px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.accent_color }}
                >
                  Choose File
                </span>
                <p className="text-xs text-gray-400 mt-4">
                  Maximum file size: 18MB
                </p>
              </label>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 mr-3"
                    style={{ color: colors.primary_color }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove File
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-800">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {file && (
            <>
              {/* Progress Bar */}
              {(uploading || converting || downloading) && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {progressMessage || "Processing..."}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: colors.primary_color }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${colors.primary_color}, ${colors.accent_color})`,
                      }}
                    ></div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="mt-4 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={uploading || converting || downloading}
                className="relative w-full mt-6 px-6 py-4 rounded-lg text-white font-medium text-lg transition-all overflow-hidden group disabled:opacity-50"
                style={{ backgroundColor: colors.primary_color }}
              >
                {uploading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </span>
                ) : converting ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Converting...
                  </span>
                ) : downloading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Downloading...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 group-hover:text-white transition-colors">
                      Convert to{" "}
                      {conversionType === "pdf_to_word" ? "Word" : "PDF"}
                    </span>
                    <div
                      className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                      style={{ backgroundColor: colors.accent_color }}
                    ></div>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: colors.accent_color }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary_color }}
            >
              Fast Conversion
            </h3>
            <p className="text-sm text-gray-600">Convert files in seconds</p>
          </div>
          <div className="text-center p-6">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: colors.accent_color }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary_color }}
            >
              Secure
            </h3>
            <p className="text-sm text-gray-600">
              Files are processed securely
            </p>
          </div>
          <div className="text-center p-6">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: colors.accent_color }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary_color }}
            >
              High Quality
            </h3>
            <p className="text-sm text-gray-600">Maintains formatting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
