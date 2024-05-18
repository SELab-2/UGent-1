"use client"

import React, {useEffect, useState} from 'react';
import {Box, Typography, Skeleton} from "@mui/material";
import EditCourseButton from "@app/[locale]/components/EditCourseButton";
import {APIError, Course, getCourse, UserData, getUserData} from "@lib/api";
import defaultBanner from "../../../public/ugent_banner.png";

interface CourseBannerProps {
    course_id: number;
}

const CourseBanner = ({course_id}: CourseBannerProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const [loading, setLoading] = useState(true);
    const [courseBanner, setCourseBanner] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setCourse(await getCourse(course_id));
                setUser(await getUserData());
                setCourseBanner(course?.banner);
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
                    backgroundImage: `url(${defaultBanner.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: 'whiteS',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '150px',
                    borderRadius: '16px',
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
                        variant="h2"
                        textAlign="center"
                        noWrap={true}
                        padding={0}
                        sx={{
                            color: 'white',
                            height: 'fit-content',
                        }}
                    >
                        {course?.name + (course?.year === null ? "" : " " + course?.year)}
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
                    </Box>
                ): null}
            </Box>
        )
    )
}

export default CourseBanner