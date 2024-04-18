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
    Project,
    Submission,
    User
} from "@lib/api";
import {useTranslation} from "react-i18next";

const options = {month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};

const CourseCard = ({params: {course}}: { params: { course: Course } }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [submissions, setSubmissions] = useState<Map<number, Submission>>(new Map());
    const {t} = useTranslation()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetched_projects: Project[] = await getProjectsFromCourse(course.course_id);
                setProjects(fetched_projects);
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchProjects();
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
                    <TableContainer>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('project')}</TableCell>
                                    <TableCell align="right">{t('deadline')}</TableCell>
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
