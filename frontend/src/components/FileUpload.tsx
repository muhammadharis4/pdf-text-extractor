import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface Props {
    onUpload: (file: File) => void;
    onError: (message: string) => void;
    loading: boolean;
    progress: number;
}

export default function FileUpload({
    onUpload,
    onError,
    loading,
    progress,
}: Props) {
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            onError("Only PDF files are supported.");
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            onError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }
        onUpload(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            onError("Only PDF files are supported.");
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            onError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }
        onUpload(file);
    };

    return (
        <Box>
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
                {loading ? (
                    <CircularProgress />
                ) : (
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
                    </>
                )}
            </Box>

            {/* Progress Bar */}
            {loading && (
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
        </Box>
    );
}
