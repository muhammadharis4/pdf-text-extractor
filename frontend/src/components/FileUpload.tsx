import { useCallback, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
    onUpload: (file: File) => void;
    loading: boolean;
}

export default function FileUpload({ onUpload, loading }: Props) {
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file?.type === "application/pdf") onUpload(file);
        },
        [onUpload],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
    };

    return (
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
                            accept="application/pdf"
                            hidden
                            onChange={handleChange}
                        />
                    </Button>
                    <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mt={2}
                    >
                        Max file size: 10MB
                    </Typography>
                </>
            )}
        </Box>
    );
}
