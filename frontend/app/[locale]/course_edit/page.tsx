import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";

async function CourseEditPage({ params: { locale, courseId } }: { params: { locale: any, courseId: number } }) {
    const {t, resources} = await initTranslations(locale, ["common"])


    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar />
            <Box sx={{ marginTop: '64px' }}>
                <Typography variant="h3">
                    {t("course_edit")}
                </Typography>
                <EditCourseForm courseId={courseId}/>
            </Box>
        </TranslationsProvider>
    );
}

export default CourseEditPage;
