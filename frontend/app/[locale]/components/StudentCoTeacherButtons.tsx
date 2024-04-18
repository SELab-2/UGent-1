"use client"
import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {APIError, Course, getCourse} from "@lib/api";

interface StudentCoTeacherButtonsProps {
    course_id:number
}

const StudentCoTeacherButtons = ({course_id}: StudentCoTeacherButtonsProps) => {
    const {t} = useTranslation()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '100%',
                gap: 2,
                marginTop: 2,
            }}
        >
            <Button
                variant="contained"
                color='secondary'
                href={'/course/'+course_id+'/students'}
                sx={{
                    width: 'fit-content',
                    color: 'secondary.contrastText',
                }}
            >
                {t("view_students")}
            </Button>
            <Button
                variant="contained"
                color='secondary'
                href={'/course/'+course_id+'/teachers'}
                sx={{
                    width: 'fit-content',
                    color: 'secondary.contrastText',
                }}
            >
                {t("view_co_teachers")}
            </Button>
        </Box>
    );
}

export default StudentCoTeacherButtons