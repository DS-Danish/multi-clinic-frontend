# Updated Chatbot Backend Prompt

## Important: Update Your Backend

If you're running the chatbot backend in a separate project, update the `generate()` function in your `Agents.py` file with this new prompt:

## Updated `generate()` Function

```python
def generate(state: State):
    docs_text = "\n\n".join(doc.page_content for doc in state["context"])
    question = state["question"]

    prompt = f"""
You are an intelligent medical assistant for a multi-clinic management system. You help clinic staff (doctors, receptionists, administrators) and patients by providing accurate information based on uploaded medical documents and clinic resources.

IMPORTANT RULES:
1. Answer ONLY based on the provided context below
2. If the question is not related to the uploaded medical documents or clinical information, politely decline and say: "I can only answer questions based on the uploaded medical documents and clinical information in our system."
3. Provide clear, professional, and accurate responses
4. If you cannot find the answer in the context, say: "I don't have that specific information in the uploaded documents. Please consult with your healthcare provider or clinic staff for more details."
5. Never make up medical information or provide advice beyond what's in the documents
6. Be helpful to all user types: patients seeking information, clinic staff looking up protocols, or administrators reviewing resources

Context from uploaded documents:
{docs_text}

Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)
    return {"answer": response.content}
```

## Key Changes from Old Prompt

### ❌ Old (Heart Disease Only)
- Restricted to cardiology/heart disease topics
- Hard-coded "Dr Ahmed" appointment message
- Rejected non-heart-related questions

### ✅ New (General Medical Assistant)
- Works with any medical documents and clinic resources
- No hard-coded appointment messages
- Supports questions about:
  - Medical conditions and treatments
  - Clinic policies and procedures
  - Patient care protocols
  - Administrative information
  - Any content in uploaded documents

## Example Use Cases

### For Patients
- "What are the symptoms mentioned in my report?"
- "How should I prepare for my procedure?"
- "What medications are mentioned here?"

### For Clinic Staff
- "What is our policy on patient record retention?"
- "What are the steps for emergency triage?"
- "How do we handle insurance claims?"

### For Administrators
- "What are the compliance requirements?"
- "What is the staff onboarding process?"
- "What are the billing procedures?"

## Recommended Documents to Upload

1. **Medical Resources**
   - Disease information guides
   - Treatment protocols
   - Diagnostic criteria
   - Medication information

2. **Clinic Policies**
   - Patient care guidelines
   - Emergency procedures
   - Privacy policies (HIPAA compliance)
   - Staff protocols

3. **Administrative Documents**
   - Billing procedures
   - Insurance handling
   - Appointment scheduling policies
   - Record management

## Backend Location

This prompt update should be applied to your backend `Agents.py` file, which is typically in a separate directory like:
- `chatbot-backend/Agents.py`
- `backend/Agents.py`
- Or wherever you've set up your FastAPI backend

After updating, restart your FastAPI server for changes to take effect.
