"use client"

import {Button} from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive';
import {APIError, archiveCourse} from "@lib/api";
import {useTranslation} from "react-i18next";
import {useState} from "react";

interface ArchiveButtonProps {
    course_id: number
}

const ArchiveButton = ({course_id}: ArchiveButtonProps) => {
    /*
    * This component displays the archive button for a course.
    * @param course_id: The id of the course
    */
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation()

    const handleClick = async () => {
        try {
            const id = await archiveCourse(course_id);
            console.log("successfully archived course: " + id);
            window.location.href = "/home";
        } catch (error) {
            if (error instanceof APIError) setError(error);
            console.error(error);
        }
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
            onClick={handleClick}
        >
                {t("archive course")}
        </Button>
    )
}

export default ArchiveButton