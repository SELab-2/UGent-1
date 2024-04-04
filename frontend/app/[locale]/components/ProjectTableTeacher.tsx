'use client';

import React, { useState } from 'react';
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
    Box
} from '@mui/material';
import {useTranslation} from "react-i18next";
import AddProjectButton from "@app/[locale]/components/AddProjectButton";

const rows = [
    { projectId: 1, projectName: 'Project 1', deadline: '21/04/2024 - 15u00', visibility: 35 },
    { projectId: 2, projectName: 'Project 2', deadline: '21/04/2024 - 15u00', visibility: 42 },
    { projectId: 3, projectName: 'Project 3', deadline: '21/04/2024 - 15u00', visibility: 45 },
    { projectId: 4, projectName: 'Project 4', deadline: '21/04/2024 - 15u00', visibility: 16 },
];
function ProjectTableTeacher() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const {t} = useTranslation();

    const handleRowClick = (row:any) => {
        setSelectedRow((prevSelectedRow) => (prevSelectedRow === row ? null : row));
        setSelectedId((prevSelectedId) => (prevSelectedId === row.projectId ? null : row.projectId));
    };

    const handleDetailsClick = () => {
        console.log(selectedId);
    }

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
                <AddProjectButton/>
                <Button
                    variant="contained"
                    color='secondary'
                    disabled={selectedId === null}
                    sx={{
                        width: 'fit-content',
                        color: 'secondary.contrastText',
                    }}
                    onClick={handleDetailsClick}
                >
                    {t("details")}
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Project Name</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Visibility</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.projectId} onClick={() => handleRowClick(row)} selected={selectedRow === row}>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selectedRow === row} />
                                </TableCell>
                                <TableCell>{row.projectName}</TableCell>
                                <TableCell>{row.deadline}</TableCell>
                                <TableCell>{row.visibility}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ProjectTableTeacher;