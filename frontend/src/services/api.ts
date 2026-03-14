import axios from "axios";
import type { ExtractResponse } from "../types";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

export const extractPdfText = async (file: File): Promise<ExtractResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<ExtractResponse>("/pdf/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
};
