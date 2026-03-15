import { Snackbar, Alert } from "@mui/material";

// Interface for AppSnackbar component props
interface Props {
    open: boolean;
    message: string;
    severity: "success" | "error";
    onClose: () => void;
}

/**
 * AppSnackbar component for displaying success and error messages in a consistent manner.
 * @param open Controls whether the snackbar is visible
 * @param message The message to display in the snackbar
 * @param severity The severity level of the message ("success" or "error")
 * @param onClose Callback function to close the snackbar
 * @returns
 */
export default function AppSnackbar({
    open,
    message,
    severity,
    onClose,
}: Props) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}
