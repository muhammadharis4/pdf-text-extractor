import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import TopNav from "./components/TopNav";
import FileUpload from "./components/FileUpload";
import ExtractedText from "./components/ExtractedText";
import AppSnackbar from "./components/AppSnackbar";
import { extractPdfText } from "./services/api";
import type { ExtractResponse } from "./types";

// Type for managing snackbar state
type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

/**
 * Main App component that manages the overall state and flow of the PDF text extraction application.
 * Handles file uploads, API interactions, and displays results and notifications.
 * Key functionalities:
 * - Manages loading and progress states during file upload and processing
 * - Stores the extracted text result and current file for potential re-processing
 * @returns
 */
export default function App() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<ExtractResponse | null>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [fileUploadKey, setFileUploadKey] = useState(0);
    const [extractMode, setExtractMode] = useState<"standard" | "ocr">(
        "standard",
    );
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleUpload = async (file: File) => {
        setCurrentFile(file);
        setLoading(true);
        setResult(null);
        setProgress(0);

        try {
            const data = await extractPdfText(
                file,
                setProgress,
                extractMode === "ocr",
            );
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

    // Clears result and current file
    const handleReset = () => {
        setResult(null);
        setCurrentFile(null);
        setFileUploadKey((k) => k + 1); // Force re-mount FileUpload to clear its state
    };

    // Re-runs extraction with the stored file and current mode
    const handleRerun = async () => {
        if (currentFile) await handleUpload(currentFile);
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

                    <FileUpload
                        key={fileUploadKey}
                        onUpload={handleUpload}
                        onError={(msg) => showSnackbar(msg, "error")}
                        loading={loading}
                        progress={progress}
                        extractMode={extractMode}
                        onExtractModeChange={setExtractMode}
                    />
                    {result && (
                        <ExtractedText
                            result={result}
                            onReset={handleReset}
                            onRerun={handleRerun}
                        />
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
