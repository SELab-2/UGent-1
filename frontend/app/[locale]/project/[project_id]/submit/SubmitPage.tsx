"use client"

import {useState, useEffect, useRef} from 'react';
import {useTranslation} from "react-i18next";
import {Box, Typography} from "@mui/material";
import AddButton from "@app/[locale]/components/AddButton";
import { Project, getProject } from '@lib/api';
import { uploadSubmissionFile } from "@lib/api";

import { use } from 'chai';

export default function SubmitPage({project_id}: { project_id: string }){
    const { t } = useTranslation();

    const [projectData, setProjectData] = useState<Project>()
    const [paths, setPaths] = useState<string[]>([]);

    
    function folderAdded(event : any){
        let newpaths = []
        for (const file of event.target.files) {
            let text = file.webkitRelativePath;
            newpaths.push(text);
        }
        setPaths(newpaths);
    }

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project: Project = await getProject(+project_id);
                setProjectData(project)
            } catch (e) {
                console.error(e)
            }
        }
        fetchProject();
    }, [project_id]);

    return (
        <Box sx={{marginTop: '64px', padding: 5}}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('submit_project')}: {projectData?.name}
                </Typography>
                <Typography variant="h6">
                    {projectData?.description}
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('files')}
                </Typography>
                

                <form onSubmit={uploadSubmissionFile} encType="multipart/form-data">

                    <input onChange={folderAdded} type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple />
                    
                    <input type="hidden" name="project_id" value={project_id}/>
                    
                    <ul id="listing"></ul>

                    <ul>
                        {paths.map(path => (
                        <li key={path}>{path}</li>
                        ))}
                    </ul>

                    <button type="submit">
                        <AddButton translationkey='submit_project' />
                    </button>
                </form>

            </Box>
    );
}