"use client";
import {Box} from "@mui/material";
import CourseControls from "@app/[locale]/components/CourseControls";
import CoursesGrid from "@app/[locale]/components/CoursesGrid";
import React, {useState} from "react";

const YearStateComponent = () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    const [selectedYear, setSelectedYear] = useState(academicYear);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <>
            <Box sx={{height: 'fit-content', top: 0, zIndex: 10, backgroundColor: '#fff'}}>

                <CourseControls selectedYear={selectedYear} onYearChange={handleYearChange}/>

            </Box>
            <CoursesGrid selectedYear={selectedYear}/>
        </>
    );
};

export default YearStateComponent;