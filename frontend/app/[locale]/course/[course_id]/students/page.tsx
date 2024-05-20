"use client"
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import NavBar from "@app/[locale]/components/NavBar";
import ListView from '@app/[locale]/components/ListView';
import {Button, Box} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect, useState} from "react";
import EmailIcon from '@mui/icons-material/Email';
import {getUserData} from "@lib/api";

const i18nNamespaces = ['common']

export default function StudentsPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const [user, setUser] = useState<any>();
    const [translations, setTranslations] = useState({ t: (s) => '', resources: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranslations = async () => {
            setLoading(true);
            try {
                const { t, resources } = await initTranslations(locale, i18nNamespaces);
                setTranslations({ t, resources });
            } catch (error) {
                console.error('Failed to initialize translations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranslations();
    }, [locale, i18nNamespaces]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserData();
                setUser(user);

            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        fetchUser().then(() => {
            setLoading(false)
        });

    }, [course_id, user?.course]);

    useEffect(() => {
        if (!loading && user) {
            if (!user.course.includes(Number(course_id))) {
                window.location.href = `/403/`;
            } else {
                console.log("User is in course");
            }
        }
    }, [loading, user, course_id]);

    const headers = [
        <React.Fragment key="email"><EmailIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + translations.t('email')}</React.Fragment>];
    const headers_backend = ['email'];
    
    return (
        <TranslationsProvider
            resources={translations.resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar />
            <Box width={'100%'} style={{ padding: 20 }}>
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
                        get={'course_students'}
                        action_name={'remove_from_course'}
                        action_text={translations.t('remove_user_from_course')}
                        search_text={translations.t('search_student')}
                    />
                </Box>
            </Box>
        </TranslationsProvider>
    );
}
