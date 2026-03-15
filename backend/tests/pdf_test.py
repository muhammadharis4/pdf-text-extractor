import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from io import BytesIO
from pypdf import PdfWriter


def create_test_pdf() -> bytes:
    buffer = BytesIO()
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    writer.write(buffer)
    return buffer.getvalue()


# ---- Standard Extraction Tests ----

@pytest.mark.asyncio
async def test_extract_pdf_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract",
            files={"file": ("test.pdf", create_test_pdf(), "application/pdf")}
        )

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["filename"] == "test.pdf"


@pytest.mark.asyncio
async def test_extract_invalid_file_type():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract",
            files={"file": ("test.txt", b"hello world", "text/plain")}
        )

    assert response.status_code == 400
    assert "Only PDF files are allowed" in response.json()["detail"]


@pytest.mark.asyncio
async def test_extract_file_too_large():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        large_file = b"%PDF-1.4" + b"0" * (11 * 1024 * 1024)
        response = await client.post(
            "/api/pdf/extract",
            files={"file": ("large.pdf", large_file, "application/pdf")}
        )

    assert response.status_code == 413


@pytest.mark.asyncio
async def test_extract_no_file():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/pdf/extract")

    assert response.status_code == 422


# ---- OCR Extraction Tests ----

@pytest.mark.asyncio
async def test_extract_pdf_ocr_success():
    """OCR on a valid PDF should return 200 with success=True"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract?use_ocr=true",
            files={"file": ("test.pdf", create_test_pdf(), "application/pdf")}
        )

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["filename"] == "test.pdf"


@pytest.mark.asyncio
async def test_extract_pdf_ocr_returns_pages():
    """OCR extraction should return correct page count"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract?use_ocr=true",
            files={"file": ("test.pdf", create_test_pdf(), "application/pdf")}
        )

    assert response.status_code == 200
    assert response.json()["pages"] == 1


@pytest.mark.asyncio
async def test_extract_pdf_ocr_invalid_file_type():
    """OCR mode should still reject non-PDF files"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract?use_ocr=true",
            files={"file": ("test.txt", b"hello world", "text/plain")}
        )

    assert response.status_code == 400
    assert "Only PDF files are allowed" in response.json()["detail"]


@pytest.mark.asyncio
async def test_extract_pdf_ocr_file_too_large():
    """OCR mode should still reject files exceeding size limit"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        large_file = b"%PDF-1.4" + b"0" * (11 * 1024 * 1024)
        response = await client.post(
            "/api/pdf/extract?use_ocr=true",
            files={"file": ("large.pdf", large_file, "application/pdf")}
        )

    assert response.status_code == 413


# ---- Default Mode Tests ----

@pytest.mark.asyncio
async def test_extract_default_mode_is_standard():
    """Omitting use_ocr should default to standard extraction"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/pdf/extract",  # no ?use_ocr param
            files={"file": ("test.pdf", create_test_pdf(), "application/pdf")}
        )

    assert response.status_code == 200
    assert response.json()["success"] is True
