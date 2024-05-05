import NavBar from "@app/[locale]/components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";
import DeleteButton from "@app/[locale]/components/course_components/DeleteButton";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import ArchiveButton from "@app/[locale]/components/course_components/ArchiveButton";

async function CourseEditPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const {t, resources} = await initTranslations(locale, ["common"])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box
                padding={5}
                sx={{
                    display: 'flex',
                    alignItems: 'space-between',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <EditCourseForm courseId={course_id}/>
                <DeleteButton courseId={course_id}/>
                <ArchiveButton course_id={course_id}/>
            </Box>
            <div id="extramargin" style={{height: "100px"}}></div>
        </TranslationsProvider>
    );
}

export default CourseEditPage;
