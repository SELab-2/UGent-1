import React from 'react';
import {Grid} from '@mui/material';
import NavBar from '../components/NavBar';
import CourseCard from '../components/CourseCard';
import CourseControls from '../components/CourseControls';

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

const HomePage = () => {
    return (
        <>
            <NavBar/>
            <CourseControls />
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2} sx={{paddingTop: '100px'}}>
                {dummyData.map((course, index) => (
                    <CourseCard
                        key={index}
                        courseName={course.courseName}
                        teacherName={course.teacherName}
                        projects={course.projects}
                    />
                ))}
            </Grid>
        </>
    );
};

export default HomePage;
