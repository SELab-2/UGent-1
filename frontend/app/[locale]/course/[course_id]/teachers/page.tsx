"use client"
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import {Box, Button, CircularProgress} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect, useState} from "react";
import EmailIcon from '@mui/icons-material/Email';
import {fetchUserData, UserData} from "@lib/api";

const i18nNamespaces = ['common']

export default function TeachersPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const [user, setUser] = useState<UserData|null>(null);
    const [translations, setTranslations] = useState({ t: (s) => '', resources: {} });
    const [userLoading, setUserLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(true);

    useEffect(() => {

        initTranslations(locale, i18nNamespaces).then(({ t, resources }) => {
            setTranslations({ t, resources });
        });

        const fetchUser = async () => {
            try {
                const userData = await fetchUserData();
                setUser(userData);
                if (!userData.course.includes(Number(course_id))) {
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            } finally {
                setUserLoading(false);
            }
        }

        fetchUser();
    }, [course_id, locale]);


    const headers = [<React.Fragment key="email"><EmailIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + translations.t('email')}</React.Fragment>];
    const headers_backend = ['email'];

    return (
        <TranslationsProvider
            resources={translations.resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                !accessDenied &&
                <Box width={'100%'} style={{padding: 20}}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ArrowBackIcon/>}
                        href={`/course/${course_id}`}
                    >
                        {translations.t('back_to') + ' ' + translations.t('course') + ' ' + translations.t('page')}
                    </Button>
                    <Box marginTop={{ xs: 2, md: 4 }}>
                    <ListView
                        admin={true}
                        headers={headers}
                        headers_backend={headers_backend}
                        sortable={[true]}
                        get_id={course_id}
                        get={'course_teachers'}
                        search_text={translations.t('search_teacher')}
                    />
                    </Box>
                </Box>
            )}
        </TranslationsProvider>
    );
}
