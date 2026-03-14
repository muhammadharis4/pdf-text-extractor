import { Snackbar, Alert } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SuccessToast({ open, onClose }: Props) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity="success" variant="filled">
                Text extracted successfully!
            </Alert>
        </Snackbar>
    );
}
