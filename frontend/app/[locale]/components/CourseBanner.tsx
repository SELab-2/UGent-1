"use client"

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Box, Typography} from "@mui/material";
import EditCourseButton from "@app/[locale]/components/EditCourseButton";
import {APIError, Course, getCourse} from "@lib/api";

interface CourseBannerProps {
    course_id: number;
}

const CourseBanner = ({course_id}: CourseBannerProps) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setCourse(await getCourse(course_id));
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchCourse();
    }, []);

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
                    sx={{
                        color: 'white',
                    }}
                >
                    {course?.name}
                </Typography>
            </Box>
            <Box
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start" // Align content at the top left horizontally
                alignItems="flex-start"
                textAlign="left"
            >
                <EditCourseButton />
            </Box>
        </Box>
    )
}

export default CourseBanner