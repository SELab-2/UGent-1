"use client"

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Grid, Button, Divider, Card, IconButton, CardContent, LinearProgress, ThemeProvider, Typography} from "@mui/material";
import {getProject, Project, uploadSubmissionFile} from '@lib/api';
import baseTheme from "@styles/theme";
import ProjectReturnButton from "@app/[locale]/components/ProjectReturnButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PublishIcon from '@mui/icons-material/Publish';

interface SubmitDetailsPageProps {
    project_id: number;
}

const SubmitDetailsPage: React.FC<SubmitDetailsPageProps> = ({project_id}) => {
    const {t} = useTranslation();

    const [projectData, setProjectData] = useState<Project>()
    const [paths, setPaths] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<string>("no");
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const previewLength = 300;

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

    if (loadingProject) {
        return <LinearProgress/>;
    }

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <ThemeProvider theme={baseTheme}>
            <Grid container alignItems="flex-start" justifyContent="flex-start"
                  style={{minHeight: '100vh', padding: 0}}>
                <Grid item xs={12} style={{position: 'absolute', top: 84, left: 20}}>
                    <ProjectReturnButton locale="en" project_id={projectData?.project_id}/>
                </Grid>
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', paddingTop: 20}}>
                    <Card raised style={{width: 1000}}>
                        <CardContent>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'medium'
                                }}
                            >
                                {t('submit_project')}: {projectData?.name}
                            </Typography>
                            <Divider style={{marginBottom: 10, marginTop: 10}}/>
                            <Typography>
                                {projectData?.description && projectData?.description.length > previewLength && !isExpanded
                                    ? `${projectData?.description.substring(0, previewLength)}...`
                                    : projectData?.description
                                }
                            </Typography>
                            {projectData?.description && projectData?.description.length > previewLength && (
                                <IconButton
                                    color="primary"
                                    onClick={toggleDescription}
                                    sx={{ flex: '0 0 auto', padding: 0 }}
                                >
                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            )}
                            <Typography
                                variant="h4"
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
                                    onChange={folderAdded} type="file" id="filepicker" name="fileList"
                                    webkitdirectory="true"
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PublishIcon/>}
                                        type="submit"
                                    >
                                        {t("submit")}
                                    </Button>
                                }
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default SubmitDetailsPage;
