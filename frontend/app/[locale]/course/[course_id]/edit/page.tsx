import NavBar from "@app/[locale]/components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";
import DeleteButton from "@app/[locale]/components/course_components/DeleteButton";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

async function CourseEditPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const {t, resources} = await initTranslations(locale, ["common"])
    console.log(course_id);

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box
                margin={5}
                padding={5}
                sx={{
                    display: 'flex',
                    marginTop: '64px',
                    alignItems: 'space-between',
                    justifyContent: 'space-between',
                }}
            >
                <EditCourseForm courseId={course_id}/>
                <DeleteButton courseId={course_id}/>
            </Box>
        </TranslationsProvider>
    );
}

export default CourseEditPage;
