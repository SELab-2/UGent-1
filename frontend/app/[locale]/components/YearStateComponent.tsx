"use client";
import {Box} from "@mui/material";
import CourseControls from "@app/[locale]/components/CourseControls";
import CoursesGrid from "@app/[locale]/components/CoursesGrid";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const YearStateComponent = () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    const [selectedYear, setSelectedYear] = useState(academicYear);

    const {t} = useTranslation()

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'column'}
                height={'fit-content'}
                width={'100%'}
                justifyContent={'center'}
            >

                <CourseControls selectedYear={selectedYear} onYearChange={handleYearChange}/>
                <CoursesGrid selectedYear={selectedYear}/>

            </Box>
        </>
    );
};

export default YearStateComponent;
