"use client"

import React from 'react';
import {useTranslation} from "react-i18next";
import {Box, Typography} from "@mui/material";

const CourseBanner = () => {
    const { t } = useTranslation();
    const course_title = "Sample Course"

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'whiteS',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                width: "calc(100% - 50px)",
                borderRadius: '16px',
                marginTop: 50,
                margin: "0 auto",
                paddingX: 2,
            }}
        >
            <Box
                textAlign="left"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
            >
                <Typography
                    variant="h1"
                    textAlign="left"
                    sx={{
                        color: 'white',
                    }}
                >
                    {course_title}
                </Typography>
            </Box>
            <Box
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start" // Align content at the top left horizontally
                alignItems="flex-start"
                textAlign="left"
            >
                <Typography
                    variant="h6"
                    paddingY={2}
                    sx={{
                        color: 'white',
                    }}
                >
                    Button placeholder
                </Typography>
            </Box>
        </Box>
    )
}

export default CourseBanner