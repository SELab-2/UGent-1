"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getProjectFromSubmission, getSubmission, Project, Submission } from "@lib/api";
import { Button, Card, CardContent, Grid, LinearProgress, ThemeProvider, Divider, Typography } from "@mui/material";
import ProjectReturnButton from "@app/[locale]/components/ProjectReturnButton";
import { baseTheme } from "@styles/theme";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/CloudDownload";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];


interface ProjectDetailsPageProps {
    locale: any,
    submission_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ locale, submission_id }) => {
    const { t } = useTranslation();

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
        };

        const fetchProject = async () => {
            try {
                setProject(await getProjectFromSubmission(submission_id));
            } catch (error) {
                console.error("There was an error fetching the project data:", error);
            }
        };

        fetchSubmission().then(() => {
            fetchProject().then(() => setLoadingSubmission(false));
        });
    }, [submission_id]);

    if (loadingSubmission) {
        return <LinearProgress />;
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
    };

    function formatDate(isoString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const date = new Date(isoString);
        return date.toLocaleString(locale, options);
    }

    function checkDeadline(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        return now < deadlineDate ? 'success' : 'failure';
    }

    return (
        <ThemeProvider theme={baseTheme}>
            <Grid container alignItems="flex-start" justifyContent="flex-start" style={{ minHeight: '100vh', padding: 0 }}>
                <Grid item xs={12} style={{ position: 'absolute', top: 84, left: 20 }}>
                    <ProjectReturnButton locale={locale} project_id={project?.project_id} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Card raised style={{ width: 800 }}>
                        <CardContent>
                            <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                {`${t("submission")} #${submission?.submission_nr}`}
                            </Typography>
                            <Divider style={{ marginBottom: 64 }}/>
                            <Grid container spacing={3}>
                                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 2 }}>
                                        {`${t("evaluation")} status`}
                                    </Typography>
                                    <div style={{ display: "flex", alignItems: "flex-end", columnGap: "10px" }}>
                                        {submission?.output_test !== "" ? (
                                            <CheckIcon color="success" style={{ fontSize: 40 }}/>
                                        ) : (
                                            <CancelIcon color="error" style={{ fontSize: 40 }}/>
                                        )}
                                        <div>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                {submission?.output_test !== "" ? t("accepted") : t("denied")}
                                            </Typography>
                                            <Typography variant="caption">
                                                {`(${t("timestamp")}: ${formatDate(submission?.timestamp)})`}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 2 }}>
                                        {t("uploaded_files")}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        href={`${backend_url}/submissions/${submission_id}/download`}
                                        download
                                    >
                                        {t("download_file")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default ProjectDetailsPage;
