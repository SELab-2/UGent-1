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
import {APIError, getProjectsFromCourse, getTeachersFromCourse, Project} from "@lib/api";

type CourseCardProps = {
    courseId: number;
    courseName: string;
};

const CourseCard: React.FC<CourseCardProps> = ({courseId, courseName}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [teachers, setTeachers] = useState<String[]>([]);
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjects(await getProjectsFromCourse(courseId));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchProjects();
    }, [courseId]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setTeachers(await getTeachersFromCourse(courseId));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchTeachers();
    }, [courseId]);

    return (
        <ThemeProvider theme={CourseCardTheme}>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {courseName}
                    </Typography>
                    <Typography color="text.text" gutterBottom style={{whiteSpace: 'pre-line'}}>
                        {teachers.join('\n')}
                    </Typography>
                    <TableContainer>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{"project"}</TableCell>
                                    <TableCell align="right">{"deadline"}</TableCell>
                                    <TableCell align="right">{"submissions"}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project: Project, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            {project['name']}
                                        </TableCell>
                                        <TableCell align="right">
                                            {project['deadline']}
                                        </TableCell>
                                        <TableCell align="right">
                                            {'x'}
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
