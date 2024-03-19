import React from 'react';
import {Grid} from '@mui/material';
import NavBar from '../components/NavBar'; // Adjust the import path as needed
import CourseCard from '../components/CourseCard';

const dummyData = [
    {
        courseName: 'Course 1',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 'x/y'},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 'x/y'}
        ]
    },
    {
        courseName: 'Course 2',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 'x/y'},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 'x/y'}
        ]
    },
    {
        courseName: 'Course 3',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 'x/y'},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 'x/y'}
        ]
    },
    {
        courseName: 'Course 4',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 'x/y'},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 'x/y'}
        ]
    },
    {
        courseName: 'Course 5',
        teacherName: 'Teacher Name',
        projects: [
            {name: 'Sample project 1', deadline: 'dd-mm-yyyy', submissions: 'x/y'},
            {name: 'Sample project 2', deadline: 'dd-mm-yyyy', submissions: 'x/y'}
        ]
    },
];

const HomePage = () => {
    return (
        <>
            <NavBar/>
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