from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Import after adding to path
from Agents import graph, Load_Docs, faiss_index

app = FastAPI(title="AI Heart Disease Chatbot API")

# CORS Configuration - Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserEntry(BaseModel):
    question: str


@app.get("/")
def read_root():
    return {
        "message": "AI Heart Disease Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "index_loaded": faiss_index is not None,
        "endpoints": [
            {"path": "/health", "method": "GET", "description": "Check API and index status"},
            {"path": "/Upload_File", "method": "POST", "description": "Upload a document for RAG processing"},
            {"path": "/chat", "method": "POST", "description": "Send a question and get AI response"},
        ],
    }


@app.get("/health")
def health_check():
    """Check if the API is running and if a document has been loaded"""
    return {
        "status": "healthy",
        "index_loaded": faiss_index is not None,
        "index_path_exists": os.path.exists("faiss-index"),
        "message": "Ready to chat" if faiss_index is not None else "Please upload a document first"
    }


@app.post("/Upload_File")
async def upload(file: UploadFile):
    """
    Upload a document file (PDF, TXT, or MD) for processing.
    The file will be embedded and stored in a FAISS vector database.
    """
    # Validate file type
    allowed_extensions = [".pdf", ".txt", ".md"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        return {
            "error": "Invalid file type",
            "message": f"Only {', '.join(allowed_extensions)} files are allowed",
        }
    
    # Save uploaded file to temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        # Process the document with LangChain
        Load_Docs(temp_path)
        
        return {
            "filename": file.filename,
            "stored_path": temp_path,
            "status": "Processed successfully",
        }
    except Exception as e:
        return {
            "error": "Processing failed",
            "message": str(e),
        }


@app.post("/chat")
async def chat(user: UserEntry):
    """
    Send a question and get an AI-generated response based on the uploaded document.
    """
    try:
        answer = graph.invoke({"question": user.question})
        result = answer["answer"]

        return {
            "Assistant": result
        }
    except ValueError as e:
        # Handle the "No document uploaded" error specifically
        raise HTTPException(
            status_code=400,
            detail={
                "error": "No document loaded",
                "message": str(e),
                "suggestion": "Please upload a document first using the /Upload_File endpoint"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Chat failed",
                "message": str(e),
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
