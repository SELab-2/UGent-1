"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Box from "@mui/material/Box";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton} from "@mui/material";
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
import Title from './title';
import Assignment from "./assignment";
import RequiredFiles from './requiredFiles';
import Conditions from './conditions';
import Groups from "./groups";
import TestFiles from './testfiles';
import UploadTestFile from "./uploadButton";


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

    async function setTestFiles(project: { [x: string]: string; }) {
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
                setFiles([...project["file_structure"].split(",").map((item: string) => item.trim().replace(/"/g, '')), ""])
                setGroupSize(project["group_size"])
                setTitle(project["name"])
                setGroupAmount(project["number_of_groups"])
                setVisible(project["visible"])
                await setTestFiles(project);
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
                            {Title(isTitleEmpty, setTitle, title, score, isScoreEmpty, setScore)}
                            {Assignment(isAssignmentEmpty, setDescription, description)}
                            {RequiredFiles(files, setFiles)}
                            {Conditions(conditions, setConditions)}
                            {Groups(groupAmount, isGroupAmountEmpty, groupSize, isGroupSizeEmpty, setGroupAmount, setGroupSize)}
                            {TestFiles(testfilesName, setTestfilesName)}
                            {UploadTestFile(testfilesName, setTestfilesName, testfilesData, setTestfilesData)}
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