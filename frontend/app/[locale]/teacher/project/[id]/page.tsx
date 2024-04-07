"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    TextField
} from "@mui/material";
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
import JSZip, {JSZipObject} from "jszip";


const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function ProjectDetailPage({params: {locale, id}}: { params: { locale: any, id: any } }) {
    const [files, setFiles] = useState([null]);
    const [title, setTitle] = useState('Project 1');
    const [description, setDescription] = useState('Lorem\nIpsum\n');
    const [groupAmount, setGroupAmount] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [conditions, setConditions] = useState(['']);
    const [testfilesName, setTestfilesName] = useState([""]);
    const [visible, setVisible] = useState(true);
    const [deadline, setDeadline] = React.useState(dayjs());
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [courseId, setCourseId] = useState(0);
    const [testfilesData, setTestfilesData] = useState<JSZipObject[]>([]);

    const isTitleEmpty = !title
    const isAssignmentEmpty = !description
    const isScoreEmpty = !score
    const isGroupAmountEmpty = !groupAmount
    const isGroupSizeEmpty = !groupSize

    async function setTestFils(project: { [x: string]: string; }) {
        const zip = new JSZip();
        const test_files_zip = await axios.get(project["test_files"], {
            withCredentials: true,
            responseType: 'blob'
        });
        const zipData = await zip.loadAsync(test_files_zip.data);
        const testfiles_name: string[] = [];
        const testfiles_data: JSZipObject[] = [];
        zipData.forEach((relativePath, file) => {
            testfiles_data.push(file);
            testfiles_name.push(relativePath);
        });
        setTestfilesName(testfiles_name);
        setTestfilesData(testfiles_data);
    }

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(backend_url + "/projects/" + id + "/", {withCredentials: true});
                const project = response.data
                setDeadline(dayjs(project["deadline"]))
                setDescription(project.description)
                setFiles(project["file_structure"].split(",").map((item: string) => item.trim().replace(/"/g, '')))
                setGroupSize(project["group_size"])
                setTitle(project["name"])
                setGroupAmount(project["number_of_groups"])
                setVisible(project["visible"])
                await setTestFils(project);
                setScore(+project["max_score"]);
                setCourseId(+project["course_id"]);
                if (project["conditions"] != null) {
                    setConditions(project["conditions"].split(",").map((item: string) => item.trim().replace(/"/g, '')))
                }

                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
                // Optionally handle the error, e.g., by setting an error message
            }
        };

        fetchProject().then(() => console.log("Project fetched"));
    }, [id]);

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
        console.log(testfiles_data);
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

    const handleScoreChange = (event: any) => {
        if (event.target.value === '') {
            setScore(event.target.value);
        } else if (event.target.value < 1) {
            setScore(1);
        } else if (event.target.value > 100) {
            setScore(100);
        } else if (event.target.value < 100 || event.target.value >= 1) {
            setScore(event.target.value);
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

    const handleSave = async () => {
        let message = "The following fields are required:\n";

        if (isTitleEmpty) message += "- Title\n";
        if (isScoreEmpty) message += "- Score\n";
        if (isAssignmentEmpty) message += "- Assignment\n";
        if (isGroupAmountEmpty) message += "- Amount of groups\n";
        if (isGroupSizeEmpty) message += "- Group size\n";
        if (!deadline.isValid()) message += "- Deadline\n";

        if (isTitleEmpty || isScoreEmpty || isAssignmentEmpty || isGroupAmountEmpty
            || isGroupSizeEmpty || !deadline.isValid()) {
            alert(message);
            return;
        } else {
            const zip = new JSZip();
            testfilesData.forEach((file) => {
                zip.file(file.name, file.async("blob"));
            });

            const zipFileBlob = await zip.generateAsync({type: "blob"});
            const formData = new FormData();
            const zipFile = new File([zipFileBlob], "test_files.zip");
            formData.append("test_files", zipFile);
            formData.append("name", title);
            formData.append("description", description);
            formData.append("max_score", score.toString());
            formData.append("number_of_groups", groupAmount.toString());
            formData.append("group_size", groupSize.toString());
            formData.append("deadline", deadline.format());
            formData.append("file_structure", files.join(","));
            formData.append("conditions", conditions.join(","));
            formData.append("visible", visible.toString());
            formData.append("course_id", courseId.toString());

            axios.put(backend_url + "/projects/" + id + "/", formData
                , {withCredentials: true}).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const handle_remove = () => {
        axios.delete(backend_url + "/projects/" + id + "/", {withCredentials: true}).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    const required_files_info = `
        Here you can add the required files for the project.
        
        There are 2 options for adding files:
        1. Add a specific file: /extra/verslag.pdf
        - in this case the file verslag.pdf is required in the directory extra
        
        2. Add a file type: src/*.py
        - in this case the only file type allowed in the src directory will be python files
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
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Box
                        display="grid"
                        gridTemplateColumns="65% 35%"
                        height="100vh"
                    >
                        <Box sx={{marginTop: '20px', padding: '50px 50px 50px 100px'}}>

                            {/* Title */}
                            <Grid container spacing={1}>
                                <Grid item xs={6} style={{margin: '0'}}>
                                    <Typography variant="h5"
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Inter',
                                                    padding: '0',
                                                    margin: '0 0 5px 0'
                                                }}>
                                        {"Title"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h5"
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Inter',
                                                    padding: '0',
                                                    margin: '0 0 5px 0'
                                                }}>
                                        {"Maximale score"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        sx={{width: '100%', padding: '0', margin: '0'}}
                                        error={isTitleEmpty}
                                        onChange={(event) => setTitle(event.target.value)}
                                        value={title}
                                        helperText={isTitleEmpty ? "Title is required" : ""}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        variant="outlined"
                                        inputProps={{min: 1, max: 100}}
                                        value={score}
                                        onChange={handleScoreChange}
                                        style={{margin: '0px'}}
                                        sx={{width: '100%', padding: '0', margin: '0'}}
                                        size="small"
                                        error={isScoreEmpty}
                                        helperText={isScoreEmpty ? "Score is required" : ""}
                                    />
                                </Grid>
                            </Grid>

                            {/* assignment */}
                            <Typography variant="h5"
                                        style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
                                {"Assignment"}
                            </Typography>
                            <Box sx={{maxWidth: '100%'}}>
                                <TextField
                                    variant="outlined"
                                    multiline={true}
                                    error={isAssignmentEmpty}
                                    onChange={(event: any) => setDescription(event.target.value)}
                                    value={description}
                                    helperText={isAssignmentEmpty ? "Assignment is required" : ""}
                                    size="small"
                                />
                            </Box>

                            {/* Required Files */}
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

                            {/* Conditions */}
                            <Typography variant="h5"
                                        style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
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
                                        sx={{width: '100%', marginBottom: '10px'}}
                                        value={condition}
                                        onChange={(event) => handleConditionsChange(index, event)}
                                        margin={'normal'}
                                        size="small"
                                    />
                                ))}
                            </Box>

                            {/* Groups */}
                            <Typography variant="h5"
                                        style={{fontWeight: 'bold', fontFamily: 'Inter', margin: '5px 0 0 0'}}>
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
                                        error={isGroupAmountEmpty}
                                        helperText={isGroupAmountEmpty ? "Amount of groups is required" : ""}
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
                                        error={isGroupSizeEmpty}
                                        helperText={isGroupSizeEmpty ? "Group size is required" : ""}
                                    />
                                </Grid>
                            </Grid>

                            {/* Testfiles */}
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

                            {/* Upload Testfile */}
                            <input
                                id="fileInput"
                                type="file"
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => document.getElementById("fileInput")?.click()}
                                style={{
                                    backgroundColor: '#D0E4FF',
                                    padding: '15px 30px',
                                    marginBottom: '30px',
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
                                        onClick={handleSave}
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
                                        // TODO switch to correct URL
                                        onClick={() => window.location.href = "/home"}
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
                                        onClick={() => setConfirmRemove(true)}
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
                                    value={deadline}
                                    onChange={(event) => {
                                        setDeadline(event)
                                    }}
                                    minDate={dayjs()}/>
                                <TimePicker
                                    value={deadline}
                                    onChange={(event) => {
                                        if (event != null) setDeadline(event);
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    <Dialog open={confirmRemove} style={{padding: '10px'}}>
                        <Box textAlign={"center"}>
                            <DialogTitle>
                                Remove this project?
                            </DialogTitle>
                        </Box>
                        <DialogContent>
                            <Box textAlign={"center"} color={"grey"}>
                                This action cannot be undone
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Box textAlign={"center"} gap={2}>
                                <button
                                    onClick={handle_remove}
                                    style={{
                                        backgroundColor: '#D0E4FF',
                                        padding: '15px 30px',
                                        marginLeft: '15px',
                                        marginBottom: '15px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1.2em',
                                    }}
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => setConfirmRemove(false)}
                                    style={{
                                        backgroundColor: '#D0E4FF',
                                        padding: '15px 30px ',
                                        marginLeft: '30px',
                                        marginRight: '15px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1.2em',
                                    }}
                                >
                                    Cancel
                                </button>
                            </Box>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            <BottomBar/>
        </div>
    );
}

export default ProjectDetailPage;