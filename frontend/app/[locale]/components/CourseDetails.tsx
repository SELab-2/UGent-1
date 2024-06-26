'use client'

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {APIError, getCourse, Course, UserData, getUserData} from "@lib/api";
import { usePathname } from 'next/navigation'
import Typography from "@mui/material/Typography";
import CopyToClipboardButton from "@app/[locale]/components/CopyToClipboardButton";
import {Box} from "@mui/material";

interface CourseDetailsProps {
    course_id: number;
}

export default function CourseDetails({course_id}: CourseDetailsProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation();

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
            {user && user?.role !== 3 ? (
                <>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'medium',
                            marginTop: 2
                        }}
                    >
                        {t("access")}
                    </Typography>
                    <Typography
                        variant="h6"
                    >
                        {course?.open_course ? t("open_course") : t("private_course")}
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight={"bold"}
                    >
                        {"Invite link:"}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography
                            variant="h6"
                        >
                            {"https://sel2-1.ugent.be/course/" + course?.course_id + "?token=" + course?.invite_token}
                        </Typography>
                        <CopyToClipboardButton text={"https://sel2-1.ugent.be/course/" + course?.course_id + "?token=" + course?.invite_token}/>
                    </Box>
                </>
            ) : null
            }
        </>
    );
}