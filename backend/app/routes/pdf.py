from fastapi import APIRouter, UploadFile, File
from app.services.pdf_service import PDFService
from app.schemas.pdf_schema import PDFExtractResponse

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/extract", response_model=PDFExtractResponse)
async def extract_pdf_text(file: UploadFile = File(...)):
    """Extract text from uploaded PDF file"""
    pdf_bytes = await file.read()
    PDFService.validate_pdf(file.filename, len(pdf_bytes))
    result = await PDFService.extract_text(pdf_bytes)

    # Clean up memory
    del pdf_bytes

    return PDFExtractResponse(
        success=True,
        text=result["text"],
        pages=result["pages"],
        filename=file.filename
    )
