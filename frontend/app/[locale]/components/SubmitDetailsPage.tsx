"use client"

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Input,
    LinearProgress,
    ThemeProvider,
    Typography
} from "@mui/material";
import {getProject, Project, uploadSubmissionFile} from '@lib/api';
import baseTheme from "@styles/theme";
import ProjectReturnButton from "@app/[locale]/components/ProjectReturnButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Tree from "@app/[locale]/components/Tree";

interface SubmitDetailsPageProps {
    locale: any;
    project_id: number;
}

const SubmitDetailsPage: React.FC<SubmitDetailsPageProps> = ({locale, project_id}) => {
    const {t} = useTranslation();

    const [projectData, setProjectData] = useState<Project>()
    const [paths, setPaths] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<string>("no");
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const previewLength = 300;

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    }

    const handleSubmit = async (e) => {
        setSubmitted(await uploadSubmissionFile(e, project_id));
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

    return (
        <ThemeProvider theme={baseTheme}>
            <Grid container alignItems="flex-start" style={{ padding: 0 }}>
                <Grid item xs="auto" style={{ marginLeft: 10, marginTop: 10, marginRight: 'auto' }}>
                    <ProjectReturnButton locale={locale} project_id={projectData?.project_id}/>
                </Grid>
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <Card raised style={{width: 800}}>
                        <CardContent>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'medium'
                                }}
                            >
                                {projectData?.name}
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
                                    sx={{flex: '0 0 auto', padding: 0}}
                                >
                                    {isExpanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            )}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    marginTop: 2
                                }}
                            >
                                {t('files')}
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
                                <Input
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: baseTheme.palette.primary.main,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        marginTop: 1,
                                        p: 4,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: baseTheme.palette.background.default,
                                        },
                                    }}
                                    onChange={folderAdded}
                                    type="file"
                                    id="filepicker"
                                    name="fileList"
                                    inputProps={{webkitdirectory: 'true', multiple: true}}
                                />

                                <Tree paths={paths}/>

                                {submitted === 'yes' && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: baseTheme.palette.success.main,
                                        mb: 1
                                    }}>
                                        <CheckCircleIcon sx={{mr: 1}}/>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', fontSize: '0.875rem'}}>
                                            {t('submitted')}
                                        </Typography>
                                    </Box>
                                )}
                                {submitted === 'error' && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: baseTheme.palette.failure.main,
                                        mb: 1
                                    }}>
                                        <ErrorIcon sx={{mr: 1}}/>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', fontSize: '0.875rem'}}>
                                            {t('submission_error')}
                                        </Typography>
                                    </Box>
                                )}
                                {submitted !== 'yes' && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PublishIcon/>}
                                        type="submit"
                                    >
                                        {t('submit')}
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default SubmitDetailsPage;
