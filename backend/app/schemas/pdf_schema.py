from pydantic import BaseModel

class PDFExtractResponse(BaseModel):
    success: bool
    text: str
    pages: int
    filename: str
