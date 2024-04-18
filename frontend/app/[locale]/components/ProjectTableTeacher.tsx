'use client';

import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useTranslation} from "react-i18next";
import AddProjectButton from "@app/[locale]/components/AddProjectButton";
import {Project, getProjectsFromCourse, APIError, UserData, getUserData} from "@lib/api";

interface ProjectTableTeacherProps {
    course_id: number;
}

function ProjectTableTeacher({course_id}: ProjectTableTeacherProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjects(await getProjectsFromCourse(course_id));
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }

        };

        fetchProjects();
    }, [course_id]);

    const handleRowClick = (row: any) => {
        setSelectedRow((prevSelectedRow) => (prevSelectedRow === row ? null : row));
        setSelectedId((prevSelectedId) => (prevSelectedId === row.project_id ? null : row.project_id));
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: "calc(100% - 40px)",

                }}
            >
                {user?.role !== 3 ? (
                    <AddProjectButton/>
                ): null}
                <Button
                    variant="contained"
                    color='secondary'
                    disabled={selectedId === null}
                    href={'/project/' + selectedId}
                    sx={{
                        width: 'fit-content',
                        color: 'secondary.contrastText',
                    }}
                >
                    {t("details")}
                </Button>
            </Box>
            {projects.length === 0 ? (
                <Typography
                    variant="h5"
                    sx={{
                        color: 'text.disabled',
                        marginTop: 2
                    }}
                >
                    {t('no_projects')}
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{width: "calc(100% - 40px)"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>{t("project_name")}</TableCell>
                                <TableCell>{t("deadline")}</TableCell>
                                <TableCell>{t("visibility")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((row) => (
                                <TableRow key={row.project_id} onClick={() => handleRowClick(row)}
                                          selected={selectedRow === row}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selectedRow === row}/>
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.deadline}</TableCell>
                                    <TableCell>
                                        {row.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default ProjectTableTeacher;