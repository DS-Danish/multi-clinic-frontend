# AI Medical Assistant Chatbot - Setup Guide

## Overview
The chatbot has been successfully integrated into the React frontend. It communicates with a Python FastAPI backend that uses LangChain for RAG (Retrieval Augmented Generation) to answer questions based on uploaded medical documents and clinic resources.

## Architecture
- **Frontend**: React (TypeScript) - Located in `src/pages/ChatbotPage.tsx`
- **Backend**: Python FastAPI with LangChain
- **Vector Store**: FAISS
- **LLM**: OpenRouter API (GPT-OSS-20B)
- **Embeddings**: HuggingFace (BAAI/bge-small-en-v1.5)

## Python Backend Setup

### 1. Create Backend Directory
```bash
mkdir chatbot-backend
cd chatbot-backend
```

### 2. Create Files

Create `Agents.py`:
```python
# Copy your Agents.py code here (the first Python file you provided)
```

Create `main.py`:
```python
# Copy your FastAPI main.py code here (the second Python file you provided)
```

Create `.env`:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Install Dependencies
```bash
pip install fastapi uvicorn python-dotenv langchain langchain-openai langchain-community langchain-huggingface langgraph faiss-cpu pypdf unstructured python-multipart
```

### 4. Run the Backend
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend should now be running at `http://127.0.0.1:8000`

## Frontend Integration

### Accessing the Chatbot

The chatbot is accessible from multiple locations:

1. **Direct URL**: `/chatbot`
2. **Patient Dashboard**: "AI Medical Assistant" button in header
3. **Doctor Dashboard**: "AI Medical Assistant" in Quick Actions
4. **Clinic Admin Dashboard**: "AI Medical Assistant" in Quick Actions grid

### How to Use

1. **Navigate to the chatbot** from any dashboard
2. **Upload a document** (PDF, TXT, or MD format) containing medical information, clinic protocols, or other resources
3. **Wait for processing** - The document will be chunked and embedded
4. **Ask questions** about the uploaded content
5. **Receive AI responses** based on the uploaded documents

### Features

✅ File upload (PDF, TXT, MD)
✅ Real-time chat interface
✅ Message history
✅ Loading states
✅ Error handling
✅ Responsive design
✅ Beautiful UI with Tailwind CSS

## API Endpoints

### Upload File
- **POST** `/Upload_File`
- **Body**: FormData with `file` field
- **Response**: 
  ```json
  {
    "filename": "document.pdf",
    "stored_path": "/tmp/xyz123",
    "status": "Processed successfully"
  }
  ```

### Chat
- **POST** `/chat`
- **Body**: 
  ```json
  {
    "question": "What is the clinic's policy on patient records?"
  }
  ```
- **Response**: 
  ```json
  {
    "Assistant": "Based on the uploaded documents..."
  }
  ```

## Configuration

### Changing Backend URL

If you deploy the backend to a different host/port, update the URL in:

**File**: `src/services/chatbot.service.ts`
```typescript
const CHATBOT_API_URL = "http://your-backend-url:port";
```

### CORS Configuration

The FastAPI backend needs CORS enabled. Add this to your `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Backend not accessible
- ✅ Ensure FastAPI is running on port 8000
- ✅ Check CORS is configured
- ✅ Verify OpenRouter API key is valid

### File upload fails
- ✅ Check file type is PDF, TXT, or MD
- ✅ Ensure dependencies are installed
- ✅ Check backend logs for errors

### No responses from chatbot
- ✅ Upload a document first
- ✅ Check OpenRouter API key
- ✅ Verify FAISS index is created

## File Structure

```
multi-clinic-frontend/
├── src/
│   ├── pages/
│   │   └── ChatbotPage.tsx          # Main chatbot UI
│   ├── services/
│   │   └── chatbot.service.ts       # API calls to backend
│   └── App.tsx                       # Routing configuration
│
chatbot-backend/ (separate directory)
├── Agents.py                         # LangChain RAG logic
├── main.py                           # FastAPI endpoints
├── .env                              # Environment variables
└── requirements.txt                  # Python dependencies
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file with API keys
- Implement rate limiting for production
- Add authentication to chatbot endpoints
- Validate file uploads thoroughly
- Set up proper CORS for production

## Next Steps

1. ✅ Set up the Python backend
2. ✅ Get OpenRouter API key
3. ✅ Test file upload functionality
4. ✅ Test chat functionality
5. 📝 Customize the chatbot prompt as needed
6. 📝 Add user authentication to chatbot endpoints
7. 📝 Deploy backend to cloud (Heroku, Railway, etc.)

## Support

If you encounter issues:
1. Check backend logs
2. Check browser console for errors
3. Verify all dependencies are installed
4. Ensure environment variables are set correctly
