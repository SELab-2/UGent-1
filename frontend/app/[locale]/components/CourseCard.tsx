"use client";
import React, {useEffect, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CourseCardTheme} from '../../../styles/theme';
import {
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import {
    Course,
    getLastSubmissionFromProject,
    getProjectsFromCourse,
    Project,
    Submission,
    User
} from "@lib/api";
import {useTranslation} from "react-i18next";
import ListView from './ListView';

const CourseCard = ({params: {course}}: { params: { course: Course } }) => {
    const [teachers, setTeachers] = useState<User[]>([]);
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
            } catch (error) {
                console.log(error);
            }

        };

        const fetchTeachers = async () => {
            try {
                setTeachers(await getTeachersFromCourse(course.course_id));
            } catch (error) {
                console.log(error);
            }

        };

        fetchProjects();
    }, [course.course_id]);

    const headers = [t('name'), t('deadline'), t('view')]
    const headers_backend = ['name', 'deadline', 'view']


    return (
        <ThemeProvider theme={CourseCardTheme}>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        <a href={`/course/${course.course_id}`} style={{color: 'black'}}>
                            {course.name}
                        </a>
                    </Typography>
                    <Typography color="text.text" gutterBottom style={{whiteSpace: 'pre-line'}}>
                        {teachers.map((teacher: User) => teacher.first_name + " " + teacher.last_name).join('\n')}
                    </Typography>
                    <ListView
                        admin={false}
                        headers={headers}
                        headers_backend={headers_backend}
                        sortable={[true, true, false]}
                        get={'projects'}
                        get_id={course.course_id}
                        search={false}
                        page_size={3}
                    />
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};


export default CourseCard;
