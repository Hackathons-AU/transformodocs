from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import zipfile
from docx import Document
import fitz  # PyMuPDF
import re

app = Flask(__name__, static_folder='build', static_url_path='')
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

def check_if_machine_readable(text):
    text = text.strip()

    # Rule 1: Text length should be at least 50 characters
    if len(text) < 50:
        print("Text is too short.")
        return False

    # Rule 2: Text should contain at least one alphanumeric character
    if not any(char.isalnum() for char in text):
        print("Text does not contain alphanumeric characters.")
        return False

    # Rule 3: Detect non-ASCII characters (optional)
    if re.search(r'[^\x00-\x7F]+', text):
        print("Text contains non-ASCII characters.")
        return False

    # Rule 4: Optional: Avoid excessive line breaks
    num_newlines = text.count('\n')
    if num_newlines > 55:  # Increased threshold to accommodate more structured text
        print(f"Text contains {num_newlines} line breaks.")
        return False

    return True


test_text = "hriiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

print(check_if_machine_readable(test_text))

@app.route('/check-mrc', methods=['POST'])
def check_mrc():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "No content field found"}), 400

    # Debugging output
    print(f"Received Content: {content}")

    is_readable = check_if_machine_readable(content)

    return jsonify({"isReadable": is_readable})

@app.route('/')
def index():
    return send_from_directory('build', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)

if __name__ == '__main__':
    app.run(debug=True)

