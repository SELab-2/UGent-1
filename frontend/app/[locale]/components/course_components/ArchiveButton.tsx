"use client"

import {Button} from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive';
import {APIError, archiveCourse, Course} from "@lib/api";
import {useTranslation} from "react-i18next";
import {useState} from "react";

interface ArchiveButtonProps {
    course_id: number
}

const ArchiveButton = ({course_id}: ArchiveButtonProps) => {
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation()

    const handleClick = async (course_id: number) => {
        try {
            const id = await archiveCourse(course_id);
            console.log("successfully archived course: " + id)
        } catch (error) {
            if (error instanceof APIError) setError(error);
            console.error(error);
        }
        window.location.href = "/home";
    }

    return (
        <Button
            variant="contained"
            color="secondary"
            startIcon={
                <ArchiveIcon />
            }
            sx={{
                whiteSpace: 'nowrap',
                width: 'fit-content',
                height: 'fit-content',
                marginX: 1,
                paddingX: 3,
            }}
            onClick={async () => {
                await handleClick(course_id);
                window.location.reload();
            }}
        >
                {t("archive course")}
        </Button>
    )
}

export default ArchiveButton