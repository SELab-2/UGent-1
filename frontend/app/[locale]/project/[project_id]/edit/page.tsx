"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Box from "@mui/material/Box";
import BottomBar from "../../../components/BottomBar";
import dayjs from "dayjs";
import JSZip, {JSZipObject} from "jszip";
import Title from './title';
import Assignment from "./assignment";
import RequiredFiles from './requiredFiles';
import Conditions from './conditions';
import Groups from "./groups";
import TestFiles from './testfiles';
import UploadTestFile from "./uploadButton";
import FinishButtons from './finishbuttons';
import Deadline from "@app/[locale]/home/course/[course_id]/project/[project_id]/edit/deadline";
import RemoveDialog from './removedialog';
import initTranslations from '@app/i18n';
import './project_styles.css'
import {getProject, Project, getTestFiles, updateProject, deleteProject, getUserData} from "@lib/api";
import {any} from "prop-types";


const i18nNamespaces = ['common']

function ProjectDetailPage({params: {locale, course_id, project_id}}: { params: { locale: any, course_id: any, project_id: any } }) {
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
        window.location.href = "home/course/" + course_id + "/"
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
                                {Title(isTitleEmpty, setTitle, title, score, isScoreEmpty, setScore, translations)}
                                {Assignment(isAssignmentEmpty, setDescription, description, translations)}
                                {RequiredFiles(files, setFiles, translations)}
                                {Conditions(conditions, setConditions, translations)}
                                {Groups(groupAmount, isGroupAmountEmpty, groupSize, isGroupSizeEmpty, setGroupAmount, setGroupSize, translations)}
                                {TestFiles(testfilesName, setTestfilesName, testfilesData, setTestfilesData, translations)}
                                {UploadTestFile(testfilesName, setTestfilesName, testfilesData, setTestfilesData, translations)}
                            </Box>
                            <Box className={"pageBoxRight"}>
                                {FinishButtons(visible, setVisible, handleSave, setConfirmRemove, translations, course_id, setHasDeadline, hasDeadline)}
                                {Deadline(deadline, setDeadline, hasDeadline)}
                            </Box>
                        </Box>
                        {RemoveDialog(confirmRemove, handle_remove, setConfirmRemove, translations)}
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