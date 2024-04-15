import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import React from "react";
import './project_styles.css';

interface AssignmentProps {
    isAssignmentEmpty: boolean,
    setDescription: (value: (((prevState: string) => string) | string)) => void,
    description: string,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
}

function Assignment({isAssignmentEmpty, setDescription, description, translations}: AssignmentProps) {
    return (
        <div>
            <Typography variant="h5" className={"typographyStyle"}>
                {translations.t("assignment")}
            </Typography>
            <Box>
                <TextField
                    variant="outlined"
                    multiline={true}
                    error={isAssignmentEmpty}
                    onChange={(event: any) => setDescription(event.target.value)}
                    value={description}
                    helperText={isAssignmentEmpty ? translations.t("assignment_required") : ""}
                    size="small"
                />
            </Box>
        </div>
    )
}

export default Assignment;