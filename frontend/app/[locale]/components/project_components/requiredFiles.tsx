"use client";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React, {useState} from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import RequiredFilesList from "@app/[locale]/components/general/RequiredFilesList";

interface RequiredFilesProps {
    files: any[],
    setFiles: (value: (((prevState: any[]) => any[]) | any[])) => void,
    file_status: any[],
    setFileStatus: (value: (((prevState: any[]) => any[]) | any[])) => void,
}

function RequiredFiles(
    {files, setFiles, file_status, setFileStatus}: RequiredFilesProps
) {
    const {t} = useTranslation();

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
            <RequiredFilesList
                items={files}
                setItems={setFiles}
                input_placeholder={t("new_file_example")}
                empty_list_placeholder={t("no_required_files")}
                button_text={t("add")}
                items_status={file_status}
                setItemsStatus={setFileStatus}
            />
        </Box>
    </div>;
}

export default RequiredFiles;