"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar"
import Box from "@mui/material/Box";
import BottomBar from "../../../components/BottomBar";
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
import FinishButtons from './finishbuttons';
import Deadline from "@app/[locale]/teacher/project/[id]/deadline";
import RemoveDialog from './removedialog';
import initTranslations from '@app/i18n';
import './project_styles.css'
import {getProject, Project, getTestFiles, postData, putData, updateProject, deleteProject} from "@lib/api";


const i18nNamespaces = ['common']

function ProjectDetailPage({params: {locale, id}}: { params: { locale: any, id: any } }) {
    const [files, setFiles] = useState<string[]>([]);
    const [title, setTitle] = useState('Project 1');
    const [description, setDescription] = useState('Lorem\nIpsum\n');
    const [groupAmount, setGroupAmount] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [conditions, setConditions] = useState(['']);
    const [testfilesName, setTestfilesName] = useState([""]);
    const [visible, setVisible] = useState(true);
    const [deadline, setDeadline] = React.useState(dayjs());
    const [score, setScore] = useState(0);
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [courseId, setCourseId] = useState(0);
    const [testfilesData, setTestfilesData] = useState<JSZipObject[]>([]);
    const [translations, setTranslations] = useState({t: null, resources: null, locale: null, i18nNamespaces: [""]})

    const isTitleEmpty = !title
    const isAssignmentEmpty = !description
    const isScoreEmpty = !score
    const isGroupAmountEmpty = !groupAmount
    const isGroupSizeEmpty = !groupSize

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project: Project = await getProject(id);
                setDeadline(dayjs(project["deadline"]))
                setDescription(project.description)
                setFiles(project["file_structure"].split(",").map((item: string) => item.trim().replace(/"/g, '')))
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
    }, [id, locale, loadingTranslations]);

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

            await updateProject(id, formData).then((response) => console.log(response));
        }
    }

    const handle_remove = async () => {
        await deleteProject(id).then((response) => console.log(response));
        // TODO redirect
    }

    return (
        <div>
            {/*<NavBar/>*/}
            {(loadingTranslations && loadingProject) ? (
                <div>Loading...</div>
            ) : (
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
                            {TestFiles(testfilesName, setTestfilesName, translations)}
                            {UploadTestFile(testfilesName, setTestfilesName, testfilesData, setTestfilesData, translations)}
                        </Box>
                        <Box className={"pageBoxRight"}>
                            {FinishButtons(visible, setVisible, handleSave, setConfirmRemove, translations)}
                            {Deadline(deadline, setDeadline)}
                        </Box>
                    </Box>
                    {RemoveDialog(confirmRemove, handle_remove, setConfirmRemove, translations)}
                </div>
            )}
            <BottomBar/>
        </div>
    );
}

export default ProjectDetailPage;