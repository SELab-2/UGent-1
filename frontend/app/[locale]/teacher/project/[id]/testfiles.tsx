import Typography from "@mui/material/Typography";
import {Avatar, IconButton, Link, List, ListItem, ListItemAvatar} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import React from "react";

function TestFiles(
    testfilesName: string[],
    setTestfilesName: (value: (((prevState: string[]) => string[]) | string[])) => void
) {
    return <>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {"Testfiles"}
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
                                newTestfiles.splice(index, 1);
                                setTestfilesName(newTestfiles);
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
    </>;
}

export default TestFiles;