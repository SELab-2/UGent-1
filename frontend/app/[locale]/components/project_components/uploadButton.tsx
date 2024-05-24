import React from "react";
import JSZip, {JSZipObject} from "jszip";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';

interface UploadTestFileProps {
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void,
    testfilesData: JSZipObject[],
    setTestfilesData: (value: (((prevState: JSZipObject[]) => JSZipObject[]) | JSZipObject[])) => void,
}

function UploadTestFile(
    {
        testfilesName,
        setTestfilesName,
        testfilesData,
        setTestfilesData,
    }: UploadTestFileProps
) {
    const {t} = useTranslation();
    const handleFileChange = async (event: any) => {
        let zip = new JSZip();
        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const fileReader = new FileReader();
            fileReader.onload = function (e) {
                zip.file(file.name, e.target?.result as ArrayBuffer);
            };
            fileReader.readAsArrayBuffer(file);
        }

        const zipFileBlob = await zip.generateAsync({type: "blob"});
        zip = new JSZip();
        const zipData = await zip.loadAsync(zipFileBlob);
        const testfiles_name: string[] = [...testfilesName];
        const testfiles_data: JSZipObject[] = [...testfilesData];
        zipData.forEach((relativePath, file) => {
            testfiles_data.push(file);
            testfiles_name.push(relativePath);
        });
        setTestfilesName(testfiles_name);
        setTestfilesData(testfiles_data);
    }

    return(
        <div>
            {testfilesName.length === 0 && (
                <Typography variant={"h6"} color={"text.disabled"}>{t("no_test_files_selected")}</Typography>
                )}
            <input
                id="fileInput"
                type="file"
                className={"uploadInput"}
                onChange={handleFileChange}
            />
            <Button
                onClick={() => document.getElementById("fileInput")?.click()}
                className={"uploadButton"}
                variant={"contained"}
                color={'secondary'}
                startIcon={<UploadIcon/>}
                sx={{
                    width: 'fit-content',
                    color: 'secondary.contrastText',
                }}
            >
                {t("upload")}
            </Button>
        </div>
    );
}

export default UploadTestFile;