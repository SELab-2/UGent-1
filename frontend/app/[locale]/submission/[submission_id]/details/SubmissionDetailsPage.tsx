"use client"

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {getProjectFromSubmission, getSubmission, Project, Submission} from "@lib/api";
import Typography from "@mui/material/Typography";

import "./submission-details-styles.css"
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import {red} from "@mui/material/colors";
import ProjectReturnButton from "@app/[locale]/project/[project_id]/submissions/ProjectReturnButton";


const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

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

    return (
        (!loadingSubmission && (
            <div className={"mainContainer"}>
                <ProjectReturnButton
                    locale={locale}
                    project_id={project?.project_id}
                />
                <Typography variant={"h3"} sx={{marginBottom: 2}}>
                    {`${t('submission')} #${submission?.submission_nr}`}
                </Typography>
                <Typography sx={{marginBottom: 2}}>
                    <b>{`${t("timestamp")}: `}</b>
                    {submission?.timestamp}
                </Typography>
                <Typography variant={"h4"}>
                    {t("assignment")}
                </Typography>
                <Typography sx={{marginBottom: 4}}>
                    {project?.description}
                </Typography>
                <Typography variant={"h4"}>
                    {t("uploaded_files")}
                </Typography>
                <Typography sx={{marginBottom: 4}}>
                    <a href={`${backend_url}/submissions/${submission_id}/download`}>
                        Download
                    </a>
                </Typography>
                <Typography variant={"h4"}>
                    {`${t("evaluation")} status`}
                </Typography>
                {submission?.output_test !== undefined ? (
                    <Typography>
                        <CheckIcon color={"success"}/>
                        {t('accepted')}
                    </Typography>
                ) : (
                    <Typography>
                        <CancelIcon sx={{color: red}}/>
                        {t('denied')}
                    </Typography>
                )}
            </div>
        ))
    )
}

export default ProjectDetailsPage;