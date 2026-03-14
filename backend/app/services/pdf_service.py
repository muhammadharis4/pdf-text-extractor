import PyPDF2
from io import BytesIO
from app.exceptions import PDFProcessingError, InvalidFileTypeError, FileTooLargeError
from app.config import settings

class PDFService:
    @staticmethod
    def validate_pdf(filename: str, file_size: int) -> None:
        if not filename.lower().endswith('.pdf'):
            raise InvalidFileTypeError("Only PDF files are allowed")
        
        if file_size > settings.MAX_FILE_SIZE:
            raise FileTooLargeError(f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024}MB")
    
    @staticmethod
    async def extract_text(pdf_bytes: bytes) -> dict:
        try:
            reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
            text_parts = [page.extract_text() for page in reader.pages]
            
            return {
                "text": "\n".join(text_parts).strip(),
                "pages": len(reader.pages)
            }
        except Exception as e:
            raise PDFProcessingError(f"Error processing PDF: {str(e)}")
