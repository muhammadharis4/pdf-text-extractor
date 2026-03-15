import axios from "axios";
import type { ExtractResponse } from "../types";

/**
 * API client for backend interactions.
 * Currently includes:
 * - extractPdfText: Extract text from a PDF file, with optional OCR.
 * baseURL is set from environment variable VITE_API_URL or defaults to http://localhost:3000/api
 */
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
});

/**
 * Extract text from a PDF file, optionally using OCR.
 * @param file
 * @param onProgress
 * @param useOcr
 * @returns
 */
export const extractPdfText = async (
    file: File,
    onProgress: (percent: number) => void,
    useOcr: boolean = false,
): Promise<ExtractResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<ExtractResponse>(
        `/pdf/extract?use_ocr=${useOcr}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(percent);
                }
            },
        },
    );

    return data;
};
