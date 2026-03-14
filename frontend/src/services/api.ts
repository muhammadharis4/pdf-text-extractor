import axios from "axios";
import type { ExtractResponse } from "../types";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

export const extractPdfText = async (
    file: File,
    onProgress: (percent: number) => void,
): Promise<ExtractResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<ExtractResponse>("/pdf/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                onProgress(percent);
            }
        },
    });

    return data;
};
