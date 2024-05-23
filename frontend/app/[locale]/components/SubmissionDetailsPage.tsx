"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getProjectFromSubmission, getSubmission, Project, Submission } from "@lib/api";
import { Button, Card, CardContent, Grid, LinearProgress, ThemeProvider, Divider, Typography, Paper } from "@mui/material";
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
    /*
    * This component displays the submission details page.
    * It shows the evaluation status of the submission, the uploaded files and the artifacts.
    * @param locale: The locale used for the translation
    * @param submission_id: The id of the submission
    */
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
            <Grid container direction={'column'} justifyContent="flex-start" alignItems="stretch" style={{ padding: '20px', width: '100%'}}>
                <Grid item style={{paddingBottom: '20px', width: '100%'}}>
                    <ProjectReturnButton locale={locale} project_id={projectId} />
                </Grid>
                <Grid item>
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
                                        {(submission?.output_simple_test && submission?.eval_result) ? (
                                            <CheckIcon color="success" style={{ fontSize: 40 }}/>
                                        ) : (
                                            <CancelIcon color="error" style={{ fontSize: 40 }}/>
                                        )}
                                        <div>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                {(submission?.output_simple_test && submission?.eval_result) ? t("accepted") : t("denied")}
                                            </Typography>
                                            <Typography variant="caption">
                                                {`(${t("timestamp")}: ${formatDate(submission?.timestamp ?? "")})`}
                                            </Typography>

                                                {submission?.output_simple_test ? (
                                                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                        {t("simple_tests_ok")}
                                                    </Typography>
                                                ):(
                                                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                        {t("simple_tests_failed")}
                                                    </Typography>
                                                )}
                                                {
                                                    !submission?.output_simple_test ? (
                                                        <>
                                                            <Divider style={{ marginBottom: '20px', marginTop: '20px' }}/>

                                                            {submission?.feedback_simple_test?.["0"].length > 0 ? (
                                                                <>
                                                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                                        {t("feedback_simple_test_0")}
                                                                    </Typography>
                                                                    {submission?.feedback_simple_test["0"].map((feedback, index) => (
                                                                        <Typography key={index} variant="body1" style={{ marginBottom: '10px' }}>
                                                                            {feedback}
                                                                        </Typography>
                                                                    ))}
                                                                </>
                                                            ) : null}

                                                            {submission?.feedback_simple_test?.["2"].length > 0 ? (
                                                                <>
                                                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                                        {t("feedback_simple_test_2")}
                                                                    </Typography>
                                                                    {submission?.feedback_simple_test["2"].map((feedback, index) => (
                                                                        <Typography key={index} variant="body1" style={{ marginBottom: '10px' }}>
                                                                            {feedback}
                                                                        </Typography>
                                                                    ))}
                                                                </>
                                                            ) : null}
                                                        </>
                                                    ) : null
                                                }
                                                <Paper style={{ padding: '10px', marginTop: '10px' }}>
                                                    {submission?.eval_result ? (
                                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                            {t("advanced_tests_ok")}
                                                        </Typography>
                                                    ):(
                                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                            {t("advanced_tests_failed")}
                                                        </Typography>
                                                    )}
                                                    {
                                                        submission?.eval_output ? (
                                                                <Typography variant="body1">
                                                                    {submission?.eval_output}
                                                                    </Typography>
                                                        ) : null
                                                    }
                                                </Paper>
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
                                        href={`${backend_url}/submissions_${submission_id}`}
                                        download
                                        size="small"
                                    >
                                        {t("download_file")}
                                    </Button>
                                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: 'primary.main', marginBottom: '10px', marginTop: '40px' }}>
                                        {t("artifacts")}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        href={`${backend_url}/submissions_${submission_id}_artifacts`}
                                        download
                                        size="small"
                                    >
                                        {t("download_artifacts")}
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
