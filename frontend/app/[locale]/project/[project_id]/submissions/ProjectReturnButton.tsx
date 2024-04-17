"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ProjectReturnButtonProps {
    locale: any,
    project_id: number;
}

const ProjectReturnButton = (
    {locale, project_id}: ProjectReturnButtonProps,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/project/${project_id}`
    }

    return (
        <button
            onClick={handleReturn}
            className={"returnProjectButton"}
        >
            <ArrowBackIcon/>
            {t("return_project")}
        </button>
    )
}

export default ProjectReturnButton;