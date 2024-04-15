import NavBar from "../../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../../../i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];


async function CourseCreatePage({ params: { locale } }: { params: { locale: any } }) {
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
                    {t("course_create")}
                </Typography>
                <CreateCourseForm />
            </Box>
        </TranslationsProvider>
    );
}

export default CourseCreatePage;
