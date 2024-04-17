"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";

const EditCourseButton = () => {
    const {t} = useTranslation();

    //TODO: add href to edit course page
    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
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
        </div>
    )
}

export default EditCourseButton