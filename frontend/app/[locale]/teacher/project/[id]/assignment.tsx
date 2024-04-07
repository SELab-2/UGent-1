import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import React from "react";

function Assignment(
    isAssignmentEmpty: boolean,
    setDescription: (value: (((prevState: string) => string) | string)) => void,
    description: string
) {
    return <>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {"Assignment"}
        </Typography>
        <Box sx={{maxWidth: '100%'}}>
            <TextField
                variant="outlined"
                multiline={true}
                error={isAssignmentEmpty}
                onChange={(event: any) => setDescription(event.target.value)}
                value={description}
                helperText={isAssignmentEmpty ? "Assignment is required" : ""}
                size="small"
            />
        </Box>
    </>;
}

export default Assignment;