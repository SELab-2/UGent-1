"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./project-details-styles.css"

interface CourseReturnButtonProps {
    locale: any,
    course_id: number | undefined;
}

const CourseReturnButton = (
    {locale, course_id}: CourseReturnButtonProps,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/course/${course_id}`
    }

    return (
        <button
            onClick={handleReturn}
            className={"returnCourseButton"}
        >
            <ArrowBackIcon/>
            {t("return_course")}
        </button>
    )
}

export default CourseReturnButton;