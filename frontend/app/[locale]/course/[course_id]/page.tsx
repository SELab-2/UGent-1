import React from 'react';
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import AddButton from "@app/[locale]/components/AddButton";
import {Button} from "@mui/material";
import JoinCourseWithToken from "@app/[locale]/components/JoinCourseWithToken";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course_id}, searchParams: {token}}:
                                         { params: { locale: any, course_id: string }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const project_selected = false

    const desc_mock = "This is a mock description for the course, it should be replaced with the actual course description. It should be a brief description of the course."

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <JoinCourseWithToken token={token} course_id={course_id}></JoinCourseWithToken>
            <NavBar/>
            <Box sx={{marginTop: '64px', padding: 5}}>
                <CourseBanner/>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('description')}
                </Typography>
                <Typography variant="h6">
                    {desc_mock}
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('projects')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: "calc(100% - 40px)",
                        paddingX: 2,
                    }}
                >
                    <AddButton translationkey='add_project'/>
                    <Button
                        variant="contained"
                        color='secondary'
                        disabled={!project_selected}
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                        }}
                    >
                        {t("details")}
                    </Button>
                </Box>
                <h1>
                    {course_id}
                </h1>
            </Box>

            <Footer/>
        </TranslationsProvider>
    )
}