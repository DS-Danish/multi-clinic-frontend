import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Upload,
  FileText,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ChatbotAPI, ChatMessage } from "../services/chatbot.service";

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [".pdf", ".txt", ".md"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));
    if (!validTypes.includes(fileExtension.toLowerCase())) {
      setError("Please upload a PDF, TXT, or MD file");
      return;
    }

    setUploadLoading(true);
    setError("");

    try {
      const response = await ChatbotAPI.uploadDocument(file);
      setUploadedFile(file.name);
      setMessages([
        {
          role: "assistant",
          content: `✅ ${response.filename} processed successfully! You can now ask questions about the document.`,
        },
      ]);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to upload file. Make sure the FastAPI backend is running."
      );
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);
    setError("");

    try {
      const response = await ChatbotAPI.sendChatMessage(inputMessage);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to get response. Make sure the FastAPI backend is running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                AI Medical Assistant
              </h1>
              <p className="text-gray-600 mt-1">
                Upload medical documents and clinic resources to get instant answers
              </p>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-dashed border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Upload className="text-blue-600" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900">Upload Document</h3>
                  <p className="text-sm text-gray-500">
                    {uploadedFile
                      ? `Current file: ${uploadedFile}`
                      : "Upload PDF, TXT, or MD file to get started"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                variant="outline"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2" size={20} />
                    Choose File
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Upload a document and start asking questions</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" && message.content.includes("✅") && (
                      <CheckCircle className="inline mr-2" size={16} />
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <Loader2 className="animate-spin text-blue-600" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your medical documents..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Ask questions about uploaded documents. Press Enter to send.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="font-medium text-blue-900">How to use:</p>
              <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                <li>Upload a medical document or clinic resource (PDF, TXT, or MD format)</li>
                <li>Wait for the document to be processed</li>
                <li>Ask questions about the uploaded content</li>
                <li>Get AI-powered responses based on your documents</li>
              </ol>
              <p className="text-xs text-blue-700 mt-3">
                <strong>Note:</strong> Make sure the FastAPI backend is running at{" "}
                <code className="bg-blue-100 px-1 rounded">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
