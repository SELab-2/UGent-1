"use client";
import React, {useEffect, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CourseCardTheme} from '@styles/theme';
import {Card, CardContent, CardMedia, Typography, Box} from '@mui/material';
import {Course, getLastSubmissionFromProject, getProjectsFromCourse, Project, Submission,} from "@lib/api";
import {useTranslation} from "react-i18next";
import ListView from '@app/[locale]/components/ListView';

const CourseCard = ({params: {course}}: { params: { course: Course } }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [last_submission, setSubmission] =
        useState<Submission>({
            submission_id: 0,
            group_id: 0,
            submission_nr: 0,
            file: '',
            timestamp: '',
            output_test: '',
        });
    const [hover, setHover] = useState(false);

    const {t} = useTranslation()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjects(await getProjectsFromCourse(course.course_id));
                const fetched_submissions = new Map<number, Submission>();
                for (let i = 0; i < projects.length; i++) {
                    const project = projects[i];
                    setSubmission(await getLastSubmissionFromProject(project.project_id));
                    if (last_submission.group_id !== null) {
                        fetched_submissions.set(project.project_id, last_submission);
                    }
                }
            } catch (error) {
                console.log(error);
            }

        };

        fetchProjects();
    }, [course.course_id]);

    const headers = [t('name'), t('deadline'), t('view')]
    const headers_backend = ['name', 'deadline', 'view']


    return (
            <Card
                sx={{
                    width: 600,
                    height: 500,
                    margin: '16px',
                    borderRadius: '8px',
                    border: hover? 1 : 'none', // Conditional border
                    transition: 'border 0.1s ease-in-out',
                    borderColor: 'secondary.main',
                    boxShadow: hover? 4 : 1, // Conditional shadow
                }}
            >
                <CardMedia
                    sx={{
                        height: 75,
                        backgroundColor: 'secondary.main',
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <Box
                        display={'flex'}
                        justifyContent="flex-start"
                        alignItems="center"
                        height={'100%'}
                        width={'100%'}
                        onClick={() => window.location.href = `/course/${course.course_id}`}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            justifyContent={'center'}
                            margin={2}
                        >
                            {course.name}
                        </Typography>
                    </Box>
                </CardMedia>
                <CardContent>
                    <Typography
                        variant="h6"
                        component="div"
                        justifyContent={'center'}
                    >
                        {t('projects')}
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
    );
};


export default CourseCard;
