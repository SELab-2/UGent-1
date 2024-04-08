"use client";
import React, {useEffect, useState} from 'react';
import {APIError, Course, getCourses, getUserData, UserData} from '@lib/api';
import {Box, Container, Grid} from '@mui/material';
import NavBar from '../components/NavBar';
import CourseCard from '../components/CourseCard';
import CourseControls from '../components/CourseControls';
import initTranslations from "../../i18n";

function HomePage({params: {locale}} : {params: {locale: any}}) {
    const [courses, setCourses] = useState<Course[]>([]); // Initialize courses as an empty array
    const [user, setUser] = useState<UserData | null>(null);
    const [translations, setTranslations] = useState({t: (key: any) => key}); // Default 't' function
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    useEffect(() => {
        

        const fetchCourses = async () => {
            try{
                setCourses(await getCourses());
                setUser(await getUserData());
                console.log(user);
            }catch(error){
                if(error instanceof APIError) setError(error);
            }
            
        };

        fetchCourses();
    }, []);

    return (
        <>
            <NavBar/>
            <Box sx={{position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff'}}>
                <Container>
                    <CourseControls
                        locale={locale}
                    />
                </Container>
            </Box>
            <Container sx={{
                pt: 2,
                pb: 4,
                maxHeight: 'calc(100vh - 180px)',
                overflowY: 'auto'
            }}>
                <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                    {courses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CourseCard
                                courseId={course['course_id']}
                                courseName={course['name']}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default HomePage;