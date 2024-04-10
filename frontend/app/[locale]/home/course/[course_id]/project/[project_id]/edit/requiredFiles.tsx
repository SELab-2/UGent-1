import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

function RequiredFiles(
    files: any[],
    setFiles: (value: (((prevState: any[]) => any[]) | any[])) => void,
    translations: { t: any; resources: any; locale: any; i18nNamespaces: string[]; }
) {
    const handleFieldChange = (index: number, event: any) => {
        const newFields = [...files];
        newFields[index] = event.target.value;
        setFiles(newFields);

        if (index === files.length - 1 && event.target.value !== '') {
            setFiles([...newFields, '']);
        } else if (event.target.value === '' && index < files.length - 1) {
            newFields.splice(index, 1);
            setFiles(newFields);
        }
    }

    return <TranslationsProvider locale={translations.locale} namespaces={translations.i18nNamespaces} resources={translations.resources}>
        <Typography variant="h5" className={"typographyStyle"}>
            {translations.t("required_files")}
            <Tooltip title={
                <Typography variant="body1" className={"conditionsText"}>
                    {translations.t("required_files_info").split('\n').map((line: string, index: number) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </Typography>
            } placement={"right"}>
                <HelpOutlineIcon className={"conditionsHelp"}/>
            </Tooltip>
        </Typography>
        <Box className={"conditionsBox"}>
            {files.map((field, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    className={"conditionsSummation"}
                    value={field}
                    onChange={(event) => handleFieldChange(index, event)}
                    defaultValue={"/extra/verslag.pdf , *.py"}
                    size="small"
                />
            ))}
        </Box>
    </TranslationsProvider>;
}

export default RequiredFiles;