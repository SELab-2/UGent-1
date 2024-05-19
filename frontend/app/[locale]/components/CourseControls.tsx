"use client";
import React, {useEffect, useState} from 'react';
import {Box, Button, MenuItem, Select, Stack, Typography} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArchiveIcon from '@mui/icons-material/Archive';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useTranslation} from "react-i18next";
import Link from 'next/link';
import {APIError, getUserData, UserData} from "@lib/api";

const CourseControls = ({selectedYear, onYearChange}) => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;

    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<APIError | null>(null);

    const {t} = useTranslation()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
                console.error(error);
            }


        };


        fetchUser();
    }, []);




    const years = [
        `${currentYear - 2}-${(currentYear - 1).toString().slice(-2)}`,
        academicYear,
        `${currentYear}-${(currentYear + 1).toString().slice(-2)}`
    ];

    return (
        <Box sx={{py:1, px: 2, display: 'flex', alignItems: 'center', gap: 2}}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h3" gutterBottom>
                    {t("courses")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="contained" color="secondary" startIcon={<FilterListIcon/>}>
                        {t("filter_courses")}
                    </Button>
                    {user?.role !== 3 ? (
                        <Link href="/course/add" passHref>
                            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>}>
                                {t("create_course")}
                            </Button>
                        </Link>
                    ) : null
                    }
                    <Link href="/course/all" passHref>
                        <Button variant="contained" color="secondary" startIcon={<ViewListIcon/>}>
                            {t("all_courses")}
                        </Button>
                    </Link>
                    <Link href="/course/archived" passHref>
                        <Button variant="contained" color="secondary" startIcon={<ArchiveIcon/>}>
                            {t("view_archive")}
                        </Button>
                    </Link>
                    <Link href="/admin/users" passHref>
                        <Button variant="contained" color="secondary" startIcon={<SupervisorAccountIcon/>}>
                            {t("site users")}
                        </Button>
                    </Link>
                    <Select
                        value={selectedYear}
                        onChange={onYearChange}
                        displayEmpty
                        color="secondary"
                        variant="outlined"
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{height: 40, '.MuiSelect-select': {pl: 1}}}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Stack>
        </Box>
    );



};

export default CourseControls;