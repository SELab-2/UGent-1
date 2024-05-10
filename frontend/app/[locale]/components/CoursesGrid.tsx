"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCoursesForUser} from '@lib/api';
import {Container, Grid} from '@mui/material';
import CourseCard from '@app/[locale]/components/CourseCard';
import {useTranslation} from "react-i18next";

const CoursesGrid = ({selectedYear}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [error, setError] = useState<APIError | null>(null);

    const {t} = useTranslation()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCourses(await getCoursesForUser());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchCourses();
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
