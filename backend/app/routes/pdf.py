from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import PDFService
from app.schemas.pdf_schema import PDFExtractResponse
from app.exceptions import InvalidFileTypeError, FileTooLargeError, PDFProcessingError

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/extract", response_model=PDFExtractResponse)
async def extract_pdf_text(file: UploadFile = File(...)):
    """Extract text from uploaded PDF file"""
    try:
        pdf_bytes = await file.read()
        PDFService.validate_pdf(file.filename, len(pdf_bytes))
        result = await PDFService.extract_text(pdf_bytes)
        
        return PDFExtractResponse(
            success=True,
            text=result["text"],
            pages=result["pages"],
            filename=file.filename
        )
    except InvalidFileTypeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileTooLargeError as e:
        raise HTTPException(status_code=413, detail=str(e))
    except PDFProcessingError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
