import { Alert, Collapse } from "@mui/material";

interface Props {
    message: string | null;
    onClose: () => void;
}

export default function ErrorAlert({ message, onClose }: Props) {
    return (
        <Collapse in={!!message}>
            <Alert severity="error" onClose={onClose} sx={{ mb: 2 }}>
                {message}
            </Alert>
        </Collapse>
    );
}
