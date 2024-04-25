import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {useTranslation} from "react-i18next";

interface RequiredFilesProps {
    files: any[],
    setFiles: (value: (((prevState: any[]) => any[]) | any[])) => void,
}

function RequiredFiles(
    {files, setFiles}: RequiredFilesProps
) {
    const {t} = useTranslation();
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

    return <div>
        <Typography variant="h5" className={"typographyStyle"}>
            {t("required_files")}
            <Tooltip title={
                <Typography variant="body1" className={"conditionsText"}>
                    {t("required_files_info").split('\n').map((line: string, index: number) => (
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
                    size="small"
                />
            ))}
        </Box>
    </div>;
}

export default RequiredFiles;