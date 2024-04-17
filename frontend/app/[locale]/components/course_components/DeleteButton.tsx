'use client';

import React from 'react'
import {useTranslation} from "react-i18next";
import {deleteCourse} from "@lib/api";
import {Button} from '@mui/material';


interface EditCourseFormProps {
    courseId: number
}

const DeleteButton = ({courseId}: EditCourseFormProps) => {
    const {t} = useTranslation()

    const handleDelete = async () => {
        await deleteCourse(courseId)
        window.location.href = "/home";
    }

    return (
        <Button
            ariant='contained'
            color='failure'
            onClick={handleDelete}
            sx={{
                width: 'fit-content',
                color: 'white',
            }}
        >
            {t("delete course")}
        </Button>
    )
}

export default DeleteButton