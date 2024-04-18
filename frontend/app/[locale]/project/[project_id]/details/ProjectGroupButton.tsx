"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import "./project-details-styles.css";

interface ProjectGroupButtonProps {
    locale: any,
    project_id: number | undefined;
}

const ProjectGroupButton = (
    {locale, project_id}: ProjectGroupButtonProps,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/project/${project_id}/groups`
    }

    return (
        <button
            onClick={handleReturn}
            className={"editProjectButton"}
        >
            {t("groups")}
        </button>
    )
}

export default ProjectGroupButton;