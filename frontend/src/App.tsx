import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import TopNav from "./components/TopNav";
import FileUpload from "./components/FileUpload";
import ExtractedText from "./components/ExtractedText";
import ErrorAlert from "./components/ErrorAlert";
import { extractPdfText } from "./services/api";
import type { ExtractResponse } from "./types";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ExtractResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await extractPdfText(file);
            setResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopNav />
            <Container maxWidth="md">
                <Box py={6}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        textAlign="center"
                    >
                        PDF Text Extractor
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                        mb={4}
                    >
                        Upload a PDF and extract its text content instantly
                    </Typography>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
                    />
                    <FileUpload onUpload={handleUpload} loading={loading} />
                    {result && <ExtractedText result={result} />}
                </Box>
            </Container>
        </>
    );
}
