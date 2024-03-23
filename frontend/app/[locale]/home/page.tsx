"use server";
import React from 'react';
import {Box, Container, Grid} from '@mui/material';
import NavBar from '../components/NavBar';
import CourseCard from '../components/CourseCard';
import CourseControls from '../components/CourseControls';
import initTranslations from "../../i18n";

const dummyData = [
    {
        courseName: 'Course 1',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 8},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 15}
        ]
    },
    {
        courseName: 'Course 2',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 21},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 3}
        ]
    },
    {
        courseName: 'Course 3',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 5},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 9}
        ]
    },
    {
        courseName: 'Course 4',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 26},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 45}
        ]
    },
    {
        courseName: 'Course 5',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 63},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 52}
        ]
    },
];

type HomePageProps = {
    params: {
        locale: string;
    };
};

async function HomePage({params: {locale}}: HomePageProps) {
    const {t} = await initTranslations(locale, ['common']);

    return (
        <>
            <NavBar/>
            <Box sx={{position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff'}}>
                <Container>
                    <CourseControls
                        locale={locale}
                    />
                </Container>
            </Box>
            <Container sx={{
                pt: 2,
                pb: 4,
                maxHeight: 'calc(100vh - 180px)',
                overflowY: 'auto'
            }}>
                <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                    {dummyData.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CourseCard
                                courseName={course.courseName}
                                teacherName={course.teacherName}
                                projects={course.projects}
                                t={t}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default HomePage;
