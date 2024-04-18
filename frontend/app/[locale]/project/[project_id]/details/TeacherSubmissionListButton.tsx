"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import "./project-details-styles.css";

interface TeacherSubmissionListButton {
    locale: any,
    project_id: number | undefined;
}

const TeacherSubmissionListButton = (
    {locale, project_id}: TeacherSubmissionListButton,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/project/${project_id}/submissions`
    }

    return (
        <button
            onClick={handleReturn}
            className={"editProjectButton"}
        >
            {t("all submissions")}
        </button>
    )
}

export default TeacherSubmissionListButton;