export interface ExtractResponse {
    success: boolean;
    text: string;
    pages: number;
    filename: string;
}

export interface ApiError {
    detail: string;
}
