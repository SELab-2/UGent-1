"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCourses, getUserData, UserData} from '@lib/api';
import {Container, Grid} from '@mui/material';
import CourseCard from './CourseCard';

const CoursesGrid = () => {
    const [user, setUser] = useState<UserData>({id: 0, emai: "", first_name: "", last_name: "", course: [], role: 3});
    const [error, setError] = useState<APIError | null>(null);
    const [courses, setCourses] = useState<Course[]>([]); // Initialize courses as an empty array

    useEffect(() => {
        const fetchCoursesAndUser = async () => {
            try {
                setUser(await getUserData());
                setCourses(await getCourses());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchCoursesAndUser();
    }, []);  // assuming locale might affect how courses are fetched, though not used directly here

    return (
        <Container sx={{pt: 2, pb: 4, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                {courses.map((course: Course, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CourseCard params={{course: course}}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CoursesGrid;
