import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    LinearProgress,
    Chip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExtractModeToggle from "./ExtractModeToggle";

// Constants for file validation
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Interface for FileUpload component props
interface Props {
    onUpload: (file: File) => void;
    onError: (message: string) => void;
    loading: boolean;
    progress: number;
    extractMode: "standard" | "ocr";
    onExtractModeChange: (mode: "standard" | "ocr") => void;
}

/**
 * FileUpload component for handling PDF uploads with drag-and-drop and file selection.
 * @param onUpload Callback when a file is selected and validated
 * @param onError Callback for validation errors
 * @param loading Indicates if an upload or processing is in progress
 * @param progress Upload progress percentage (0-100)
 * @param extractMode Current extraction mode ("standard" or "ocr")
 * @param onExtractModeChange Callback to change the extraction mode
 * @returns
 */
export default function FileUpload({
    onUpload,
    onError,
    loading,
    progress,
    extractMode,
    onExtractModeChange,
}: Props) {
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const validate = (file: File): boolean => {
        if (file.type !== "application/pdf") {
            onError("Only PDF files are supported.");
            return false;
        }
        if (file.size > MAX_SIZE_BYTES) {
            onError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
            return false;
        }
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (!validate(file)) return;
        setSelectedFile(file);
        onUpload(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!validate(file)) return;
        setSelectedFile(file);
        onUpload(file);
    };

    // uploading = file bytes being sent | processing = backend working
    const isUploading = loading && progress < 100;
    const isProcessing = loading && progress >= 100;

    return (
        <Box>
            {/* Extraction Mode Toggle */}
            <ExtractModeToggle
                value={extractMode}
                onChange={onExtractModeChange}
                disabled={loading}
            />

            {/* File Upload Area */}
            <Box
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                sx={{
                    border: `2px dashed ${dragging ? "#1976d2" : "#ccc"}`,
                    borderRadius: 3,
                    p: 6,
                    textAlign: "center",
                    backgroundColor: dragging ? "#e3f2fd" : "#fafafa",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                }}
            >
                {/* Processing state — spinner + message */}
                {isProcessing ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                    >
                        <CircularProgress size={48} />
                        <Typography variant="body1" fontWeight={500}>
                            {extractMode === "ocr"
                                ? "Running OCR, this may take a moment..."
                                : "Extracting text..."}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Please wait while we process your PDF
                        </Typography>
                    </Box>
                ) : // Uploading state — just show spinner, bar is below
                isUploading ? (
                    <CircularProgress />
                ) : (
                    // Idle state — normal upload UI
                    <>
                        <UploadFileIcon
                            sx={{ fontSize: 48, color: "#1976d2", mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            Drag & drop a PDF here
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            or
                        </Typography>
                        <Button variant="contained" component="label">
                            Browse File
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                onChange={handleChange}
                            />
                        </Button>
                        <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                            mt={2}
                        >
                            Max file size: {MAX_SIZE_MB}MB · PDF only
                        </Typography>

                        {selectedFile && (
                            <Chip
                                icon={<InsertDriveFileIcon />}
                                label={`${selectedFile.name} · ${formatSize(selectedFile.size)}`}
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                    </>
                )}
            </Box>

            {/* Uploading progress bar for file upload */}
            {isUploading && (
                <Box mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={0.5}
                        display="block"
                        textAlign="center"
                    >
                        Uploading... {progress}%
                    </Typography>
                </Box>
            )}

            {/* Processing bar for backend processing */}
            {isProcessing && (
                <Box mt={2}>
                    <LinearProgress variant="indeterminate" />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={0.5}
                        display="block"
                        textAlign="center"
                    >
                        {extractMode === "ocr"
                            ? "OCR processing..."
                            : "Processing PDF..."}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
