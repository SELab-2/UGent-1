"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import Link from "next/link";
import {addProject} from "@lib/api";

interface EditCourseButtonProps{
    course_id:number
}

const AddProjectButton = ({course_id}: EditCourseButtonProps) => {
    const {t} = useTranslation();

    return (
        <Button
            variant="contained"
            color="secondary"
            sx={{
                margin: '10px'
            }}
            onClick={async () => {
                const project_id = await addProject(course_id);
                window.location.href = `/project/${project_id}/edit`;
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    color: 'secondary.contrastText',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                }}
            >
                {t("add_project")}
            </Typography>
        </Button>
    )
}
export default AddProjectButton