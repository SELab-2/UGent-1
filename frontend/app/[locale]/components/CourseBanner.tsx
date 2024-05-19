"use client"

import React, {useEffect, useState} from 'react';
import {Box, Typography, Skeleton} from "@mui/material";
import EditCourseButton from "@app/[locale]/components/EditCourseButton";
import {APIError, Course, getCourse, UserData, getUserData} from "@lib/api";

interface CourseBannerProps {
    course_id: number;
}

const CourseBanner = ({course_id}: CourseBannerProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setCourse(await getCourse(course_id));
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.log(error);
            }
        };

        fetchCourse();
        setLoading(false);
    }, [course_id]);

    return (
        loading ? (
            <Skeleton
                variant="rounded"
                height={"200px"}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '16px',
                    margin: "0 auto",
                }}
            />
        ) : (
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: { xs: 'auto', sm: '150px' },
                    padding: 2,
                    borderRadius: '16px',
                    textAlign: 'center',
                }}
            >
                <Box
                    display="flex"
                    justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    alignItems="center"
                    width={{ xs: '100%', sm: "calc(100% - 200px)" }}
                    height={{ xs: 'auto', sm: '100%' }}
                    textAlign={{ xs: 'center', sm: 'left' }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'white',
                            height: 'fit-content',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {course?.name + (course?.year === null ? "" : " " + course?.year)}
                    </Typography>
                </Box>
                {user?.role !== 3 ? (
                    <Box
                        display="flex"
                        justifyContent={{ xs: 'center', sm: 'flex-start' }}
                        alignItems="center"
                        paddingY={{ xs: 1, sm: 0 }}
                        width={{ xs: '100%', sm: 'auto' }}
                    >
                        <EditCourseButton course_id={course_id} />
                    </Box>
                ) : null}
            </Box>
        )
    );
}

export default CourseBanner;
