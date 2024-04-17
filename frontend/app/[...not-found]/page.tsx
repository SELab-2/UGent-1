import NavBar from "@app/[locale]/components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";


async function Page_404({params: {locale}}: { params: { locale: any } }) {
    const {t, resources} = await initTranslations(locale, ["common"])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            <Box sx={{marginTop: '64px'}}>
                <Typography variant="h3">
                    {t("page_not_found")}
                </Typography>
            </Box>
        </TranslationsProvider>
    );
}

export default Page_404;
