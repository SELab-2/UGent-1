"use client"

import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import EditCourseButton from "@app/[locale]/components/EditCourseButton";
import {APIError, Course, getCourse, UserData, getUserData} from "@lib/api";

interface CourseBannerProps {
    course_id: number;
}

const CourseBanner = ({course_id}: CourseBannerProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setCourse(await getCourse(course_id));
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchCourse();
    }, [course_id]);

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'whiteS',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                width: "calc(100% - 40px)",
                borderRadius: '16px',
                marginTop: 50,
                margin: "0 auto",
                paddingX: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            <Box
                textAlign="left"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
            >
                <Typography
                    variant="h1"
                    textAlign="left"
                    noWrap={true}
                    sx={{
                        color: 'white',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {course?.name}
                </Typography>
            </Box>
            {user?.role !== 1 ? (
                <Box
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start" // Align content at the top left horiz== 2 || user?.role === 3ontally
                    alignItems="flex-start"
                    textAlign="left"
                >
                    <EditCourseButton course_id={course_id}/>
                </Box>
            ): null}
        </Box>
    )
}

export default CourseBanner