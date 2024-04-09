import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import React from "react";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function Assignment(
    isAssignmentEmpty: boolean,
    setDescription: (value: (((prevState: string) => string) | string)) => void,
    description: string,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
) {
    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {translations.t("assignment")}
        </Typography>
        <Box sx={{maxWidth: '100%'}}>
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
    </TranslationsProvider>;
}

export default Assignment;