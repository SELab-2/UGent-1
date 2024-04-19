"use client"

import React, {useEffect, useState} from "react";
import {getProject, getUserData, Project, UserData} from "@lib/api";
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
import ProjectSubmissionsList from "@app/[locale]/components/ProjectSubmissionsList";
import {MultiSectionDigitalClock} from "@mui/x-date-pickers";
import CourseReturnButton from "@app/[locale]/project/[project_id]/details/CourseReturnButton";
import ProjectEditButton from "@app/[locale]/project/[project_id]/details/ProjectEditButton";
import ProjectGroupButton from "@app/[locale]/project/[project_id]/details/ProjectGroupButton";
import GroupSubmissionList from "@app/[locale]/components/GroupSubmissionList";
import AddSubmissionButton from "@app/[locale]/project/[project_id]/details/AddSubmissionButton";
import TeacherSubmissionListButton from "@app/[locale]/project/[project_id]/details/TeacherSubmissionListButton";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

interface ProjectDetailsPageProps {
    locale: any;
    project_id: number;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({locale, project_id}) => {
    const {t} = useTranslation();

    const [project, setProject] = useState<Project>();
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        fetchUser();
    }, [])

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
            <div className={"mainContainer"} style={{height: 'fit-content'}}>
                <Box sx={{marginTop: 4, marginBottom: 4}}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <CourseReturnButton
                                locale={locale}
                                course_id={project?.course_id}
                            />
                            <Grid container alignItems="center" sx={{marginBottom: 2}}>
                                <Typography variant={"h2"}>
                                    {project?.name}
                                </Typography>
                                {user?.role !== 3 && (
                                    <ProjectEditButton
                                        locale={locale}
                                        project_id={project_id}
                                    />
                                )}
                                <ProjectGroupButton
                                    locale={locale}
                                    project_id={project_id}
                                />
                            </Grid>
                            <Typography variant={"h4"}>
                                {t("assignment")}
                            </Typography>
                            <Typography sx={{marginBottom: 4}}>
                                {project?.description}
                            </Typography>
                            <Typography variant={"h5"}>
                                {t("required_files")}
                            </Typography>
                            <Typography sx={{marginBottom: 2}}>
                                {project?.file_structure}
                            </Typography>
                            <Typography variant={"h5"}>
                                {t("conditions")}
                            </Typography>
                            <Typography sx={{marginBottom: 2}}>
                                {project?.conditions}
                            </Typography>
                            {user?.role !== 3 && (
                                <div>
                                    <Typography variant={"h5"}>
                                        {t("test_files")}
                                    </Typography>
                                    <a href={`${backend_url}/projects/${project_id}/download_testfiles`}>
                                        <Typography sx={{marginBottom: 2}}>
                                            Download
                                        </Typography>
                                    </a>
                                </div>
                            )}
                            <Typography>
                                <b>Max score: </b>
                                {project?.max_score}
                            </Typography>
                            <Typography>
                                <b>Number of groups: </b>
                                {project?.number_of_groups}
                            </Typography>
                            <Typography>
                                <b>Group size: </b>
                                {project?.group_size}
                            </Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" sx={{marginBottom: 2}}>
                                <Typography>Visibility:</Typography>
                                {project?.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                            </Grid>
                            <Typography variant={"h4"} sx={{marginBottom: 2}}>
                                Deadline
                            </Typography>
                            <div style={{display: "flex"}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["DateCalendar", "TimeClock"]}>
                                        <DemoItem>
                                            <DateCalendar defaultValue={dayjs(project?.deadline)} readOnly/>
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["DateCalendar", "TimeClock"]}>
                                        <DemoItem>
                                            <MultiSectionDigitalClock defaultValue={dayjs(project?.deadline)} readOnly/>
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                {user?.role !== 3 ? (
                    <Box sx={{marginTop: 4, marginBottom: 4}}>
                        <div style={{display: "flex"}}>
                            <Typography variant={"h4"}>
                                {t("my_submissions")}
                            </Typography>
                            <AddSubmissionButton
                                locale={locale}
                                project_id={project_id}
                            />
                        </div>
                        <GroupSubmissionList
                            project_id={project_id}
                            showActions={false}
                            page_size={10}
                        />
                    </Box>
                ) : (
                    <Box sx={{marginTop: 4, marginBottom: 4}} className={"submissionContainer"}>
                        <div style={{display: "flex"}}>
                        <AddSubmissionButton
                            locale={locale}
                            project_id={project_id}
                        />
                        <TeacherSubmissionListButton
                            locale={locale}
                            project_id={project_id}
                        />
                        <Typography variant={"h4"} style={{ marginLeft: "8px" }}>
                            {t("submissions")}
                        </Typography>
                        </div>
                        <ProjectSubmissionsList
                            project_id={project_id}
                            showActions={false}
                            page_size={10}
                        />
                    </Box>
                )}
            </div>
        ))
    )
}

export default ProjectDetailsPage;