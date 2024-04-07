import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";

const required_files_info = `
    Here you can add the required files for the project.
    
    There are 2 options for adding files:
    1. Add a specific file: /extra/verslag.pdf
    - in this case the file verslag.pdf is required in the directory extra
    
    2. Add a file type: src/*.py
    - in this case the only file type allowed in the src directory will be python files
`

function RequiredFiles(
    files: any[],
    setFiles: (value: (((prevState: any[]) => any[]) | any[])) => void,
) {
    const handleFieldChange = (index: number, event: any) => {
        const newFields = [...files];
        newFields[index] = event.target.value;
        setFiles(newFields);

        if (index === files.length - 1 && event.target.value !== '') {
            // setFiles([...newFields, '']);
        } else if (event.target.value === '' && index < files.length - 1) {
            newFields.splice(index, 1);
            setFiles(newFields);
        }
    }

    return <>
        <Typography variant="h5"
                    style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
            {"Required Files"}
            <Tooltip title={
                <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                    {required_files_info.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </Typography>
            } placement={"right"}>
                <HelpOutlineIcon style={{fontSize: 'large', marginLeft: '5px'}}/>
            </Tooltip>
        </Typography>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',

        }}>
            {files.map((field, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    sx={{width: '100%'}}
                    value={field}
                    onChange={(event) => handleFieldChange(index, event)}
                    defaultValue={"/extra/verslag.pdf , *.py"}
                    size="small"
                />
            ))}
        </Box>
    </>;
}

export default RequiredFiles;