"use client"
import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {APIError, getUserData, UserData} from "@lib/api";

interface StudentCoTeacherButtonsProps {
    course_id:number
}

const StudentCoTeacherButtons = ({course_id}: StudentCoTeacherButtonsProps) => {
    /*
    * This component displays the student and co-teacher buttons on the course page.
    * It allows the user to view the students and co-teachers of the course.
    * @param course_id: The id of the course
    s*/
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }

        };

        fetchProjects();
    }, [course_id]);

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
            {user?.role !== 3 ? (
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
            ): null
            }
        </Box>
    );
}

export default StudentCoTeacherButtons