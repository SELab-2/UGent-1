import NavBar from "@app/[locale]/components/NavBar";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";


async function CourseCreatePage({params: {locale}}: { params: { locale: any } }) {
    const {t, resources} = await initTranslations(locale, ["common"])

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
                <CreateCourseForm/>
            </Box>
        </TranslationsProvider>
    )
}

export default CourseCreatePage;
