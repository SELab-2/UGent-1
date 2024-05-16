"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCoursesForUser} from '@lib/api';
import { Grid } from '@mui/material';
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
            <Grid
                container
                justifyContent="center"
                justifyItems={'center'}
                spacing={2}
                sx={{
                    flexGrow: 1
                }}
            >
                {filteredCourses.map((course: Course, index) => (
                    <Grid
                        item={true}
                        key={index}
                        xs={10}
                        sm={5}

                    >
                        <CourseCard params={{course: course}}/>
                    </Grid>
                ))}
            </Grid>
    );
};

export default CoursesGrid;
