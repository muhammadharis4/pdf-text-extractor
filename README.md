# PDF Text Extractor

A web application to extract text content from PDF files, with optional OCR support for scanned documents.

## Features

- Upload PDF via drag-and-drop or file browser
- Standard text extraction for digital PDFs
- OCR extraction for scanned/image-based PDFs
- Copy or download extracted text as `.txt`
- Fully containerized with Docker

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React, TypeScript, Material-UI          |
| Backend        | FastAPI, Python                         |
| OCR            | Tesseract, PyMuPDF, pytesseract, Pillow |
| Infrastructure | Docker, Docker Compose, nginx           |

## Prerequisites

- **Docker & Docker Compose** _(recommended — no manual installs needed)_
- **OR** if running locally without Docker:
    - Python 3.11+
    - Node.js 20+
    - Tesseract OCR installed on your system:
        - **Windows:** [Download installer](https://github.com/UB-Mannheim/tesseract/wiki)
        - **macOS:** `brew install tesseract`
        - **Linux:** `sudo apt install tesseract-ocr`

## How It Works

1. **Upload** — User selects a PDF via the frontend (drag-and-drop or file browser)
2. **Route** — nginx proxies all `/api/*` requests to the FastAPI backend
3. **Extract** — Backend checks if OCR is requested:
    - **Standard:** PyMuPDF reads embedded text directly from the PDF ⚡ Fast
    - **OCR:** PyMuPDF converts each page to an image → Tesseract reads the text 🐢 Slower but handles scanned documents
4. **Response** — Extracted text is returned as JSON to the frontend
5. **Display** — User can copy the text or download it as a `.txt` file

## Quick Start

### With Docker (recommended)

```bash
git clone <your-repo-url>
cd pdf-text-extractor
docker-compose up --build
```

Visit: [[**http://localhost:8080**](http://localhost:8080)](http://localhost:8080)

### Without Docker

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Visit: [[**http://localhost:5173**](http://localhost:5173)](http://localhost:5173)

> ⚠️ When running without Docker, make sure Tesseract OCR is installed on your system (see [Prerequisites](#prerequisites)) before starting the backend.

## Running Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## Project Structure

```
pdf-text-extractor/
├── frontend/               # React app (TypeScript + Material-UI)
│   ├── src/
│   ├── nginx.conf          # nginx config for routing & reverse proxy
│   └── Dockerfile
├── backend/                # FastAPI app (Python)
│   ├── app/
│   │   ├── main.py         # API entry point & routes
│   │   ├── extractor.py    # PyMuPDF standard extraction logic
│   │   └── ocr.py          # Tesseract OCR extraction logic
│   ├── requirements.txt    # pytesseract, Pillow, pymupdf, fastapi...
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
