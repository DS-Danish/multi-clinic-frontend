# AI Heart Disease Chatbot Backend

This is the Python FastAPI backend for the AI Heart Disease Chatbot using LangChain, LangGraph, and FAISS for RAG.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Environment
```bash
# Create .env file and add your OpenRouter API key
# Get your key from https://openrouter.ai/keys
OPENROUTER_API_KEY=your_key_here
```

### 3. Initialize the Database (IMPORTANT!)

**Before running the server for the first time**, you must initialize the FAISS database:

```bash
python initialize_db.py
```

This loads the sample heart disease document into the vector database. Without this step, the chatbot will return an error when you try to ask questions.

### 4. Run the Server
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Or simply:
```bash
python main.py
```

The API will be available at `http://127.0.0.1:8000`

## API Endpoints

### `GET /health`
Check if the FAISS index is loaded and ready for queries.

### `POST /Upload_File`
Upload a new document (PDF, TXT, or MD) to replace the knowledge base.

### `POST /chat`
Ask a question about heart disease.

**Example:**
```json
{
  "question": "What are the symptoms of heart disease?"
}
```

## Troubleshooting

### Error: "No document has been uploaded yet"

**Solution:** Run the initialization script:
```bash
python initialize_db.py
```

This creates the FAISS index with the sample document.

### Starting Fresh

To reset the database:
1. Delete the `faiss-index` folder
2. Run `python initialize_db.py`

## API Documentation

Once running, visit:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Project Structure

```
chatbot-backend-example/
├── main.py                          # FastAPI server & endpoints
├── Agents.py                        # LangChain/LangGraph RAG logic
├── initialize_db.py                 # Database initialization script (NEW!)
├── sample_heart_disease_info.md     # Sample knowledge base
├── .env                             # Environment variables
├── requirements.txt                 # Python dependencies
└── faiss-index/                     # FAISS vector database (auto-generated)
```

## Features

- ✅ Document upload (PDF, TXT, MD)
- ✅ RAG (Retrieval Augmented Generation)
- ✅ Vector search with FAISS
- ✅ LangGraph workflow
- ✅ OpenRouter LLM integration
- ✅ CORS enabled for frontend

## Troubleshooting

### ModuleNotFoundError
Install missing packages:
```bash
pip install -r requirements.txt
```

### CORS Error
Make sure your React app URL is in the allowed origins in `main.py`

### OpenRouter API Error
Verify your API key in `.env` file
