"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCoursesForUser, getUserData, UserData} from '@lib/api';
import {Container, Grid} from '@mui/material';
import CourseCard from './CourseCard';

const CoursesGrid = ({selectedYear}) => {
    const [user, setUser] = useState<UserData>({id: 0, emai: "", first_name: "", last_name: "", course: [], role: 3});
    const [error, setError] = useState<APIError | null>(null);
    const [courses, setCourses] = useState<Course[]>([]); // Initialize courses as an empty array
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCoursesAndUser = async () => {
            try {
                setUser(await getUserData());
                setCourses(await getCoursesForUser());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchCoursesAndUser();
    }, []);

    useEffect(() => {
        const [startYear, endYearSuffix] = selectedYear.split('-');
        const startYearNumber = parseInt(startYear, 10);
        const endYearNumber = parseInt(startYear.slice(0, 2) + endYearSuffix, 10);

        const filtered = courses.filter(course => {
            return course.year === startYearNumber || course.year === endYearNumber;
        });

        setFilteredCourses(filtered);
    }, [selectedYear, courses]);

    return (
        <Container sx={{pt: 2, pb: 4, maxHeight: 'calc(150vh - 260px)', overflowY: 'auto'}}>
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                {filteredCourses.map((course: Course, index) => (
                    <Grid md={6} item={true} key={index}>
                        <CourseCard params={{course: course}}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CoursesGrid;
