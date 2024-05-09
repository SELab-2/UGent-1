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
            href={`/course/${course_id}/add_project/`}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    color: 'secondary.contrastText',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    width: 'fit-content',
                }}
            >
                <Typography>
                    {t("add_project")}
                </Typography>
            </Typography>
        </Button>
    )
}
export default AddProjectButton