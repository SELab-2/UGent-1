"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import { getCourses, APIError, Course, UserData, getUserData } from '@lib/api';



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
            }catch(error){
                if(error instanceof APIError) setError(error);
            }
            
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <Box sx={{marginTop: '64px'}}>
                <Typography variant="h3">
                    {translations.t("courses")}
                </Typography>
                {/* Render the list of course names */}
                <Typography variant="h5">{error?.message}</Typography>
                <Box>
                    {courses.map(course => (
                        <Typography key={course.course_id} variant="h5">{course.name}</Typography>
                    ))}
                </Box>
                
                {user && 
                <ul>
                    <li><b>first name: </b>{user.first_name}</li>
                    <li><b>courses: </b>{user.course.join(', ')}</li>
                </ul>}
            </Box>
            <Container sx={{
                pt: 2,
                pb: 4,
                maxHeight: 'calc(100vh - 180px)',
                overflowY: 'auto'
            }}>
                <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                    {dummyData.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CourseCard
                                courseName={course.courseName}
                                teacherName={course.teacherName}
                                projects={course.projects}
                                t={t}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default HomePage;
