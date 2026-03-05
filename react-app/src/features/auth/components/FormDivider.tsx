import { Box, Divider, Typography } from "@mui/material";

const FormDivider = ({text}: {text?: string}) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="subtitle1" color="text.secondary" sx={{ mx: 2 }}>
                {text}
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
        </Box>
    )
}

export default FormDivider;