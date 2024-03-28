"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Avatar, Grid, IconButton, Link, List, ListItem, ListItemAvatar, TextField} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BottomBar from "../../../components/BottomBar";
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from 'axios';


const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function ProjectDetailPage({params: {locale, id}}: { params: { locale: any , id: number}}) {
    console.log(locale);
    console.log(id);
    const [fields, setFields] = useState(['']);
    const [title, setTitle] = useState('Project 1');
    const [assignement, setAssignement] = useState('Lorem\nIpsum\n');
    const [groupAmount, setGroupAmount] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [conditions, setConditions] = useState(['']);
    const [testfiles, setTestfiles] = useState(["Dockerfile",
        "Testfile"]);
    const [visible, setVisible] = useState(true);
    const [datetime, setDatetime] = React.useState(dayjs());

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(backend_url + "/courses", {withCredentials: true});
                if (response.data && Array.isArray(response.data.results)) {
                    console.log(response.data.results)
                } else {
                    console.error("Unexpected response structure:", response.data);
                    // Optionally handle unexpected structure
                }
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
                // Optionally handle the error, e.g., by setting an error message
            }
        };

        fetchProject();
    }, []);

    const handleFileChange = (event: any) => {
        const newFiles = [...testfiles];
        const parsed_filename = event.target.value.split("\\").pop();
        newFiles.push(parsed_filename);
        setTestfiles(newFiles);
    }

    const handleUpload = () => {
        document.getElementById("fileInput")?.click();
    }

    const handleTitleChange = (event: any) => {
        setTitle(event.target.value);
    };

    const handleAssignementChange = (event: any) => {
        setAssignement(event.target.value);
    }

    const handleGroupAmountChange = (event: any) => {
        if (event.target.value === '') {
            setGroupAmount(event.target.value);
        } else if (event.target.value < 1) {
            setGroupAmount(1);
        } else if (event.target.value > 1000) {
            setGroupAmount(1000);
        } else if (event.target.value < 1000 || event.target.value >= 1) {
            setGroupAmount(event.target.value);
        }
    }

    const handleGroupSizeChange = (event: any) => {
        if (event.target.value === '') {
            setGroupSize(event.target.value);
        } else if (event.target.value < 1) {
            setGroupSize(1);
        } else if (event.target.value > 20) {
            setGroupSize(20);
        } else if (event.target.value < 20 || event.target.value >= 1) {
            setGroupSize(event.target.value);
        }
    }

    const isTitleEmpty = !title
    const isAssignementEmpty = !assignement

    const handleFieldChange = (index: number, event: any) => {
        const newFields = [...fields];
        newFields[index] = event.target.value;
        setFields(newFields);

        if (index === fields.length - 1 && event.target.value !== '') {
            setFields([...newFields, '']);
        } else if (event.target.value === '' && index < fields.length - 1) {
            newFields.splice(index, 1);
            setFields(newFields);
        }
    }

    const handleConditionsChange = (index: number, event: any) => {
        const newConditions = [...conditions];
        newConditions[index] = event.target.value;
        setConditions(newConditions);

        if (index === conditions.length - 1 && event.target.value !== '') {
            setConditions([...newConditions, '']);
        } else if (event.target.value === '' && index < conditions.length - 1) {
            newConditions.splice(index, 1);
            setConditions(newConditions);
        }
    }

    const required_files_info = `
        Here you can add the required files for the project.
        
        There are 2 options for adding files:
        1. Add a specific file: /extra/verslag.pdf
        -> in this case the file verslag.pdf is required in the directory extra
        
        2. Add a file type: *.py
        -> in this case the only file type allowed will be python files
    `

    const group_info = `
        Here you can add the amount of groups and the group size.
        
        The amount of groups is the total amount of groups that will be created.
        The group size is the amount of students that will be in a group.
        
        If the group size is set to 1, the project will be individual and the amount of groups will be ignored.
    `

    const conditions_info = `
        Here you can add the conditions for the project.
        
        For example:
        - The program needs to compile
        - The program needs to run without errors
        - The program needs to be written in python
        - Execution time is less than 15 second
        - Use the MVC pattern
    `

    return (
        <div>
            <NavBar/>
            <Box
                display="grid"
                gridTemplateColumns="65% 35%"
                height="100vh"
            >
                <Box sx={{marginTop: '20px', padding: '50px 50px 50px 100px'}}>

                    {/* Title */}
                    <Typography variant="h5"
                                style={{fontWeight: 'bold', fontFamily: 'Inter', padding: '0', margin: '0 0 5px 0'}}>
                        {"Title"}
                    </Typography>
                    <TextField
                        variant="outlined"
                        sx={{width: '40%', padding: '0', margin: '0'}}
                        error={isTitleEmpty}
                        onChange={handleTitleChange}
                        value={title}
                        helperText={isTitleEmpty ? "Title is required" : ""}
                        size="small"
                    />

                    {/* assignment */}
                    <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
                        {"Assignment"}
                    </Typography>
                    <Box sx={{maxWidth: '60%'}}>
                        <TextField
                            variant="outlined"
                            multiline={true}
                            error={isAssignementEmpty}
                            onChange={handleAssignementChange}
                            value={assignement}
                            helperText={isAssignementEmpty ? "Assignment is required" : ""}
                            size="small"
                        />
                    </Box>

                    {/* Required Files */}
                    <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
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
                        {fields.map((field, index) => (
                            <TextField
                                key={index}
                                variant="outlined"
                                sx={{width: '40%'}}
                                value={field}
                                onChange={(event) => handleFieldChange(index, event)}
                                defaultValue={"/extra/verslag.pdf , *.py"}
                                size="small"
                            />
                        ))}
                    </Box>

                    {/* Conditions */}
                    <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
                        {"Conditions"}
                        <Tooltip title={
                            <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                                {conditions_info.split('\n').map((line, index) => (
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
                        {conditions.map((condition, index) => (
                            <TextField
                                key={index}
                                variant="outlined"
                                sx={{width: '40%', marginBottom: '10px'}}
                                value={condition}
                                onChange={(event) => handleConditionsChange(index, event)}
                                margin={'normal'}
                                size="small"
                            />
                        ))}
                    </Box>

                    {/* Groups */}
                    <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
                        {"Groups"}
                        <Tooltip title={
                            <Typography variant="body1" style={{fontFamily: 'Inter'}}>
                                {group_info.split('\n').map((line, index) => (
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
                    <Grid container spacing={1}>
                        <Grid item xs={6} style={{margin: '0'}}>
                            <Typography variant="body1" style={{margin: '0'}}>Amount of groups</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Group size</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                inputProps={{min: 1, max: 1000}}
                                value={groupAmount}
                                onChange={handleGroupAmountChange}
                                style={{margin: '0px'}}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                inputProps={{min: 1, max: 20}}
                                value={groupSize}
                                onChange={handleGroupSizeChange}
                                style={{margin: '0px'}}
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    {/* Testfiles */}
                    <Typography variant="h5" style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
                        {"Testfiles"}
                    </Typography>
                    <List dense={true}>
                        {testfiles.map((testfile, index) => (
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => {
                                            const newTestfiles = [...testfiles];
                                            newTestfiles.splice(index, 1);
                                            setTestfiles(newTestfiles);
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

                    {/* Upload Testfile */}
                    <input
                        id="fileInput"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => handleUpload()}
                        style={{
                            backgroundColor: '#D0E4FF',
                            padding: '15px 30px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                        }}
                    >
                        Upload
                    </button>
                </Box>
                <Box sx={{marginTop: '64px', padding: '50px 50px 50px 100px'}}>
                    <Grid container spacing={1} alignItems={"center"} justifyContent={"space-between"}>
                        <Grid display={"flex"}>
                            {
                                visible ? (
                                    <IconButton onClick={() => setVisible(!visible)}>
                                        <VisibilityIcon/>
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={() => setVisible(!visible)}>
                                        <VisibilityOffIcon/>
                                    </IconButton>
                                )
                            }
                        </Grid>
                        <Grid style={{padding: '10px'}}>
                            <button
                                onClick={() => console.log("clicked")}
                                style={{
                                    backgroundColor: '#D0E4FF',
                                    padding: '5px 30px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.2em',
                                }}
                            >
                                Save
                            </button>
                        </Grid>
                        <Grid style={{padding: '10px'}}>
                            <button
                                onClick={() => console.log("clicked")}
                                style={{
                                    backgroundColor: '#D0E4FF',
                                    padding: '5px 30px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.2em',
                                }}
                            >
                                Cancel
                            </button>
                        </Grid>
                        <Grid style={{padding: '10px'}}>
                            <button
                                onClick={() => console.log("clicked")}
                                style={{
                                    backgroundColor: '#E15E5E',
                                    padding: '5px 30px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.2em',
                                    color: 'white'
                                }}
                            >
                                Remove
                            </button>
                        </Grid>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={datetime}
                            onChange={(event) => setDatetime(event)}
                            minDate={dayjs()}/>
                        <TimePicker
                            value={datetime}
                            onChange={(event) => {
                                if (event != null) setDatetime(event);
                            }}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
            <BottomBar/>
        </div>
    );
}

export default ProjectDetailPage;