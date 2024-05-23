"use client"

import {Button} from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive';
import {APIError, archiveCourse, getCourse, unArchiveCourse} from "@lib/api";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

interface ArchiveButtonProps {
    course_id: number
}

const ArchiveButton = ({course_id}: ArchiveButtonProps) => {
    /*
    * This component displays the archive button for a course.
    * @param course_id: The id of the course
    */
    const [error, setError] = useState<APIError | null>(null);
    const [archived, setArchived] = useState<boolean>(false);
    const {t} = useTranslation()


    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const course = await getCourse(course_id);
                setArchived(course.archived);
            } catch (error) {
                console.error("There was an error fetching the course data:", error);
            }
        };

        fetchCourseData();
    }, [course_id]);



    const handleClick = async () => {
        if (archived){
            try {
                await unArchiveCourse(course_id);
                window.location.href = "/home";
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }
        }
        else {
            try {
                await archiveCourse(course_id);
                window.location.href = "/home";
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }
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
            {
                archived ?
                    t("unarchive course") :
                    t("archive course")
            }
        </Button>
    )
}

export default ArchiveButton