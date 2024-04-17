"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Box from "@mui/material/Box";
import BottomBar from "../../../components/BottomBar";
import dayjs from "dayjs";
import JSZip, {JSZipObject} from "jszip";
import Title from '../../../components/project_components/title';
import Assignment from "../../../components/project_components/assignment";
import RequiredFiles from '../../../components/project_components/requiredFiles';
import Conditions from '../../../components/project_components/conditions';
import Groups from "../../../components/project_components/groups";
import TestFiles from '../../../components/project_components/testfiles';
import UploadTestFile from "../../../components/project_components/uploadButton";
import FinishButtons from '../../../components/project_components/finishbuttons';
import Deadline from "../../../components/project_components/deadline";
import RemoveDialog from '../../../components/project_components/removedialog';
import initTranslations from '../../../../i18n';
import './project_styles.css'
import {deleteProject, getProject, getTestFiles, getUserData, Project, updateProject} from "../../../../../lib/api";
import {any} from "prop-types";


const i18nNamespaces = ['common']

function ProjectDetailPage({params: {locale, project_id}}: { params: { locale: any, project_id: any } }) {
    const [files, setFiles] = useState<string[]>([]);
    const [title, setTitle] = useState('Project 1');
    const [description, setDescription] = useState('Lorem\nIpsum\n');
    const [groupAmount, setGroupAmount] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [conditions, setConditions] = useState(['']);
    const [testfilesName, setTestfilesName] = useState<string[]>([]);
    const [visible, setVisible] = useState(true);
    const [deadline, setDeadline] = React.useState(dayjs());
    const [score, setScore] = useState(0);
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [testfilesData, setTestfilesData] = useState<JSZipObject[]>([]);
    const [translations, setTranslations] = useState({t: any, resources: null, locale: null, i18nNamespaces: [""]})
    const [isStudent, setIsStudent] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [hasDeadline, setHasDeadline] = useState(false);
    const [course_id, setCourseId] = useState(0);

    const isTitleEmpty = !title
    const isAssignmentEmpty = !description
    const isScoreEmpty = !score
    const isGroupAmountEmpty = !groupAmount
    const isGroupSizeEmpty = !groupSize

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project: Project = await getProject(project_id);
                if (project.deadline !== null) setDeadline(dayjs(project["deadline"]));
                setDescription(project.description)
                if (project.file_structure !== null) {
                    const file_structure = project.file_structure.split(",").map((item: string) => item.trim().replace(/"/g, ''));
                    file_structure.push("");
                    setFiles(file_structure);
                }
                setGroupSize(project["group_size"])
                setTitle(project["name"])
                setGroupAmount(project["number_of_groups"])
                setVisible(project["visible"])
                setCourseId(project.course_id);
                if (project.test_files !== null) await setTestFiles(project);
                setScore(+project["max_score"]);
                if (project["conditions"] != null) {
                    const conditions_parsed = project["conditions"].split(",").map((item: string) => item.trim().replace(/"/g, ''));
                    conditions_parsed.push("");
                    setConditions(conditions_parsed);
                }
                if (project.deadline !== null) setHasDeadline(true);
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

        const fetchTranslations = async () => {
            const {t, resources} = await initTranslations(locale, i18nNamespaces)
            setTranslations({t, resources, locale, i18nNamespaces})
        }

        fetchTranslations().then(() => setLoadingTranslations(false));
        fetchProject().then(() => setLoadingProject(false));
    }, [project_id, locale, loadingTranslations, isStudent, loadingProject, isTeacher]);

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
            files.pop();
            conditions.pop();
            formData.append("test_files", zipFile);
            formData.append("name", title);
            formData.append("description", description);
            formData.append("max_score", score.toString());
            formData.append("number_of_groups", groupAmount.toString());
            formData.append("group_size", groupSize.toString());
            formData.append("file_structure", files.join(","));
            formData.append("conditions", conditions.join(","));
            formData.append("visible", visible.toString());
            formData.append("course_id", course_id.toString());
            if (hasDeadline) {
                formData.append("deadline", deadline.format());
            } else {
                formData.append("deadline", "");
            }

            await updateProject(project_id, formData).then((response) => console.log(response));
            location.reload();
        }
    }

    const handle_remove = async () => {
        await deleteProject(project_id).then((response) => console.log(response));
        window.location.href = "/course/" + course_id + "/"
    }

    return (
        <div>
            <NavBar/>
            {(loadingTranslations && loadingProject && loadingUser) ? (
                <div>Loading...</div>
            ) : (
                (!isStudent) ? (
                    <div>
                        <Box
                            display="grid"
                            gridTemplateColumns="65% 35%"
                            height="100vh"
                        >
                            <Box className={"pageBoxLeft"}>
                                <Title
                                    isTitleEmpty={isTitleEmpty}
                                    setTitle={setTitle}
                                    title={title}
                                    score={score}
                                    isScoreEmpty={isScoreEmpty}
                                    setScore={setScore}
                                    translations={translations}
                                />
                                <Assignment
                                    isAssignmentEmpty={isAssignmentEmpty}
                                    setDescription={setDescription}
                                    description={description}
                                    translations={translations}
                                />
                                <RequiredFiles
                                    files={files}
                                    setFiles={setFiles}
                                    translations={translations}
                                />
                                <Conditions
                                    conditions={conditions}
                                    setConditions={setConditions}
                                    translations={translations}
                                />
                                <Groups
                                    groupAmount={groupAmount}
                                    isGroupAmountEmpty={isGroupAmountEmpty}
                                    groupSize={groupSize}
                                    isGroupSizeEmpty={isGroupSizeEmpty}
                                    setGroupAmount={setGroupAmount}
                                    setGroupSize={setGroupSize}
                                    translations={translations}
                                />
                                <TestFiles
                                    setTestfilesData={setTestfilesData}
                                    setTestfilesName={setTestfilesName}
                                    testfilesData={testfilesData}
                                    testfilesName={testfilesName}
                                    translations={translations}
                                />
                                <UploadTestFile
                                    testfilesName={testfilesName}
                                    setTestfilesName={setTestfilesName}
                                    testfilesData={testfilesData}
                                    setTestfilesData={setTestfilesData}
                                    translations={translations}
                                />
                            </Box>
                            <Box className={"pageBoxRight"}>
                                <FinishButtons
                                    visible={visible}
                                    setVisible={setVisible}
                                    handleSave={handleSave}
                                    setConfirmRemove={setConfirmRemove}
                                    translations={translations}
                                    course_id={course_id}
                                    setHasDeadline={setHasDeadline}
                                    hasDeadline={hasDeadline}
                                />
                                <Deadline
                                    deadline={deadline}
                                    setDeadline={setDeadline}
                                    hasDeadline={hasDeadline}
                                />
                            </Box>
                        </Box>
                        <RemoveDialog
                            confirmRemove={confirmRemove}
                            handle_remove={handle_remove}
                            setConfirmRemove={setConfirmRemove}
                            translations={translations}
                        />
                    </div>
                ) : (
                    <div>Students cannot edit project</div>
                )

            )}
            <BottomBar/>
        </div>
    );
}

export default ProjectDetailPage;