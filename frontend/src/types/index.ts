/**
 * Type for the response from the PDF text extraction API.
 * Includes:
 * - success: Indicates if the extraction was successful
 * - text: The extracted text content from the PDF
 * - pages: The number of pages in the PDF
 * - filename: The original filename of the uploaded PDF
 */
export interface ExtractResponse {
    success: boolean;
    text: string;
    pages: number;
    filename: string;
}

/**
 * Type for API error responses.
 * Includes:
 * - detail: A string message describing the error
 */
export interface ApiError {
    detail: string;
}
