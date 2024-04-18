import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import React from "react";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import './project_styles.css';

function Assignment(
    isAssignmentEmpty: boolean,
    setDescription: (value: (((prevState: string) => string) | string)) => void,
    description: string,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
) {
    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
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
                className={"assignmentTextField"}
                rows={5}
            />
        </Box>
    </TranslationsProvider>;
}

export default Assignment;