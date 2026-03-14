import { useState } from "react";
import { Container, Box } from "@mui/material";
import FileUpload from "./components/FileUpload";
import ExtractedText from "./components/ExtractedText";
import ErrorAlert from "./components/ErrorAlert";
import type { ExtractResponse } from "./types";

const MOCK_RESULT: ExtractResponse = {
    success: true,
    filename: "sample.pdf",
    pages: 3,
    text: "This is extracted text from the PDF.\n\nPage 2 content here.\n\nPage 3 content here.",
};

export default function App() {
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (file: File) => {
        console.log("Uploaded file:", file.name);
    };

    return (
        <Container maxWidth="md">
            <Box py={6}>
                <ErrorAlert message={error} onClose={() => setError(null)} />
                <FileUpload onUpload={handleUpload} loading={false} />
                <ExtractedText result={MOCK_RESULT} />
            </Box>
        </Container>
    );
}
