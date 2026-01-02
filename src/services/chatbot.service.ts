import axios from "axios";

// FastAPI backend URL - update this to match your Python backend
const CHATBOT_API_URL = "http://127.0.0.1:8000";

const chatbotApi = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  Assistant: string;
}

export interface UploadFileResponse {
  filenames: string[];
  count: number;
  status: string;
}

/**
 * Upload document files (PDF, TXT, or MD) for RAG processing
 */
export const uploadDocument = async (files: File[]): Promise<UploadFileResponse> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("files", file);
  });

  const response = await chatbotApi.post<UploadFileResponse>("/Upload_File", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Send a chat message and get AI response
 */
export const sendChatMessage = async (question: string): Promise<string> => {
  const response = await chatbotApi.post<ChatResponse>("/chat", {
    question,
  });

  return response.data.Assistant;
};

export const ChatbotAPI = {
  uploadDocument,
  sendChatMessage,
};
