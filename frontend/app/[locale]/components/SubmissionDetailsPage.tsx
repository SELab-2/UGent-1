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

interface SubmissionDetailsPageProps {
    locale: any,
    submission_id: number;
}

const SubmissionDetailsPage: React.FC<SubmissionDetailsPageProps> = ({ locale, submission_id }) => {
    const { t } = useTranslation();

    const [submission, setSubmission] = useState<Submission>();
    const [projectId, setProjectId] = useState<number>();
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
                setProjectId(await getProjectFromSubmission(submission_id));
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

    return (
        <ThemeProvider theme={baseTheme}>
            <Grid container justifyContent="center" alignItems="flex-start" style={{ width: '100%', padding: '20px' }}>
                <Grid item xs={12} style={{paddingBottom: '20px'}}>
                    <ProjectReturnButton locale={locale} project_id={projectId} />
                </Grid>
                <Grid item xs={12}>
                    <Card raised style={{ width: '100%' }}>
                        <CardContent>
                            <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                {`${t("submission")} #${submission?.submission_nr}`}
                            </Typography>
                            <Divider style={{ marginBottom: '20px' }}/>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                        {`${t("evaluation")} status`}
                                    </Typography>
                                    <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
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
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: 'primary.main', marginBottom: '10px' }}>
                                        {t("uploaded_files")}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        href={`${backend_url}/submissions/${submission_id}/download`}
                                        download
                                        size="small"
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

export default SubmissionDetailsPage;
