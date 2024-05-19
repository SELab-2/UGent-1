"use client"
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Typography, Grid, CircularProgress} from "@mui/material";
import NavBar from "@app/[locale]/components/NavBar";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import CourseDetails from "@app/[locale]/components/CourseDetails";
import StudentCoTeacherButtons from "@app/[locale]/components/StudentCoTeacherButtons";
import JoinCourseWithToken from "@app/[locale]/components/JoinCourseWithToken";
import ListView from '@app/[locale]/components/ListView';
import AddProjectButton from "@app/[locale]/components/AddProjectButton";
import React, { useEffect, useState} from "react";
import AccesAlarm from '@mui/icons-material/AccessAlarm';
import Person from '@mui/icons-material/Person';
import {getUserData} from "@lib/api";

const i18nNamespaces = ['common']

export default function Course({params: {locale, course_id}, searchParams: {token}}:
                                         { params: { locale: any, course_id: number }, searchParams: { token: string } }) {
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

    const headers = [
        <React.Fragment key="name"><Person style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + translations.t('name')}</React.Fragment>,
       <React.Fragment key="deadline"><AccesAlarm style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + translations.t('deadline')}</React.Fragment>,
       '']
    const headers_backend = ['name', 'deadline', '']

    return (
        <TranslationsProvider
            resources={translations.resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <JoinCourseWithToken token={token} course_id={course_id} />
            <NavBar />
            {loading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ): (
                user?.course.includes(Number(course_id)) ? (
                    <Box
                        sx={{
                            paddingTop: 5,
                            width: '100%',
                            px: { xs: 2, sm: 3, md: 5 },
                        }}
                    >
                        <CourseBanner course_id={course_id} />
                        <CourseDetails course_id={course_id} />
                        <Grid container alignItems="center" spacing={2} mt={2}>
                            <Grid item xs={12} sm="auto">
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 'medium',
                                        textAlign: { xs: 'center', sm: 'left' },
                                    }}
                                >
                                    {translations.t('projects')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-start' }} padding={2}>
                                    <AddProjectButton course_id={course_id} />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box
                            justifyContent="left"
                            width="100%"
                        >
                            <ListView
                                search_text={translations.t('search_for_project')}
                                admin={false}
                                headers={headers}
                                headers_backend={headers_backend}
                                sortable={[true, true, false, true]}
                                get={'projects'}
                                get_id={course_id}
                            />
                        </Box>
                        <StudentCoTeacherButtons course_id={course_id} />
                    </Box>
                ) : (
                    window.location.href = `/403/`
                ))
            }
        </TranslationsProvider>
    )
}
