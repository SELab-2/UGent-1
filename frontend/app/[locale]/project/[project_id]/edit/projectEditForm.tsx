"use client"
import React, {useEffect, useState, useRef} from "react";
import dayjs from "dayjs";
import JSZip, {JSZipObject} from "jszip";
import {
    addProject,
    deleteProject,
    getProject,
    getTestFiles,
    fetchUserData,
    Project,
    updateProject,
    UserData
} from "@lib/api";
import Box from "@mui/material/Box";
import Title from "@app/[locale]/components/project_components/title";
import Assignment from "@app/[locale]/components/project_components/assignment";
import RequiredFiles from "@app/[locale]/components/project_components/requiredFiles";
import Conditions from "@app/[locale]/components/project_components/conditions";
import Groups from "@app/[locale]/components/project_components/groups";
import FinishButtons from "@app/[locale]/components/project_components/finishbuttons";
import Deadline from "@app/[locale]/components/project_components/deadline";
import RemoveDialog from "@app/[locale]/components/project_components/removedialog";
import {LinearProgress} from "@mui/material";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {Grid, TextField} from "@mui/material";



import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";


const i18nNamespaces = ['common']

interface ProjectEditFormProps {
    project_id: number | null;
    add_course_id: number;
}

function ProjectEditForm({project_id, add_course_id}: ProjectEditFormProps) {
    const [files, setFiles] = useState<string[]>([]);
    const [status_files, setStatusFiles] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [dockerImage, setDockerImage] = useState('');
    const [description, setDescription] = useState('');
    const [groupAmount, setGroupAmount] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [conditions, setConditions] = useState<string[]>([]);
    const [testfilesName, setTestfilesName] = useState<string[]>([]);
    const [visible, setVisible] = useState(true);
    const [deadline, setDeadline] = React.useState(dayjs());
    const [score, setScore] = useState(0);
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [testfilesData, setTestfilesData] = useState<JSZipObject[]>([]);
    const [isStudent, setIsStudent] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [hasDeadline, setHasDeadline] = useState(false);
    const [course_id, setCourseId] = useState<number>(0);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [accessDenied, setAccessDenied] = useState(true);

    const dockerfileref = useRef<HTMLInputElement>(null);

    const {t} = useTranslation();

    const isTitleEmpty = !title
    const isAssignmentEmpty = !description
    const isScoreEmpty = !score
    const isGroupAmountEmpty = !groupAmount
    const isGroupSizeEmpty = !groupSize


    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (project_id !== null) {
                    const project: Project = await getProject(project_id);
                    if (project.deadline !== null) setDeadline(dayjs(project["deadline"]));
                    setDescription(project.description)
                    if (project.file_structure !== null) {
                        const file_structure = project.file_structure.split(",").map((item: string) => item.trim().replace(/"/g, ''));
                        const file_structure_status = file_structure.map((item: string) => item[0]);
                        const file_structure_name = file_structure.map((item: string) => item.substring(1));
                        setFiles(file_structure_name);
                        setStatusFiles(file_structure_status);
                    }
                    setGroupSize(project["group_size"])
                    setTitle(project["name"])
                    setGroupAmount(project["number_of_groups"])
                    setVisible(project["visible"])
                    if (project.project_id !== null) {
                        setCourseId(project.course_id);
                    }
                    if (project.test_files !== null) await setTestFiles(project);
                    setScore(+project["max_score"]);
                    if (project["conditions"] != null) {
                        let conditions_parsed: string[] = [];
                        if (project["conditions"] !== "") {
                            conditions_parsed = project["conditions"].split(",").map((item: string) => item.trim().replace(/"/g, ''));
                        }
                        setConditions(conditions_parsed);
                    }
                    if (project.deadline !== null) setHasDeadline(true);
                }
                await fetchUserData().then((response) => {
                    if (response.role === 3) {
                        setIsStudent(true);
                    } else {
                        setIsTeacher(true);
                    }
                });
                if (!isStudent || !isTeacher) setLoadingUser(false);

            } catch (error) {
                console.error("There was an error fetching the project:", error);
            }
        };

        if (project_id !== null) {
            fetchProject().then(() => setLoadingProject(false));
        } else {
            setLoadingProject(false);
        }
    }, [project_id, loadingTranslations, isStudent, loadingProject, isTeacher]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await fetchUserData();
                setUser(user)
                if (!loadingUser && !loadingProject && user) {
                    if (project_id !== null) {
                        if (!user.course.includes(Number(course_id))) {
                            window.location.href = `/403/`;
                        } else {
                            setAccessDenied(false);
                        }
                    } else {
                        if (!user.course.includes(Number(add_course_id))) {
                            window.location.href = `/403/`;
                        } else {
                            setAccessDenied(false);
                        }
                    }
                }
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUser().then(() => setLoadingUser(false));
    }, [add_course_id, course_id, loadingProject, loadingUser, project_id]);



    async function setTestFiles(project: Project) {
        const zip = new JSZip();

        const test_files_zip = await getTestFiles(project.test_files);
        const zipData = await zip.loadAsync(test_files_zip);
        const testfiles_name: string[] = [];
        const testfiles_data: JSZipObject[] = [];
        zipData.forEach((relativePath, file) => {
            testfiles_data.push(file);
            testfiles_name.push(relativePath);
        });
        setTestfilesName(testfiles_name);
        setTestfilesData(testfiles_data);
    }

    const handleSave = async () => {
        console.log(files);
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
            const formData = new FormData();
            formData.append("test_docker_image", dockerImage);
            const zipFile = new File([zipFileBlob], "test_files.zip");

            const required_files = files.map((item, index) => status_files[index] + item);
            formData.append("test_files", zipFile);
            formData.append("name", title);
            formData.append("description", description);
            formData.append("max_score", score.toString());
            formData.append("number_of_groups", groupAmount.toString());
            formData.append("group_size", groupSize.toString());
            formData.append("file_structure", required_files.join(","));
            formData.append("conditions", conditions.join(","));
            formData.append("visible", visible.toString());
            if (add_course_id < 0) {
                formData.append("course_id", course_id.toString());
            } else {
                formData.append("course_id", add_course_id.toString());
            }
            if (hasDeadline) {
                formData.append("deadline", deadline.format());
            } else {
                formData.append("deadline", "");
            }

            if (project_id !== null) {
                await updateProject(project_id, formData);
                location.href = "/project/" + project_id + "/";
            } else {
                const new_project_id = await addProject(formData);
                location.href = "/project/" + new_project_id + "/"
            }
        }
    }

    const SubmitConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    Are you sure you want to submit this project?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
    

    const handle_remove = async () => {
        if (project_id !== null) {
            await deleteProject(project_id).then((response) => console.log(response));
        }
        window.location.href = "/course/" + course_id + "/"
    }

    if(loadingProject){
        return <LinearProgress/>;
    }

    return (
        (!isStudent) ? (
            !accessDenied &&
            <div>
                <Box
                    display="grid"
                    gridTemplateColumns="65% 35%"
                    height="fit-content"
                >
                    <Box className={"pageBoxLeft"} height={'fit-content'}>
                        <Title
                            isTitleEmpty={isTitleEmpty}
                            isScoreEmpty={isTitleEmpty}
                            setTitle={setTitle}
                            title={title}
                            score={score}
                            setScore={setScore}/>
                        <Assignment
                            isAssignmentEmpty={isAssignmentEmpty}
                            setDescription={setDescription}
                            description={description}/>
                        <RequiredFiles
                            files={files}
                            setFiles={setFiles}
                            file_status={status_files}
                            setFileStatus={setStatusFiles}
                        />
                        <Conditions
                            conditions={conditions}
                            setConditions={setConditions}/>
                        <Groups
                            groupAmount={groupAmount}
                            isGroupAmountEmpty={isGroupAmountEmpty}
                            groupSize={groupSize}
                            isGroupSizeEmpty={isGroupSizeEmpty}
                            setGroupAmount={setGroupAmount}
                            setGroupSize={setGroupSize}/>
                        
                        <Typography variant="h5" className={"typographyStyle"}>
                            {t("evaluation_docker_image")}
                            <Tooltip title={
                                <Typography variant="body1" className={"conditionsText"}>
                                    {t("evaluation_docker_image_tooltip")}
                                </Typography>
                            } placement={"right"}>
                                <HelpOutlineIcon className={"conditionsHelp"}/>
                            </Tooltip>
                        </Typography>
                        <TextField
                            variant="outlined"
                            onChange={(event) => setDockerImage(event.target.value)}
                            value={dockerImage}
                            className={"titleGrids"}
                            size="small"
                            placeholder="test-helloworld:latest"
                            label={t("evaluation_docker_image")}
                        />
                    </Box>
                    <Box className={"pageBoxRight"}>
                        <FinishButtons
                            visible={visible}
                            setVisible={setVisible}
                            handleSave={handleSave}
                            setConfirmRemove={setConfirmRemove}
                            course_id={add_course_id}
                            project_id={project_id}
                            setHasDeadline={setHasDeadline}
                            hasDeadline={hasDeadline}
                            createProject={(project_id === null)}/>
                        <Deadline
                            deadline={deadline}
                            setDeadline={setDeadline}
                            hasDeadline={hasDeadline}/>
                    </Box>
                </Box>
                <RemoveDialog
                    confirmRemove={confirmRemove}
                    handleRemove={handle_remove}
                    setConfirmRemove={setConfirmRemove}/>
            </div>
        ) : (
            <div>Students cannot edit project</div>
        )
    )
}

export default ProjectEditForm;