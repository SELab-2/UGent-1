import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import AddProjectButton from "@app/[locale]/components/AddProjectButton";
import CourseDetails from "@app/[locale]/components/CourseDetails";
import {Button} from "@mui/material";
import React from "react";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course}}: { params: { locale: any, course: number } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

    const project_selected = false

    const desc_mock = "This is a mock description for the course, it should be replaced with the actual course description. It should be a brief description of the course."

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box
                sx={{
                    marginTop: '64px',
                    padding: 5
                }}
            >
                <CourseBanner course_id={course}/>
                <CourseDetails course_id={course}/>
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

                    }}
                >
                    <AddProjectButton/>
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
                    {"Project List placeholder, course_id: " + course}
                </h1>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color='secondary'
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                        }}
                    >
                        {t("view_students")}
                    </Button>
                    <Button
                        variant="contained"
                        color='secondary'
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                        }}
                    >
                        {t("view_co_teachers")}
                    </Button>
                </Box>
            </Box>
            <Footer/>
        </TranslationsProvider>
    )
}