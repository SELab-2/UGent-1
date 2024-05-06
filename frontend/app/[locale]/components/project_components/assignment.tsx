import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import React from "react";
import '../../project/[project_id]/edit/project_styles.css';
import {useTranslation} from "react-i18next";

interface AssignmentProps {
    isAssignmentEmpty: boolean,
    setDescription: (value: (((prevState: string) => string) | string)) => void,
    description: string,
}

function Assignment({isAssignmentEmpty, setDescription, description}: AssignmentProps) {
    const {t} = useTranslation();

    return (
        <div>
            <Typography variant="h5" className={"typographyStyle"}>
                {t("assignment")}
            </Typography>
            <Box
                marginTop={1}
            >
                <TextField
                    variant="outlined"
                    multiline={true}
                    rows={4}
                    error={isAssignmentEmpty}
                    label={t("assignment")}
                    onChange={(event: any) => setDescription(event.target.value)}
                    value={description}
                    helperText={isAssignmentEmpty ? t("assignment_required") : ""}
                    size="small"
                    fullWidth={true}
                    sx={{
                        overflowY: 'auto',
                        height: '100%',
                    }}
                />
            </Box>

        </div>
    )
}

export default Assignment;