"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import Link from "next/link";

interface EditCourseButtonProps{
    course_id:number
}

const EditCourseButton = ({course_id}: EditCourseButtonProps) => {
    const {t} = useTranslation();

    return (
        <Link
        href={'/home/course/' + course_id + '/edit'}
        >
            <Button
                variant="contained"
                color="secondary"
                href={""}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: 'secondary.contrastText',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {t("edit_course")}
                </Typography>
            </Button>
        </Link>
    )
}

export default EditCourseButton