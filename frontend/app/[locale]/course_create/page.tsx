import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";
import CancelButton from "@app/[locale]/components/course_components/CancelButton";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];


async function CourseCreatePage({ params: { locale } }: { params: { locale: any } }) {
    const {t, resources} = await initTranslations(locale, ["common"])


    // translations, redirect after save and cancel dont work

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar />
            <Box sx={{margin: '64px', marginTop: '96px', position: 'relative'}}>
                <CancelButton/>
                <Box sx={{marginRight: '40px'}}>
                    <CreateCourseForm/>
                </Box>
            </Box>
        </TranslationsProvider>
    )
}

export default CourseCreatePage;
