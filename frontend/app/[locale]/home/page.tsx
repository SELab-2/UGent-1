"use client";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function HomePage({params: {locale}}) {
    const [courses, setCourses] = useState([]); // Initialize courses as an empty array
    const [translations, setTranslations] = useState({t: (key) => key}); // Default 't' function

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(backend_url + "/courses", {withCredentials: true});
                if (response.data && Array.isArray(response.data.results)) {
                    setCourses(response.data.results); // Set courses to the results array
                } else {
                    console.error("Unexpected response structure:", response.data);
                    // Optionally handle unexpected structure
                }
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
                // Optionally handle the error, e.g., by setting an error message
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '64px'}}>
                <Typography variant="h3">
                    {translations.t("courses")}
                </Typography>
                {/* Render the list of course names */}
                <Box>
                    {courses.map(course => (
                        <Typography key={course.course_id} variant="h5">{course.name}</Typography>
                    ))}
                </Box>
            </Box>
        </div>
    );
}

export default HomePage;