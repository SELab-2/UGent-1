import Typography from "@mui/material/Typography";
import {Avatar, IconButton, Link, List, ListItem, ListItemAvatar} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import React from "react";
import JSZip from "jszip";

interface TestFilesProps {
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void,
    testfilesData: JSZip.JSZipObject[],
    setTestfilesData: (value: (((prevState: JSZip.JSZipObject[]) => JSZip.JSZipObject[]) | JSZip.JSZipObject[])) => void,
    translations: {
        t: any;
        resources: any;
        locale: any;
        i18nNamespaces: string[]
    }
}

function TestFiles({testfilesName, setTestfilesName, testfilesData, setTestfilesData, translations}: TestFilesProps) {
    return <div>
        <Typography variant="h5" className={"typographyStyle"}>
            {translations.t("test_files")}
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