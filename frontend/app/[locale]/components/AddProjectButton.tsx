"use client";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import Link from "next/link";
import {addProject} from "@lib/api";
import {useState, useEffect} from "react";
import {getUserData} from "@lib/api";

interface EditCourseButtonProps{
    course_id:number
}

const AddProjectButton = ({course_id}: EditCourseButtonProps) => {
    const {t} = useTranslation();
    const [role, setRole] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getUserData();
            setRole(userData.role);
        }
        fetchData();
    }
    , []);

    if (role !== 3) {
        return (
            <Button
                variant="contained"
                color="secondary"
                sx={{
                    margin: '10px'
                }}
                onClick={async () => {
                    const project_id = await addProject(course_id);
                    window.location.href = `/project/${project_id}/edit`;
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: 'secondary.contrastText',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {t("add_project")}
                </Typography>
            </Button>
            )
    } 
}
export default AddProjectButton