"use client";
import React, {useEffect, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CourseCardTheme} from '../../../styles/theme';
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    APIError,
    Course,
    getLastSubmissionFromProject,
    getProjectsFromCourse,
    getTeachersFromCourse,
    Project,
    Submission,
    User
} from "@lib/api";
import {useTranslation} from "react-i18next";

const options = {month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};

const CourseCard = ({params: {course}}: { params: { course: Course } }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [submissions, setSubmissions] = useState<Map<number, Submission>>(new Map());
    const {t} = useTranslation()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetched_projects: Project[] = await getProjectsFromCourse(course.course_id);
                const fetched_submissions = new Map<number, Submission>();
                for (let i = 0; i < fetched_projects.length; i++) {
                    const project = fetched_projects[i];
                    const last_submission = await getLastSubmissionFromProject(project.project_id);
                    if (last_submission.group_id !== null) {
                        fetched_submissions.set(project.project_id, last_submission);
                    }
                }
                setSubmissions(fetched_submissions);
                setProjects(fetched_projects);
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        const fetchTeachers = async () => {
            try {
                setTeachers(await getTeachersFromCourse(course.course_id));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchProjects();
        fetchTeachers();
    }, [course.course_id]);

    const convertDate = (date_str: string) => {
        let date = new Date(date_str);
        let date_local = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        return date_local.replace(" at", "").replace(",", "");
    }

    return (
        <ThemeProvider theme={CourseCardTheme}>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {course.name}
                    </Typography>
                    <Typography color="text.text" gutterBottom style={{whiteSpace: 'pre-line'}}>
                        {teachers.map((teacher: User) => teacher.first_name + " " + teacher.last_name).join('\n')}
                    </Typography>
                    <TableContainer>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('project')}</TableCell>
                                    <TableCell align="right">{t('deadline')}</TableCell>
                                    <TableCell align="right">{t('submissions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project: Project, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        style={{backgroundColor: new Date(project.deadline) < new Date() ? 'lightgrey' : 'inherit'}}
                                    >
                                        <TableCell component="th" scope="row">
                                            <a href={`/project/${project.project_id}`} style={{color: 'black'}}>
                                                {project['name']}
                                            </a>
                                        </TableCell>
                                        <TableCell align="right">
                                            {convertDate(project['deadline'])}
                                        </TableCell>
                                        <TableCell align="right">
                                            {submissions.has(project.project_id) ? (
                                                <a
                                                    href={`/submission/${submissions.get(project.project_id)?.submission_id}/`}
                                                    style={{color: '#1E64C8'}}
                                                >
                                                    {`#${submissions.get(project.project_id)?.submission_nr}`}
                                                </a>
                                            ) : ""}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};


export default CourseCard;
