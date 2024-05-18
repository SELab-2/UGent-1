"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import {addProject, getUserData, UserData} from "@lib/api";
import {useState, useEffect} from "react";

interface EditCourseButtonProps{
    course_id:number
}

const AddProjectButton = ({course_id}: EditCourseButtonProps) => {
    const {t} = useTranslation();
    const [user, setUser] = useState<UserData | null>(null);

    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        fetchUser();
    }, [])

    return (
        <>
        {user?.role !== 3 && (
        <Button
            variant="contained"
            color="secondary"
            sx={{
                width: 'fit-content',
                height: 'fit-content',
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
    )}
    </>
    )
}
export default AddProjectButton