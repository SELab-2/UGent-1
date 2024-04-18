import NavBar from "@app/[locale]/components/NavBar";
import { Box } from "@mui/material";
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";

const i18nNamespaces = ['common']

async function CourseCreatePage({params: {locale}}: { params: { locale: any } }) {
    const {t, resources} = await initTranslations(locale, ["common"])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            <Box
                sx={{
                    padding: 5,
                }}
            >
                <CreateCourseForm/>
            </Box>

        </TranslationsProvider>
    )
}

export default CourseCreatePage;
