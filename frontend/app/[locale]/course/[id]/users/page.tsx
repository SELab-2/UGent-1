// "use client" directive should be at the beginning of the file
"use client";
import React from 'react';
import NavBar from '../../../components/NavBar';
import ListView from '../../../components/ListView';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import initTranslations from '@app/i18n';
import {getUsers, APIError, User, remove_course_from_user} from '@lib/api';


const CourseUserpage = ({params: {locale, id}}: { params: { locale: any, id: string } }) => {
    const [users, setUsers] = React.useState<User[]>([]);
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
        const fetchUsers = async () => {
            try {
                setUsers(await getUsers());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchUsers();
    }, []);

    const headers = ['Name', 'Email', 'Role']; // Example headers

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '32px'}}>
                <Typography variant="h5">{error?.message}</Typography>
                <Box>
                    <ListView
                        admin={true}
                        headers={headers}
                        tablenames={['Students', 'Teachers']}
                        action_name={'Remove from course'}
                        action={async (user_id: number) => remove_course_from_user(user_id, id)}
                        // Filter users based on the course ID if available
                        values={id ? users.filter(user => user.course.includes(parseInt(id))).filter(user => user.role === 3).map(user => [user.id, user.first_name + ' ' + user.last_name, user.email, 3]) : []}
                        secondvalues={id ? users.filter(user => user.course.includes(parseInt(id))).filter(user => user.role === 2).map(user => [user.id, user.first_name + ' ' + user.last_name, user.email, 2]) : []}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default CourseUserpage;
