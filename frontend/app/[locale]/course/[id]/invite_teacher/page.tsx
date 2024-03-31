// "use client" directive should be at the beginning of the file
"use client";
import React from 'react';
import NavBar from '../../../components/NavBar';
import ListView from '../../../components/ListView';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import initTranslations from '@app/i18n';
import {getUsers, APIError, User} from '@lib/api';
import {add_course_to_user} from '@lib/api';


const CourseStudentpage = ({params: {locale, id}}: { params: { locale: any, id: any } }) => {
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


    // TODO add user to course function to pass to ListView


    const headers = ['Id', 'Name', 'Email', 'Role'];

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '32px'}}>
                <Typography variant="h5">{error?.message}</Typography>
                <Box>
                <ListView
                    admin={true}
                    action_name={'Add to course'}
                    action={async (user_id: number) => add_course_to_user(user_id, id)}
                    headers={headers}
                    values={id ? users.filter(user => user.role === 2).map(user => [user.id, user.first_name + ' ' + user.last_name, user.email, 2]) : []}
                />
                </Box>
            </Box>
        </div>
    );
};


export default CourseStudentpage;