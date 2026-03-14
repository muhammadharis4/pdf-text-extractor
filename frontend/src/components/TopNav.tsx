import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function TopNav() {
    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{ backgroundColor: "#fff" }}
        >
            <Toolbar>
                <Box display="flex" alignItems="center" gap={1}>
                    <PictureAsPdfIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={700} color="primary">
                        PDF Extractor
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
