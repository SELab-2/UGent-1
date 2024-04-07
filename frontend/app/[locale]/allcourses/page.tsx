// "use client" directive should be at the beginning of the file
"use client";
import React from 'react';
import NavBar from '../components/NavBar';
import ListView from '../components/ListView';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import initTranslations from '@app/i18n';
import {getCourses, APIError, Course} from '@lib/api';
import {add_course_to_user} from '@lib/api';


const CourseStudentpage = ({params: {locale, id}}: { params: { locale: any, id: any } }) => {
    const [courses, setcourses] = React.useState<Course[]>([]);
    const [translations, setTranslations] = React.useState({t: (key: any) => key});
    const [error, setError] = React.useState<APIError | null>(null);

    React.useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    React.useEffect(() => {
        const fetchcourses = async () => {
            try {
                setcourses(await getCourses());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchcourses();
    }, []);


    // TODO add course to course function to pass to ListView


    const headers = ['Id', 'Name'];

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '32px'}}>
                <Typography variant="h5">{error?.message}</Typography>
                <Box>
                <ListView
                    admin={true}
                    action_name={'Join course'}
                    action={async (course_id: number) => add_course_to_user(course_id, id)}
                    headers={headers}
                    values={id ? courses.map(course => [course.id, course.name]) : []}
                />
                </Box>
            </Box>
        </div>
    );
};


export default CourseStudentpage;