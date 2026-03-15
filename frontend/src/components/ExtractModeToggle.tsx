import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

// Interface for the props of the ExtractModeToggle component
interface Props {
    value: "standard" | "ocr";
    onChange: (mode: "standard" | "ocr") => void;
    disabled?: boolean;
}

/**
 * Component for toggling between standard text extraction and OCR modes.
 * @param value - Current extraction mode ("standard" or "ocr")
 * @param onChange - Callback to update the extraction mode
 * @param disabled - Whether the toggle is disabled
 * @returns
 */
export default function ExtractModeToggle({
    value,
    onChange,
    disabled,
}: Props) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={(_, newValue) => newValue && onChange(newValue)}
                disabled={disabled}
            >
                <ToggleButton value="standard">
                    <TextSnippetIcon sx={{ mr: 1 }} />
                    Convert to Text (Standard)
                </ToggleButton>
                <ToggleButton value="ocr">
                    <DocumentScannerIcon sx={{ mr: 1 }} />
                    Convert to Text (OCR)
                </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" color="text.secondary" mt={1}>
                {value === "standard"
                    ? "Best for digital PDFs (Word exports, invoices, etc.)"
                    : "Best for scanned documents or image-based PDFs — slower"}
            </Typography>
        </Box>
    );
}
