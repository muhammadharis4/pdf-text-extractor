# PDF Text Extractor

A web application to extract text content from PDF files, with optional OCR support for scanned documents.

![screenshot](screenshots/app.png) <!-- optional -->

## Features

- Upload PDF via drag-and-drop or file browser
- Standard text extraction for digital PDFs
- OCR extraction for scanned/image-based PDFs
- Copy or download extracted text as `.txt`
- Fully containerized with Docker

## Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Frontend       | React, TypeScript, Material-UI |
| Backend        | FastAPI, Python                |
| OCR            | Tesseract, PyMuPDF             |
| Infrastructure | Docker, Docker Compose, nginx  |

## Quick Start

### With Docker (recommended)

```bash
git clone <your-repo-url>
cd pdf-text-extractor
docker-compose up --build
```

Visit: [**http://localhost:8080**](http://localhost:8080)

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

Visit: [**http://localhost:5173**](http://localhost:5173)

## Running Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## Project Structure

```
pdf-text-extractor/
├── frontend/          # React app
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── backend/           # FastAPI app
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
