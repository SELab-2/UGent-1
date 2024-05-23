import Typography from "@mui/material/Typography";
import {Avatar, IconButton, Link, List, ListItem, ListItemAvatar} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import React from "react";
import JSZip from "jszip";
import {useTranslation} from "react-i18next";

interface TestFilesProps {
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void,
    testfilesData: JSZip.JSZipObject[],
    setTestfilesData: (value: (((prevState: JSZip.JSZipObject[]) => JSZip.JSZipObject[]) | JSZip.JSZipObject[])) => void,
}

function TestFiles({testfilesName, setTestfilesName, testfilesData, setTestfilesData}: TestFilesProps) {
    /*
    * This component displays the list of test files for a project.
    * It allows the user to delete test files.
    * @param testfilesName: The list of names of the test files
    * @param setTestfilesName: The function to set the list of names of the test files
    * @param testfilesData: The list of data of the test files
    * @param setTestfilesData: The function to set the list of data of the test files
    */
    const {t} = useTranslation();

    return <div>
        <Typography variant="h5" className={"typographyStyle"}>
            {t("test_files")}
        </Typography>
        <List dense={true}>
            {testfilesName.map((testfile, index) => (
                <ListItem
                    secondaryAction={
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                                const newTestfiles = [...testfilesName];
                                const newTestfilesData = [...testfilesData];
                                newTestfiles.splice(index, 1);
                                newTestfilesData.splice(index, 1);
                                setTestfilesName(newTestfiles);
                                setTestfilesData(newTestfilesData);
                            }}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    }
                    key={index}
                >
                    <ListItemAvatar>
                        <Avatar>
                            <DescriptionIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <Link href={"/home"}>
                        {testfile}
                    </Link>
                </ListItem>
            ))}
        </List>
    </div>;
}

export default TestFiles;