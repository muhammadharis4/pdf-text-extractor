import { useState } from "react";
import { Container, Box } from "@mui/material";
import FileUpload from "./components/FileUpload";
import ErrorAlert from "./components/ErrorAlert";

export default function App() {
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (file: File) => {
        console.log("Uploaded file:", file.name);
    };

    return (
        <Container maxWidth="md">
            <Box py={6}>
                <ErrorAlert message={error} onClose={() => setError(null)} />
                <FileUpload onUpload={handleUpload} loading={false} />
            </Box>
        </Container>
    );
}
