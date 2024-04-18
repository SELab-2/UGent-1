import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Typography} from "@mui/material";
import NavBar from "@app/[locale]/components/NavBar";
import CourseBanner from "@app/[locale]/components/CourseBanner";
import CourseDetails from "@app/[locale]/components/CourseDetails";
import StudentCoTeacherButtons from "@app/[locale]/components/StudentCoTeacherButtons";
import JoinCourseWithToken from "@app/[locale]/components/JoinCourseWithToken";
import ListView from '@app/[locale]/components/ListView';
import AddProjectButton from "@app/[locale]/components/AddProjectButton";

const i18nNamespaces = ['common']

export default async function Course({params: {locale, course_id}, searchParams: {token}}:
                                         { params: { locale: any, course_id: number }, searchParams: { token: string } }) {
    const {t, resources} = await initTranslations(locale, i18nNamespaces)
    const headers = [t('name'), t('description'), t('status'), t('deadline'), t('view')]

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <JoinCourseWithToken token={token} course_id={course_id}></JoinCourseWithToken>
            <NavBar/>
            <Box
                sx={{
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
                <AddProjectButton/>
                <ListView
                    admin={false}
                    headers={headers}
                    sortable={[true, true, false, true]}
                    get={'projects'}
                    get_id={course_id}
                />
                <StudentCoTeacherButtons course_id={course_id}/>
            </Box>

        </TranslationsProvider>
    )
}