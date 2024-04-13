"use client";
import React, {useEffect, useState} from 'react';
import {APIError, getUserData, UserData} from '@lib/api';
import {Container, Grid} from '@mui/material';
import CourseCard from './CourseCard';

const CoursesGrid = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        const fetchCoursesAndUser = async () => {
            try {
                setUser(await getUserData());
                console.log(user.course);
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchCoursesAndUser();
    }, []);  // assuming locale might affect how courses are fetched, though not used directly here

    return (
        <Container sx={{pt: 2, pb: 4, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                {user.course.map((course_id, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CourseCard
                            courseId={course_id}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CoursesGrid;
