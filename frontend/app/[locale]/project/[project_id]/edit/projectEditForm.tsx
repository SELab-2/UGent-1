"use client"
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import JSZip, {JSZipObject} from "jszip";
import {addProject, deleteProject, getProject, getTestFiles, getUserData, Project, updateProject} from "@lib/api";
import Box from "@mui/material/Box";
import Title from "@app/[locale]/components/project_components/title";
import Assignment from "@app/[locale]/components/project_components/assignment";
import RequiredFiles from "@app/[locale]/components/project_components/requiredFiles";
import Conditions from "@app/[locale]/components/project_components/conditions";
import Groups from "@app/[locale]/components/project_components/groups";
import TestFiles from "@app/[locale]/components/project_components/testfiles";
import UploadTestFile from "@app/[locale]/components/project_components/uploadButton";
import FinishButtons from "@app/[locale]/components/project_components/finishbuttons";
import Deadline from "@app/[locale]/components/project_components/deadline";
import RemoveDialog from "@app/[locale]/components/project_components/removedialog";

const i18nNamespaces = ['common']

interface ProjectEditFormProps {
    project_id: number|null;
    add_course_id: number;
}

function ProjectEditForm({project_id, add_course_id}: ProjectEditFormProps){
    const [files, setFiles] = useState<string[]>([]);
    const [title, setTitle] = useState('');
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
    const [hasDeadline, setHasDeadline] = useState(false);
    const [course_id, setCourseId] = useState<number>(0);

    const isTitleEmpty = !title
    const isAssignmentEmpty = !description
    const isScoreEmpty = !score
    const isGroupAmountEmpty = !groupAmount
    const isGroupSizeEmpty = !groupSize

    console.log(add_course_id);


    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (project_id !== null){
                    const project: Project = await getProject(project_id);
                    if (project.deadline !== null) setDeadline(dayjs(project["deadline"]));
                    setDescription(project.description)
                    if (project.file_structure !== null) {
                        const file_structure = project.file_structure.split(",").map((item: string) => item.trim().replace(/"/g, ''));
                        setFiles(file_structure);
                        console.log(files);
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
                        let conditions_parsed:string[] = [];
                        if (project["conditions"] !== "") {
                            conditions_parsed = project["conditions"].split(",").map((item: string) => item.trim().replace(/"/g, ''));
                        }
                        setConditions(conditions_parsed);
                    }
                    if (project.deadline !== null) setHasDeadline(true);
                }
                await getUserData().then((response) => {
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


    async function setTestFiles(project: Project) {
        const zip = new JSZip();
        console.log(project.test_files)
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
            formData.append("file_structure", files.join(","));
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

    const handle_remove = async () => {
        if (project_id !== null){
            await deleteProject(project_id).then((response) => console.log(response));
        }
        window.location.href = "/course/" + course_id + "/"
    }

    return (
         (loadingTranslations && loadingProject && loadingUser && course_id !==null) ? (
                <div>Loading...</div>
            ) : (
                (!isStudent) ? (
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
                                    description={description} />
                                <RequiredFiles
                                    files={files}
                                    setFiles={setFiles}/>
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
                                <TestFiles
                                    testfilesName={testfilesName}
                                    setTestfilesName={setTestfilesName}
                                    testfilesData={testfilesData}
                                    setTestfilesData={setTestfilesData}/>
                                <UploadTestFile
                                    testfilesName={testfilesName}
                                    setTestfilesName={setTestfilesName}
                                    testfilesData={testfilesData}
                                    setTestfilesData={setTestfilesData}/>
                            </Box>
                            <Box className={"pageBoxRight"}>
                                <FinishButtons 
                                    visible={visible} 
                                    setVisible={setVisible} 
                                    handleSave={handleSave} 
                                    setConfirmRemove={setConfirmRemove} 
                                    course_id={course_id} 
                                    setHasDeadline={setHasDeadline} 
                                    hasDeadline={hasDeadline}
                                    createProject={(project_id===null)}/>
                                <Deadline 
                                    deadline={deadline} 
                                    setDeadline={setDeadline} 
                                    hasDeadline={hasDeadline}/>
                            </Box>
                        </Box>
                        <RemoveDialog
                            confirmRemove={confirmRemove}
                            handle_remove={handle_remove}
                            setConfirmRemove={setConfirmRemove}/>
                    </div>
                ) : (
                    <div>Students cannot edit project</div>
                )
            )
    )
}

export default ProjectEditForm;