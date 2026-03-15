import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ReplayIcon from "@mui/icons-material/Replay";
import type { ExtractResponse } from "../types";

// Interface for ExtractedText component props
interface Props {
    result: ExtractResponse;
    onReset: () => void;
    onRerun: () => void;
}

/**
 * ExtractedText component to display the extracted text from the PDF along with options to copy, download, rerun, or reset.
 * @param result The result object containing filename, pages, and extracted text
 * @param onReset Callback function to reset the view and allow new uploads
 * @param onRerun Callback function to re-extract with current mode
 * @returns
 */
export default function ExtractedText({ result, onReset, onRerun }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([result.text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename.replace(".pdf", ".txt");
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Box>
                        <Typography variant="h6">{result.filename}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {result.pages}{" "}
                            {result.pages === 1 ? "page" : "pages"}
                        </Typography>
                    </Box>

                    {/* Icon buttons only */}
                    <Box display="flex" gap={0.5}>
                        <Tooltip title={copied ? "Copied!" : "Copy text"}>
                            <IconButton
                                onClick={handleCopy}
                                color={copied ? "success" : "default"}
                            >
                                {copied ? <CheckIcon /> : <ContentCopyIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download .txt">
                            <IconButton
                                onClick={handleDownload}
                                color="default"
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Re-extract with current mode">
                            <IconButton onClick={onRerun} color="primary">
                                <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Close">
                            <IconButton onClick={onReset} color="error">
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        maxHeight: 400,
                        overflowY: "auto",
                        backgroundColor: "#f9f9f9",
                        borderRadius: 1,
                        p: 2,
                    }}
                >
                    <Typography variant="body2" whiteSpace="pre-wrap">
                        {result.text ||
                            "No text could be extracted from this PDF."}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
