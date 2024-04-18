"use client"

import React, {useEffect, useState} from "react";
import {getProject, Project} from "@lib/api";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";

import "./project-details-styles.css";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DemoContainer, DemoItem} from "@mui/x-date-pickers/internals/demo";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import {TimeClock} from "@mui/x-date-pickers/TimeClock";
import ProjectSubmissionsList from "@app/[locale]/components/ProjectSubmissionsList";

interface ProjectDetailsPageProps {
    locale: any;
    project_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({locale, project_id}) => {
    const {t} = useTranslation();

    const [project, setProject] = useState<Project>();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);


    useEffect(() => {
        const fetchProject = async () => {
            try {
                setProject(await getProject(project_id));
            } catch (error) {
                console.error("There was an error fetching the project:", error);
            }
        };

        fetchProject().then(() => setLoadingProject(false));
    }, [project_id]);

    return (
        (!loadingProject && (
            <div>
                <Box
                    display="grid"
                    gridTemplateColumns="65% 35%"
                >
                    <Box className={"pageBoxLeft"}>
                        <Typography>
                            {project?.name}
                        </Typography>
                        <Typography>
                            {t('assignment')}
                        </Typography>
                        <Typography>
                            {project?.description}
                        </Typography>
                        <Typography>
                            <b>Max score: </b>{project?.max_score}
                        </Typography>
                        <Typography>
                            <b>Number of groups: </b>{project?.number_of_groups}
                        </Typography>
                        <Typography>
                            <b>Group size: </b>{project?.group_size}
                        </Typography>
                    </Box>
                    <Box className={"pageBoxRight"}>
                        <Grid display={"flex"}>
                            <Typography>
                                Visibility:
                            </Typography>
                            {
                                project?.visible ? (
                                    <VisibilityIcon/>
                                ) : (
                                    <VisibilityOffIcon/>
                                )
                            }
                        </Grid>
                        <Grid display={"flex"}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateCalendar', 'TimeClock']}>
                                    <DemoItem>
                                        <DateCalendar defaultValue={dayjs(project?.deadline)} readOnly/>
                                    </DemoItem>
                                    <DemoItem>
                                        <TimeClock defaultValue={dayjs(project?.deadline)} ampm={false} readOnly/>
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                    </Box>
                </Box>
                <ProjectSubmissionsList
                    project_id={project_id}
                    showActions={false}
                />
            </div>
        ))
    )
}

export default ProjectDetailsPage;