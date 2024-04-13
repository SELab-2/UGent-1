"use client";
import React, {useState} from 'react';
import {Box, Button, MenuItem, Select, SelectChangeEvent, Stack, Typography} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useClientSideTranslations} from '../../../lib/clientSideHook';

type CourseControlsProps = {
    locale: string;
};

const CourseControls: React.FC<CourseControlsProps> = ({locale}) => {
    const t = useClientSideTranslations(locale, ['common']);
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
        <Box sx={{pt: 9, px: 2, display: 'flex', alignItems: 'center', gap: 2}}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" gutterBottom>
                    {t("courses")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="contained" color="secondary" startIcon={<FilterListIcon/>}>
                        {t("filter_courses")}
                    </Button>
                    <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>}>
                        {t("create_course")}
                    </Button>
                    <Button variant="contained" color="secondary" startIcon={<ArchiveIcon/>}>
                        {t("view_archive")}
                    </Button>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
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