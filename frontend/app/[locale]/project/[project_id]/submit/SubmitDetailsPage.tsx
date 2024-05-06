"use client"

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Grid, LinearProgress, ThemeProvider, Typography} from "@mui/material";
import {getProject, Project, uploadSubmissionFile} from '@lib/api';
import baseTheme from "@styles/theme";

interface SubmitDetailsPageProps {
    project_id: number;
}

const SubmitDetailsPage: React.FC<SubmitDetailsPageProps> = ({project_id}) => {
    const {t} = useTranslation();

    const [projectData, setProjectData] = useState<Project>()
    const [paths, setPaths] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<string>("no");
    const [loadingProject, setLoadingProject] = useState<boolean>(true);

    function folderAdded(event: any) {
        let newpaths: string[] = []
        for (const file of event.target.files) {
            let text: string = file.webkitRelativePath;
            if (text.includes("/")) {
                text = text.substring((text.indexOf("/") ?? 0) + 1, text.length);
            }
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
        fetchProject().then(() => setLoadingProject(false));
    }, [project_id]);

    if (loadingProject) {
        return <LinearProgress/>;
    }

    return (
        <ThemeProvider theme={baseTheme}>
            <Grid container alignItems="flex-start" justifyContent="flex-start" style={{ minHeight: '100vh', padding: 0 }}>
                <Grid item xs={12} style={{ position: 'absolute', top: 84, left: 20 }}>
                    
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


                <form onSubmit={async (e) => {
                    setSubmitted(await uploadSubmissionFile(e, project_id));
                }} encType="multipart/form-data">

                    <input
                        style={{
                            width: "300px",
                            height: "120px",
                            backgroundColor: "lightgrey",
                            border: "6px dotted black"
                        }}
                        onChange={folderAdded} type="file" id="filepicker" name="fileList" webkitdirectory="true"
                        multiple/>

                    <input type="hidden" name="project_id" value={project_id}/>

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

            </div>
        </ThemeProvider>
    );
}

export default SubmitDetailsPage;
