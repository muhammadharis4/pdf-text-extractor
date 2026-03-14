import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { ExtractResponse } from "../types";

interface Props {
    result: ExtractResponse;
}

export default function ExtractedText({ result }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
                {/* Header */}
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
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                        onClick={handleCopy}
                        color={copied ? "success" : "primary"}
                    >
                        {copied ? "Copied!" : "Copy Text"}
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Extracted Text */}
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
