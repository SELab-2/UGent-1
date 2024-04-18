"use client"

import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import EditCourseButton from "@app/[locale]/components/EditCourseButton";
import {APIError, Course, getCourse, UserData, getUserData} from "@lib/api";
import AddProjectButton from "@app/[locale]/components/AddProjectButton";

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
                console.log(error);
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
                margin: "0 auto",
            }}
        >
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                width={"calc(100% - 200px)"}
                height={'100%'}
            >
                <Typography
                    variant="h1"
                    textAlign="center"
                    noWrap={true}
                    padding={0}
                    sx={{
                        color: 'white',
                        height: 'fit-content',
                    }}
                >
                    {course?.name}
                </Typography>
            </Box>
            {user?.role !== 3 ? (
                <Box
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    textAlign="left"
                    paddingY={2}
                >
                    <EditCourseButton course_id={course_id}/>
                    <AddProjectButton course_id={course_id}/>
                </Box>
            ): null}
        </Box>
    )
}

export default CourseBanner