"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography, Skeleton} from "@mui/material";
import {getUserData, UserData} from "@lib/api";
import {useState, useEffect} from "react";

interface EditCourseButtonProps{
    course_id:number
}

const AddProjectButton = ({course_id}: EditCourseButtonProps) => {
    const {t} = useTranslation();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        setLoading(false);
        fetchUser();
    }, [])

    return (
        loading ?
            <Skeleton
                variant='rectangular'
                width={150}
                height={45}
                sx={{
                    borderRadius: '8px'
                }}
            /> :
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
                    {t("add_project")}
                </Typography>
            </Button>
    )}
    </>
    )
}
export default AddProjectButton