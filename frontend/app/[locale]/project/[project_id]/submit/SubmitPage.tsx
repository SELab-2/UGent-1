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
    const [submitted, setSubmitted] = useState<string>("no");

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
                

                <form onSubmit={async (e)=>{setSubmitted(await uploadSubmissionFile(e));}} encType="multipart/form-data">

                    <input style={{width: "300px", height: "120px", backgroundColor: "lightgrey", border: "6px dotted black"}} type="file" id="filepicker" name="file"/>
                    
                    <input type="hidden" name="project_id" value={project_id}/>
                    <input type="hidden" name="mode" value="submitform"/>
                    
                    <ul id="listing"></ul>

                    <ul>
                        {paths.map(path => (
                        <li key={path}>{path}</li>
                        ))}
                    </ul>
                    {submitted === "yes" && <Typography variant="h6">{t('submitted')}</Typography>}
                    {submitted === "error" && <Typography variant="h6">{t('submission_error')}</Typography>}
                    {submitted !== "yes" && 
                        <button type='submit'
                        style={{
                            backgroundColor: '#1E64C8',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontFamily: 'Quicksand',
                            fontSize: '16px',
                            marginTop: '10px',
                            marginLeft: '15px'
                        }}>
                            <Typography variant="h6">{t("submit")}</Typography>
                        </button>
                    }
                </form>

            </Box>
    );
}