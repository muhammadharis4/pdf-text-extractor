import PyPDF2
from io import BytesIO
from fastapi import HTTPException
from app.config import settings
from app.logger import get_logger

logger = get_logger(__name__)

class PDFService:
    @staticmethod
    def validate_pdf(filename: str, file_size: int) -> None:
        logger.info(f"Validating file: {filename}, size: {file_size / 1024:.2f}KB")
        
        if not filename.lower().endswith('.pdf'):
            logger.warning(f"Invalid file type: {filename}")
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        if file_size > settings.MAX_FILE_SIZE:
            logger.warning(f"File too large: {file_size / 1024 / 1024:.2f}MB")
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
            )
    
    @staticmethod
    async def extract_text(pdf_bytes: bytes) -> dict:
        try:
            logger.info("Starting PDF text extraction")
            reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
            text_parts = [page.extract_text() for page in reader.pages]
            logger.info(f"Extraction complete: {len(reader.pages)} pages processed")
            
            return {
                "text": "\n".join(text_parts).strip(),
                "pages": len(reader.pages)
            }
        except Exception as e:
            logger.error(f"PDF extraction failed: {str(e)}")
            raise HTTPException(status_code=422, detail=f"Error processing PDF: {str(e)}")
