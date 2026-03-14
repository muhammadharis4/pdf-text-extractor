import { useState } from "react";
import { Container, Box, Button } from "@mui/material";
import ErrorAlert from "./components/ErrorAlert";

export default function App() {
    const [error, setError] = useState<string | null>(null);

    return (
        <Container maxWidth="md">
            <Box py={6}>
                <ErrorAlert message={error} onClose={() => setError(null)} />
                <Button
                    variant="contained"
                    onClick={() => setError("Test error message!")}
                >
                    Trigger Error
                </Button>
            </Box>
        </Container>
    );
}
