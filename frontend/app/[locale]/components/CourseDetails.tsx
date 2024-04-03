'use client'

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {APIError, getCourse, Course} from "@lib/api";
import Typography from "@mui/material/Typography";

interface CourseDetailsProps {
    course_id: number;
}

export default function CourseDetails({course_id}: CourseDetailsProps) {
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
        <>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'medium',
                    marginTop: 2
                }}
            >
                {t('description')}
            </Typography>
            {course?.description !== undefined && course?.description !== null ? (
                <Typography variant="h6">
                    {course?.description}
                </Typography>
            ) : (
                <Typography
                    variant="h6"
                    sx= {{
                        color: 'text.disabled'
                    }}
                >
                    {t('no_description')}
                </Typography>
            )
            }
        </>
    );
}