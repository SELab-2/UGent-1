import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Typography} from "@mui/material";
import NavBar from "@app/[locale]/components/NavBar";
import Footer from "@app/[locale]/components/Footer";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import CourseDetails from "@app/[locale]/components/CourseDetails";
import ProjectTableTeacher from "@app/[locale]/components/ProjectTableTeacher";
import StudentCoTeacherButtons from "@app/[locale]/components/StudentCoTeacherButtons";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)

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
                <CourseBanner course_id={course_id}/>
                <CourseDetails course_id={course_id}/>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'medium',
                        marginTop: 2
                    }}
                >
                    {t('projects')}
                </Typography>
                <ProjectTableTeacher course_id={course_id} />
                <StudentCoTeacherButtons course_id={course_id} />
            </Box>
            <Footer/>
        </TranslationsProvider>
    )
}