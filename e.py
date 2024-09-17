from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import zipfile
from docx import Document
import fitz  # PyMuPDF
import re

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS

# Ensure the temp directory exists
if not os.path.exists('temp'):
    os.makedirs('temp')

def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        return {"error": f"Failed to extract text from PDF: {e}"}

def extract_text_from_docx(docx_path):
    try:
        doc = Document(docx_path)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return {"error": f"Failed to extract text from DOCX: {e}"}

def extract_file_from_zip(zip_path, extract_to_folder):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to_folder)
        return [os.path.join(extract_to_folder, file) for file in zip_ref.namelist()]

def process_document(file_path):
    if file_path.endswith(".zip"):
        extract_folder = "temp/"
        extracted_files = extract_file_from_zip(file_path, extract_folder)
        for file in extracted_files:
            if file.endswith(".pdf"):
                text = extract_text_from_pdf(file)
            elif file.endswith(".docx"):
                text = extract_text_from_docx(file)
            else:
                return {"error": f"Unsupported file format: {file}"}
            return {"content": text}
    else:
        if file_path.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            return {"error": "Unsupported file format"}
        return {"content": text}

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    file_path = os.path.join('temp', file.filename)
    file.save(file_path)
    
    result = process_document(file_path)
    
    os.remove(file_path)  # Clean up
    return jsonify(result)

# Refined machine-readable check function
def check_if_machine_readable(text):
    # Strip leading/trailing whitespaces and count line breaks
    text = text.strip()
    
    # Rule 1: The text should not contain too many line breaks
    num_newlines = text.count('\n')
    if num_newlines > 10:  # Threshold of 10 newlines can be adjusted based on document type
        return False

    # Rule 2: The text should contain alphanumeric characters
    if not any(char.isalnum() for char in text):
        return False

    # Rule 3: Detect if the text contains special control characters (non-ASCII) that could indicate a scanned image or unstructured data
    if re.search(r'[^\x00-\x7F]+', text):
        return False

    # Rule 4: Ensure text contains a minimum length (to avoid blank text being considered readable)
    if len(text) < 50:  # Arbitrary length threshold, adjust as needed
        return False

    return True

@app.route('/check-mrc', methods=['POST'])
def check_mrc():
    data = request.json
    content = data.get('content', '')

    is_readable = check_if_machine_readable(content)  # Call the readability check function

    return jsonify({"isReadable": is_readable})

if __name__ == '__main__':
    app.run(debug=True)
