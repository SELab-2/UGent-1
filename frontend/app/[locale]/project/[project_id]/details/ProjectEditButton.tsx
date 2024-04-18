"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import "./project-details-styles.css";

interface ProjectEditButtonProps {
    locale: any,
    project_id: number | undefined;
}

const ProjectEditButton = (
    {locale, project_id}: ProjectEditButtonProps,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/project/${project_id}/edit`
    }

    return (
        <button
            onClick={handleReturn}
            className={"editProjectButton"}
        >
            {t("edit_project")}
        </button>
    )
}

export default ProjectEditButton;