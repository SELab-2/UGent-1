"use client";
import React, {useState} from 'react';
import {Box, Button, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArchiveIcon from '@mui/icons-material/Archive';

const CourseControls = () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    const [selectedYear, setSelectedYear] = useState(academicYear);

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value as string);
    };

    const years = [
        `${currentYear - 2}-${(currentYear - 1).toString().slice(-2)}`,
        academicYear,
        `${currentYear}-${(currentYear + 1).toString().slice(-2)}`
    ];

    return (
        <Box sx={{pt: '64px', px: 2, display: 'flex', alignItems: 'center', gap: 2}}>
            <Button variant="contained" color="secondary" startIcon={<FilterListIcon/>}>
                Filter courses
            </Button>
            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>}>
                Create course
            </Button>
            <Button variant="contained" color="secondary" startIcon={<ArchiveIcon/>}>
                View archive
            </Button>
            <Select
                value={selectedYear}
                onChange={handleYearChange}
                displayEmpty
                color="secondary"
                variant="outlined"
                sx={{height: '40px'}}
            >
                {years.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default CourseControls;
