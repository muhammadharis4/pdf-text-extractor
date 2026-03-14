import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import TopNav from "./components/TopNav";
import FileUpload from "./components/FileUpload";
import ExtractedText from "./components/ExtractedText";
import AppSnackbar from "./components/AppSnackbar";
import { extractPdfText } from "./services/api";
import type { ExtractResponse } from "./types";

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

export default function App() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<ExtractResponse | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleUpload = async (file: File) => {
        setLoading(true);
        setResult(null);
        setProgress(0);

        try {
            const data = await extractPdfText(file, setProgress);
            setResult(data);
            showSnackbar("Text extracted successfully!", "success");
        } catch (err: unknown) {
            if (err instanceof Error) {
                showSnackbar(err.message, "error");
            } else {
                showSnackbar(
                    "Something went wrong. Please try again.",
                    "error",
                );
            }
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleReset = () => setResult(null);

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

                    <FileUpload
                        onUpload={handleUpload}
                        onError={(msg) => showSnackbar(msg, "error")}
                        loading={loading}
                        progress={progress}
                    />
                    {result && (
                        <ExtractedText result={result} onReset={handleReset} />
                    )}
                </Box>
            </Container>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}
