"use client";

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {getProjectFromSubmission, getSubmission, Project, Submission} from "@lib/api";
import {Button, Card, CardContent, Divider, Grid, LinearProgress, ThemeProvider, Typography} from "@mui/material";
import ProjectReturnButton from "@app/[locale]/components/ProjectReturnButton";
import {baseTheme} from "@styles/theme";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import CancelIcon from "@mui/icons-material/Cancel";

interface ProjectDetailsPageProps {
    locale: any;
    submission_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({locale, submission_id}) => {
    const {t} = useTranslation();
    const [submission, setSubmission] = useState<Submission>();
    const [project, setProject] = useState<Project>();
    const [loadingSubmission, setLoadingSubmission] = useState<boolean>(true);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setSubmission(await getSubmission(submission_id));
            } catch (error) {
                console.error("There was an error fetching the submission data:", error);
            }
        }

        const fetchProject = async () => {
            try {
                setProject(await getProjectFromSubmission(submission_id));
            } catch (error) {
                console.error("There was an error fetching the project data:", error);
            }
        }

        fetchSubmission().then(() => {
            fetchProject().then(() => setLoadingSubmission(false));
        });
    }, [submission_id])

    if (loadingSubmission) {
        return <LinearProgress/>;
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <ThemeProvider theme={baseTheme}>
            <Card raised>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ProjectReturnButton locale="en" project_id={submission?.group_id}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 'medium'}}>
                                {`${t("submission")} #${submission?.submission_nr}`}
                            </Typography>
                        </Grid>
                        <Divider light/>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {`${t("evaluation")} status`}
                            </Typography>
                            <div style={{ display: "flex", alignItems: "flex-end", columnGap: "10px" }}>
                                {submission?.output_test !== "" ? (
                                    <CheckIcon color="success" sx={{ fontSize: 40 }} />
                                ) : (
                                    <CancelIcon color="error" sx={{ fontSize: 40 }} />
                                )}
                                <div>
                                    <Typography variant="subtitle1">
                                        {submission?.output_test !== "" ? t("accepted") : t("denied")}
                                    </Typography>
                                    <Typography variant="caption">
                                        {`(${t("timestamp")}: ${formatTimestamp(submission?.timestamp)})`}
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold', color: 'primary.main'}}>
                                {t("uploaded_files")}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon/>}
                                href={`/submissions/${submission_id}/download`}
                                download
                            >
                                {t("download_file")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default ProjectDetailsPage;
