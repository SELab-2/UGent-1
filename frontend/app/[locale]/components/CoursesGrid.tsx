"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCoursesForUser} from '@lib/api';
import { Grid, Skeleton } from '@mui/material';
import CourseCard from '@app/[locale]/components/CourseCard';
import {useTranslation} from "react-i18next";

const CoursesGrid = ({selectedYear}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<APIError | null>(null);

    const {t} = useTranslation()

    const loadingArray = [1, 2, 3, 4, 5, 6];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCourses(await getCoursesForUser());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchCourses();
        setLoading(false);
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
                spacing={2}

                sx={{
                    paddingRight: 2,
                    paddingBottom: 2,
                    flexGrow: 1
                }}
            >
                {loading ? (
                    loadingArray.map((index) => (
                        <Grid
                            item={true}
                            key={index}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                        >
                            <Skeleton
                                variant="rounded"
                                sx={{
                                    height: 450,
                                    width: 600,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '16px',
                                    margin: "0 auto",
                                }}
                            />
                        </Grid>
                        ))
                ) : (
                    filteredCourses.map((course: Course, index) => (
                        <Grid
                            display={'flex'}
                            item
                            key={index}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            width={'100%'}
                            justifyContent={'center'}
                        >
                            <CourseCard params={{course: course}}/>
                        </Grid>
                    ))
                )}
            </Grid>
    );
};

export default CoursesGrid;
