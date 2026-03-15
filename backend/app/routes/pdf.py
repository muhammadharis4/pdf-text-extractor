from fastapi import APIRouter, UploadFile, File, Query
from app.services.pdf_service import PDFService
from app.schemas.pdf_schema import PDFExtractResponse
from app.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/pdf", tags=["PDF"])


@router.post("/extract", response_model=PDFExtractResponse)
async def extract_pdf_text(
    file: UploadFile = File(...),
    use_ocr: bool = Query(False, description="Use OCR for scanned PDFs")
):
    """Extract text from uploaded PDF file"""
    logger.info(f"Received file: {file.filename}, use_ocr: {use_ocr}")

    pdf_bytes = await file.read()
    PDFService.validate_pdf(file.filename, len(pdf_bytes))

    result = await (
        PDFService.extract_text_ocr(pdf_bytes)
        if use_ocr
        else PDFService.extract_text(pdf_bytes)
    )

    del pdf_bytes

    logger.info(f"Successfully extracted {result['pages']} pages from {file.filename}")

    return PDFExtractResponse(
        success=True,
        text=result["text"],
        pages=result["pages"],
        filename=file.filename
    )
