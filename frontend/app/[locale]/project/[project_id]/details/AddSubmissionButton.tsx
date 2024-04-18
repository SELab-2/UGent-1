"use client"
import React from "react";
import {useTranslation} from "react-i18next";
import "./project-details-styles.css";
import {PlusIcon} from "lucide-react";

interface AddSubmissionButtonProps {
    locale: any,
    project_id: number | undefined;
}

const AddSubmissionButton = (
    {locale, project_id}: AddSubmissionButtonProps,
) => {
    const {t} = useTranslation();


    const handleReturn = () => {
        window.location.href = `/${locale}/project/${project_id}/submit`
    }

    return (
        <button
            onClick={handleReturn}
            className={"addSubmissionButton"}
        >
            <PlusIcon/>
            {t("add_submission")}
        </button>
    )
}

export default AddSubmissionButton;