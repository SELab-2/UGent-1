"use client";
import React, {useEffect, useState} from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import ListView from "@app/[locale]/components/ListView";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import {getUsers, APIError, User} from '@lib/api';


function Userpage({params: {locale}}: { params: { locale: any } }) {
    const [users, setUsers] = useState<User[]>([]);
    const [translations, setTranslations] = useState({t: (key: any) => key});
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUsers(await getUsers());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }

        };

        fetchUsers();
    }, []);

    const headers = ["Name", "Email", "Role"]; // Example headers

    return (
        <div>
            <NavBar/>
            <Box sx={{marginTop: '32px'}}>
                {/* Render the list of course names */}
                <Typography variant="h5">{error?.message}</Typography>
                <Box>
                    {/* use ListView component */}
                    <Box>
                        <ListView
                            admin={true}
                            headers={headers}
                            values={users.map(user => [user.username, user.email, user.role])}
                        />
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default Userpage;